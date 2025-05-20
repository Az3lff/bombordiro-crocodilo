package jwtmanager

// A small, self‑contained helper for issuing, verifying and refreshing JWT tokens.
//
// Features
//   • HS256 signing (easy to switch to RS256/ES256 if desired).
//   • Configurable TTL for access & refresh tokens.
//   • Pluggable storage layer for refresh‑token tracking (in‑memory implementation included).
//   • Helpful errors for expired / invalid / unknown tokens.
//
// Typical usage:
//   store   := jwtmanager.NewMemoryStorage()
//   manager := jwtmanager.New("myAccessSecret", "myRefreshSecret", 15*time.Minute, 30*24*time.Hour, store)
//
//   acc, ref, _ := manager.GenerateTokens("42", nil)
//   claims, _   := manager.ParseAccessToken(acc)
//   newAcc, newRef, _ := manager.RefreshTokens(ref)
//
//   _ = manager.RevokeRefreshToken("<jti>")
//
// Production notes:
//   – Replace memory storage with Redis/PostgreSQL implementation.
//   – Rotate secrets regularly; keep them out of VCS.
//   – Consider RS256 + public‑key rollout for multi‑service environments.

import (
	"errors"
	"golang.org/x/crypto/bcrypt"
	"sync"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

var (
	// ErrInvalidToken is returned when token signature, algorithm or type is wrong.
	ErrInvalidToken = errors.New("invalid token")
	// ErrExpiredToken is returned when token's exp claim is in the past.
	ErrExpiredToken = errors.New("token is expired")
	// ErrTokenNotFound is returned when token isn't present in storage (revoked or never existed).
	ErrTokenNotFound = errors.New("token not found")
	ErrPasswordHash  = errors.New("password hashing failed")
	ErrPasswordMatch = errors.New("passwords do not match")
)

// Manager handles JWT generation & verification and refresh‑token rotation.
// It is safe for concurrent use.
// Secrets are passed as _raw bytes_ so caller may load them from env or KMS.
//
// accessTTL should be short (e.g. 15m); refreshTTL can be days/weeks.
// storage is required only for refresh‑token tracking; pass nil to disable refresh flow.
//
// Example:
//
//	m := jwtmanager.New(accessSecret, refreshSecret, 15*time.Minute, 30*24*time.Hour, jwtmanager.NewMemoryStorage())
//
//	access, refresh, err := m.GenerateTokens(userID, nil)
//	claims, err        := m.ParseAccessToken(access)
//	newAcc, newRef, _  := m.RefreshTokens(refresh)
//
//	_ = m.RevokeRefreshToken("<jti>")
//
// In a microservice setup many instances may share the same storage backend (e.g. Redis).
//
// NOTE: For asymmetric algorithms switch the SigningMethod and return the *public* key
//
//	in KeyFunc below.
type Manager struct {
	accessSecret  []byte
	refreshSecret []byte
	accessTTL     time.Duration
	refreshTTL    time.Duration
	storage       RefreshStorage
}

// New creates Manager. Panics if secrets are empty.
func New(accessSecret, refreshSecret string, accessTTL, refreshTTL time.Duration, storage RefreshStorage) *Manager {
	if accessSecret == "" || refreshSecret == "" {
		panic("jwtmanager: secrets must not be empty")
	}
	return &Manager{
		accessSecret:  []byte(accessSecret),
		refreshSecret: []byte(refreshSecret),
		accessTTL:     accessTTL,
		refreshTTL:    refreshTTL,
		storage:       storage,
	}
}

// RefreshStorage abstracts persistence for refresh tokens (black‑/whitelist).
// Implement with Redis, Postgres etc. In many cases a short TTL + storage‑less flow is fine.
// SaveToken SHOULD be idempotent.
// DeleteToken SHOULD tolerate missing tokens (return nil).
// TokenExists MUST return (false,nil) if token expired according to its record.
//
// userID is kept to bind refresh tokens to a particular subject; this also lets you invalidate
// all refresh tokens for a user with a single DB query if you extend the interface.
type RefreshStorage interface {
	SaveToken(userID string, tokenID string, expiresAt time.Time) error
	DeleteToken(tokenID string) error
	TokenExists(userID, tokenID string) (bool, error)
}

// GenerateTokens returns signed access & refresh tokens.
// extraClaims are merged into the access token only (not refresh) – don’t put secrets there.
func (m *Manager) GenerateTokens(userID string, extraClaims jwt.MapClaims) (access, refresh string, err error) {
	now := time.Now().UTC()

	// ---- access ----
	accClaims := jwt.MapClaims{
		"sub": userID,
		"exp": now.Add(m.accessTTL).Unix(),
		"iat": now.Unix(),
		"typ": "access",
	}
	for k, v := range extraClaims {
		accClaims[k] = v
	}

	access, err = jwt.NewWithClaims(jwt.SigningMethodHS256, accClaims).SignedString(m.accessSecret)
	if err != nil {
		return "", "", err
	}

	// ---- refresh ----
	jti := uuid.NewString()
	refClaims := jwt.MapClaims{
		"sub": userID,
		"jti": jti,
		"exp": now.Add(m.refreshTTL).Unix(),
		"iat": now.Unix(),
		"typ": "refresh",
	}

	refresh, err = jwt.NewWithClaims(jwt.SigningMethodHS256, refClaims).SignedString(m.refreshSecret)
	if err != nil {
		return "", "", err
	}

	if m.storage != nil {
		if err := m.storage.SaveToken(userID, jti, now.Add(m.refreshTTL)); err != nil {
			return "", "", err
		}
	}
	return access, refresh, nil
}

// ParseAccessToken verifies signature & expiry and returns claims.
func (m *Manager) ParseAccessToken(tokenStr string) (jwt.MapClaims, error) {
	claims, err := m.parse(tokenStr, m.accessSecret)
	if err != nil {
		return nil, err
	}
	if claims["typ"] != "access" {
		return nil, ErrInvalidToken
	}
	return claims, nil
}

// RefreshTokens validates a refresh token, rotates it and returns a fresh pair.
// Old refresh token is revoked. Set Manager.storage == nil to disable this feature entirely.
func (m *Manager) RefreshTokens(refreshToken string) (newAccess, newRefresh string, err error) {
	claims, err := m.parse(refreshToken, m.refreshSecret)
	if err != nil {
		return "", "", err
	}

	userID, _ := claims["sub"].(string)
	jti, _ := claims["jti"].(string)

	if m.storage != nil {
		ok, err := m.storage.TokenExists(userID, jti)
		if err != nil {
			return "", "", err
		}
		if !ok {
			return "", "", ErrTokenNotFound
		}
		_ = m.storage.DeleteToken(jti) // best‑effort
	}

	return m.GenerateTokens(userID, nil)
}

// RevokeRefreshToken removes refresh token from storage so it can’t be used again.
// Use this for manual logout flows.
func (m *Manager) RevokeRefreshToken(tokenID string) error {
	if m.storage == nil {
		return errors.New("storage disabled")
	}
	return m.storage.DeleteToken(tokenID)
}

// internal generic parser.
func (m *Manager) parse(tokenStr string, secret []byte) (jwt.MapClaims, error) {
	token, err := jwt.Parse(tokenStr, func(t *jwt.Token) (interface{}, error) {
		if t.Method.Alg() != jwt.SigningMethodHS256.Alg() {
			return nil, ErrInvalidToken
		}
		return secret, nil
	})
	if err != nil || !token.Valid {
		return nil, ErrInvalidToken
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return nil, ErrInvalidToken
	}

	if exp, ok := claims["exp"].(float64); ok {
		if int64(exp) < time.Now().Unix() {
			return nil, ErrExpiredToken
		}
	}

	return claims, nil
}

/*************************** MEMORY STORAGE ***************************/

// memoryStorage is a threadsafe map‑backed implementation – good for tests & small services.

type memoryStorage struct {
	mu     sync.RWMutex
	tokens map[string]storeItem
}

type storeItem struct {
	userID    string
	expiresAt time.Time
}

// NewMemoryStorage returns an in‑memory RefreshStorage.
func NewMemoryStorage() RefreshStorage {
	return &memoryStorage{
		tokens: make(map[string]storeItem),
	}
}

func (s *memoryStorage) SaveToken(userID, tokenID string, expiresAt time.Time) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.tokens[tokenID] = storeItem{userID: userID, expiresAt: expiresAt}
	return nil
}

func (s *memoryStorage) DeleteToken(tokenID string) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	delete(s.tokens, tokenID)
	return nil
}

func (s *memoryStorage) TokenExists(userID, tokenID string) (bool, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	item, ok := s.tokens[tokenID]
	if !ok {
		return false, nil
	}
	if item.userID != userID || time.Now().After(item.expiresAt) {
		return false, nil
	}
	return true, nil
}

func (m *Manager) HashPassword(password string) (string, error) {
	// Хэшируем пароль с дефолтной стоимостью
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", ErrPasswordHash
	}
	return string(hashedPassword), nil
}

// Сравнение пароля с хэшированным
func (m *Manager) ComparePassword(hashedPassword, password string) error {
	// Проверяем, совпадает ли введённый пароль с хэшированным
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	if err != nil {
		return ErrPasswordMatch
	}
	return nil
}

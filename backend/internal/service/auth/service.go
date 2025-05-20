package auth

import (
	"github.com/Az3lff/bombordiro-crocodilo/internal/repository/pg/auth"
	cache "github.com/Az3lff/bombordiro-crocodilo/internal/repository/redis/auth"
	"github.com/Az3lff/bombordiro-crocodilo/pkg/jwtmanager"
)

type Service struct {
	cfg        Config
	repo       *auth.Repository
	cache      *cache.Repository
	jwtManager *jwtmanager.Manager
}

func New(cfg Config, repository *auth.Repository, cache *cache.Repository, jwtManager *jwtmanager.Manager) *Service {
	return &Service{
		cfg:        cfg,
		repo:       repository,
		cache:      cache,
		jwtManager: jwtManager,
	}
}

package auth

import (
	"context"
	"fmt"
	"github.com/Az3lff/bombordiro-crocodilo/internal/entities"
	"github.com/Az3lff/bombordiro-crocodilo/internal/models"
	"github.com/Az3lff/bombordiro-crocodilo/internal/repository/pg/auth"
	cache "github.com/Az3lff/bombordiro-crocodilo/internal/repository/redis/auth"
	"github.com/Az3lff/bombordiro-crocodilo/pkg/jwtmanager"
	"github.com/Az3lff/bombordiro-crocodilo/pkg/roles"
	txmanager "github.com/avito-tech/go-transaction-manager/trm/manager"
	"github.com/golang-jwt/jwt/v5"
	"strconv"
)

type Service struct {
	cfg        Config
	repo       *auth.Repository
	cache      *cache.Repository
	jwtManager *jwtmanager.Manager
	txmanager  *txmanager.Manager
}

func New(cfg Config, repository *auth.Repository, cache *cache.Repository, jwtManager *jwtmanager.Manager, txmanager *txmanager.Manager) *Service {
	return &Service{
		cfg:        cfg,
		repo:       repository,
		cache:      cache,
		jwtManager: jwtManager,
		txmanager:  txmanager,
	}
}

func (s *Service) SignUp(ctx context.Context, req models.SignUpRequest) (resp models.SignUpResponse, err error) {
	exist, err := s.repo.SelectExists(ctx, req.Login)
	if err != nil {
		return resp, err
	}

	if exist {
		return resp, fmt.Errorf("user already exists")
	}

	hashPassword, err := s.jwtManager.HashPassword(req.Password)
	if err != nil {
		return resp, err
	}

	var (
		user entities.User
		role string
	)

	err = s.txmanager.Do(ctx, func(ctx context.Context) (err error) {
		user = entities.User{
			Login:      req.Login,
			Password:   hashPassword,
			FirstName:  req.FirstName,
			SecondName: req.SecondName,
		}

		err = s.repo.InsertUser(ctx, &user)
		if err != nil {
			return err
		}

		role = roles.Client

		if req.InviteToken != "" {
			role, err = s.repo.UseInviteToken(ctx, user.ID, req.InviteToken)
			if err != nil {
				return err
			}
		}

		err = s.repo.InsertRoleUser(ctx, entities.UserRole{
			UserID: user.ID,
			Role:   role,
		})
		if err != nil {
			return err
		}

		return err
	})
	if err != nil {
		return resp, err
	}

	token, _, err := s.jwtManager.GenerateTokens(strconv.Itoa(user.ID), jwt.MapClaims{"role": role})
	if err != nil {
		return resp, err
	}

	return models.SignUpResponse{
		AuthToken: token,
		Role:      role,
	}, err
}

func (s *Service) SignIn(ctx context.Context, req models.SignInRequest) (resp models.SignInResponse, err error) {
	user, err := s.repo.SelectByLogin(ctx, req.Login)
	if err != nil {
		return resp, err
	}

	if s.jwtManager.ComparePassword(user.Password, req.Password) != nil {
		return resp, fmt.Errorf("invalid password")
	}

	role, err := s.repo.SelectRoleUser(ctx, user.ID)
	if err != nil {
		return resp, err
	}

	token, _, err := s.jwtManager.GenerateTokens(strconv.Itoa(user.ID), jwt.MapClaims{"role": role.Role})
	if err != nil {
		return resp, err
	}

	return models.SignInResponse{
		Role:      role.Role,
		AuthToken: token,
	}, err
}

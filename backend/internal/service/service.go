package service

import (
	"github.com/Az3lff/bombordiro-crocodilo/internal/repository/pg"
	"github.com/Az3lff/bombordiro-crocodilo/internal/repository/redis"
	"github.com/Az3lff/bombordiro-crocodilo/internal/service/auth"
	"github.com/Az3lff/bombordiro-crocodilo/pkg/jwtmanager"
	txmanager "github.com/avito-tech/go-transaction-manager/trm/manager"
)

type Service struct {
	Auth *auth.Service
}

func New(cfg Config, repository *pg.Repository, cache *redis.Repository, txmanager *txmanager.Manager, jwtmanager *jwtmanager.Manager) *Service {
	return &Service{
		Auth: auth.New(cfg.Auth, repository.Auth, cache.Auth, jwtmanager),
	}
}

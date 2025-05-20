package service

import (
	"github.com/Az3lff/bombordiro-crocodilo/internal/repository/pg"
	"github.com/Az3lff/bombordiro-crocodilo/internal/repository/redis"
	"github.com/Az3lff/bombordiro-crocodilo/internal/service/auth"
	"github.com/Az3lff/bombordiro-crocodilo/internal/service/maps"
	"github.com/Az3lff/bombordiro-crocodilo/pkg/jwtmanager"
	"github.com/Az3lff/bombordiro-crocodilo/pkg/s3"
	txmanager "github.com/avito-tech/go-transaction-manager/trm/manager"
)

type Service struct {
	Auth *auth.Service
	Maps *maps.Service
}

func New(cfg Config, repository *pg.Repository, cache *redis.Repository, txmanager *txmanager.Manager, jwtmanager *jwtmanager.Manager, s3 *s3.Client) *Service {
	return &Service{
		Auth: auth.New(cfg.Auth, repository.Auth, cache.Auth, jwtmanager, txmanager),
		Maps: maps.New(repository.Maps, txmanager, s3),
	}
}

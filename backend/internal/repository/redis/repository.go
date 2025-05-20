package redis

import (
	"github.com/Az3lff/bombordiro-crocodilo/internal/repository/redis/auth"
	"github.com/redis/go-redis/v9"
)

type Repository struct {
	Auth *auth.Repository
}

func New(redis *redis.Client) *Repository {
	return &Repository{
		Auth: auth.New(redis),
	}
}

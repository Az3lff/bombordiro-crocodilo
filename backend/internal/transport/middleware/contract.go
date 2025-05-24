package middleware

import (
	"context"

	"github.com/Az3lff/bombordiro-crocodilo/internal/models"
)

type (
	service interface {
		Auth(ctx context.Context, req models.AuthRequest) (resp models.AuthResponse, err error)
	}
)

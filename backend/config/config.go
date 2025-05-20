package config

import (
	"github.com/Az3lff/bombordiro-crocodilo/internal/service"

	"github.com/Az3lff/bombordiro-crocodilo/pkg/build"
	"github.com/Az3lff/bombordiro-crocodilo/pkg/build/components/http"
	"github.com/Az3lff/bombordiro-crocodilo/pkg/build/components/pgxsqlxcomponent"
	"github.com/Az3lff/bombordiro-crocodilo/pkg/build/components/rediscomponent"
	"github.com/Az3lff/bombordiro-crocodilo/pkg/jwtmanager"
	"github.com/Az3lff/bombordiro-crocodilo/pkg/s3"
)

type Config struct {
	Service    service.Config          `validate:"required"`
	Defaults   build.DefaultsConfig    `validate:"required"`
	Postgres   pgxsqlxcomponent.Config `validate:"required"`
	Redis      rediscomponent.Config   `validate:"required"`
	HTTP       http.Config             `validate:"required"`
	S3         s3.Config               `validate:"required"`
	JwtSecrets jwtmanager.Config       `validate:"required"`
}

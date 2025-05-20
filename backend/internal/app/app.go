package app

import (
	"context"
	"time"

	"github.com/Az3lff/bombordiro-crocodilo/internal/service"
	"github.com/Az3lff/bombordiro-crocodilo/pkg/jwtmanager"

	trmsqlx "github.com/avito-tech/go-transaction-manager/sqlx"
	txmanager "github.com/avito-tech/go-transaction-manager/trm/manager"

	"github.com/Az3lff/bombordiro-crocodilo/config"
	"github.com/Az3lff/bombordiro-crocodilo/internal/repository/pg"
	"github.com/Az3lff/bombordiro-crocodilo/internal/repository/redis"
	"github.com/Az3lff/bombordiro-crocodilo/internal/transport"
	"github.com/Az3lff/bombordiro-crocodilo/internal/transport/http/auth"

	"github.com/Az3lff/bombordiro-crocodilo/pkg/build"
	httpsrv "github.com/Az3lff/bombordiro-crocodilo/pkg/build/components/http"
	"github.com/Az3lff/bombordiro-crocodilo/pkg/build/components/pgxsqlxcomponent"
	"github.com/Az3lff/bombordiro-crocodilo/pkg/build/components/rediscomponent"
	"github.com/Az3lff/bombordiro-crocodilo/pkg/server/http"
)

func Run(ctx context.Context, cfg *config.Config) (err error) {
	cmps := build.NewBuilder().
		WithDefaults(cfg.Defaults).
		Build()

	postgres := pgxsqlxcomponent.New(cfg.Postgres)
	repository := pg.New(postgres.DB, trmsqlx.DefaultCtxGetter)

	txManager, err := txmanager.New(trmsqlx.NewDefaultFactory(postgres.DB))
	if err != nil {
		return err
	}

	rd := rediscomponent.New(cfg.Redis)
	redis := redis.New(rd.Client)

	storage := jwtmanager.NewMemoryStorage()
	jwtManager := jwtmanager.New(
		cfg.JwtSecrets.AuthSecretKey,
		cfg.JwtSecrets.RefreshSecretKey,
		time.Hour,
		time.Hour*72,
		storage,
	)

	services := service.New(
		cfg.Service,
		repository,
		redis,
		txManager,
		jwtManager,
	)

	server := http.New(cfg.HTTP.Serve)

	authHandler := auth.NewHandler(services.Auth)

	binder := transport.NewBinder([]http.Binder{
		auth.NewBinder(server, authHandler),
	}...)

	httpServer := http.NewWithBinder(
		cfg.HTTP.Config,
		server,
		binder,
		nil,
	)

	cmps = append(
		cmps,
		postgres,
		rd,
		httpsrv.New(cfg.HTTP, httpServer),
	)

	app, err := build.NewApp(cmps)
	if err != nil {
		return err
	}

	return build.Run(ctx, app)
}

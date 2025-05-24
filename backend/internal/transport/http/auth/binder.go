package auth

import (
	"context"
	"github.com/Az3lff/bombordiro-crocodilo/internal/transport/middleware"

	"github.com/Az3lff/bombordiro-crocodilo/pkg/server/http"
)

type Binder struct {
	server  *http.Server
	handler *Handler
	mw      *middleware.Middleware
}

func NewBinder(server *http.Server, handler *Handler, mw *middleware.Middleware) *Binder {
	return &Binder{
		server:  server,
		handler: handler,
		mw:      mw,
	}
}

func (b *Binder) BindRoutes(_ context.Context) {

	{
		api := b.server.Group("/api")
		v1 := api.Group("/v1")

		auth := v1.Group("/auth")

		auth.Post("/sign-up", b.handler.SignUp)
		auth.Post("/sign-in", b.handler.SignIn)
	}

	{
		admin := b.server.Group("/admin")
		v1 := admin.Group("/v1")

		auth := v1.Group("/auth")

		auth.Post("/token", b.mw.Auth, b.handler.GenerateToken)
	}
}

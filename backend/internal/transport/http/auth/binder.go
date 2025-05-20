package auth

import (
	"context"

	"github.com/Az3lff/bombordiro-crocodilo/pkg/server/http"
)

type Binder struct {
	server  *http.Server
	handler *Handler
}

func NewBinder(server *http.Server, handler *Handler) *Binder {
	return &Binder{
		server:  server,
		handler: handler,
	}
}

func (b *Binder) BindRoutes(_ context.Context) {

	{
		client := b.server.Group("/client")
		v1 := client.Group("/v1")

		auth := v1.Group("/auth")

		auth.Post("/sign-up", b.handler.ClientSignUp)
		auth.Post("/sign-in", b.handler.ClientSignIn)
	}

	{
		admin := b.server.Group("/admin")
		v1 := admin.Group("/v1")

		auth := v1.Group("/auth")

		auth.Post("/sign-up", b.handler.AdminSignUp)
		auth.Post("/sign-in", b.handler.AdminSignIn)
	}
}

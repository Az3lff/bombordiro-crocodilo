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
	v1 := b.server.Group("/v1")

	{
		client := v1.Group("/client")
		auth := client.Group("/auth")

		auth.Post(
			"/sigin-in",
			b.handler.ClientSignIn,
		)
		auth.Post(
			"/sigin-in-confirm",
			b.handler.ClientSignInConfirm,
		)
	}
}

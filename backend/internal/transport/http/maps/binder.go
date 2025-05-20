package maps

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

		maps := v1.Group("/maps")

		maps.Get("/:id", b.handler.GetMap)
		maps.Get("", b.handler.GetMaps)
		// auth.Post("/sign-in")
	}

	{
		admin := b.server.Group("/admin")
		v1 := admin.Group("/v1")

		maps := v1.Group("/maps")

		maps.Post("/upload", b.handler.PostMap)
		//auth.Post("/sign-in")
	}
}

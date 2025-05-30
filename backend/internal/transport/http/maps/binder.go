package maps

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
		client := b.server.Group("/client")
		v1 := client.Group("/v1")

		maps := v1.Group("/maps")

		maps.Get("/:id", b.handler.GetMap)
		maps.Get("/", b.handler.GetMaps)
		// auth.Post("/sign-in")
	}

	{
		admin := b.server.Group("/admin")
		v1 := admin.Group("/v1")

		maps := v1.Group("/maps")

		maps.Post("/", b.handler.PostMap)
		maps.Delete("/:id", b.handler.DeleteMap)
		//auth.Post("/sign-in")
	}
}

package transport

import (
	"context"

	"github.com/Az3lff/bombordiro-crocodilo/pkg/server/http"
)

type Binder struct {
	binders []http.Binder
}

func NewBinder(
	binders ...http.Binder,
) *Binder {
	return &Binder{
		binders: binders,
	}
}

func (b *Binder) BindRoutes(ctx context.Context) {
	for _, binder := range b.binders {
		binder.BindRoutes(ctx)
	}
}

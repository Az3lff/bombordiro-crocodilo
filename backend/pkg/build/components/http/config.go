package http

import (
	"github.com/Az3lff/bombordiro-crocodilo/pkg/build/components"
	srv "github.com/Az3lff/bombordiro-crocodilo/pkg/server/http"
)

type Config struct {
	srv.Config
	components.ComponentConfig
}

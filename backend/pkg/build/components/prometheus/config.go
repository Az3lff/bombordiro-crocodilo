package prometheus

import (
	"github.com/Az3lff/bombordiro-crocodilo/pkg/build/components"
)

type Config struct {
	Host string `validate:"required" default:"0.0.0.0:9000"`
	components.ComponentConfig
}

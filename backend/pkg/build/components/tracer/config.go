package tracer

import (
	"github.com/Az3lff/bombordiro-crocodilo/pkg/build/components"
	"github.com/Az3lff/bombordiro-crocodilo/pkg/tracer"
)

type Config struct {
	components.ComponentConfig `validate:"required"`
	tracer.Config              `validate:"required"`
}

package components

import (
	"github.com/Az3lff/bombordiro-crocodilo/pkg/utils/duration"
)

type (
	ComponentConfig struct {
		StartTimeout     duration.Seconds `validate:"required" default:"5"`
		StopTimeout      duration.Seconds `validate:"required" default:"5"`
		ShutdownDelay    duration.Seconds
		DisableComponent bool
	}
)

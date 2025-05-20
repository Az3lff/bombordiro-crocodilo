package rediscomponent

import (
	"github.com/Az3lff/bombordiro-crocodilo/pkg/build/components"
	"github.com/Az3lff/bombordiro-crocodilo/pkg/redisconnector"
)

type Config struct {
	components.ComponentConfig `validate:"required"`
	redisconnector.Config      `validate:"required"`
}

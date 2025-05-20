package healthcheck

import "github.com/Az3lff/bombordiro-crocodilo/pkg/build/components"

type Config struct {
	Address string `validate:"required" default:":8000"`
	components.ComponentConfig
}

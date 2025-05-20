package scheduler

import "github.com/Az3lff/bombordiro-crocodilo/pkg/utils/location"

type Config struct {
	Location *location.Location `validate:"required" default:"UTC"`
}

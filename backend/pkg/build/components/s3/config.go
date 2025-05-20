package s3

import "github.com/Az3lff/bombordiro-crocodilo/pkg/build/components"

type Config struct {
	Bucket string `validate:"required"`
	Key    string `validate:"required"`
	Secret string `validate:"required"`
	Region string `validate:"required"`

	components.ComponentConfig
}

package main

import (
	"context"

	"github.com/Az3lff/bombordiro-crocodilo/config"
	"github.com/Az3lff/bombordiro-crocodilo/internal/app"

	cfgloader "github.com/Az3lff/bombordiro-crocodilo/pkg/config"
	"github.com/Az3lff/bombordiro-crocodilo/pkg/logger/log"
)

func main() {
	ctx := context.Background()
	cfg := &config.Config{}

	if err := cfgloader.LoadConfig(ctx, cfg); err != nil {
		log.Fatal(err.Error())
	}

	if err := app.Run(ctx, cfg); err != nil {
		log.Fatal(err.Error())
	}
}

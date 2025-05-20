package pgxsqlxcomponent

import (
	"github.com/Az3lff/bombordiro-crocodilo/pkg/build/components"
	"github.com/Az3lff/bombordiro-crocodilo/pkg/pgxsqlxconnector"
	"github.com/Az3lff/bombordiro-crocodilo/pkg/utils/migrate"
)

type Config struct {
	components.ComponentConfig `validate:"required"`
	pgxsqlxconnector.Config    `validate:"required"`
	MigrateConfig              *migrate.PgMigrateConfig
}

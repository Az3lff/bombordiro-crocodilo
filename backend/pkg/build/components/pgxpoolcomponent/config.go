package pgxpoolcomponent

import (
	"github.com/Az3lff/bombordiro-crocodilo/pkg/build/components"
	pgxpoolconnctor "github.com/Az3lff/bombordiro-crocodilo/pkg/pgxpoolconnector"
	"github.com/Az3lff/bombordiro-crocodilo/pkg/utils/migrate"
)

type Config struct {
	components.ComponentConfig `validate:"required"`
	pgxpoolconnctor.Config     `validate:"required"`
	MigrateConfig              *migrate.PgMigrateConfig
}

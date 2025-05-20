package pg

import (
	"github.com/Az3lff/bombordiro-crocodilo/internal/repository/pg/maps"
	trmsqlx "github.com/avito-tech/go-transaction-manager/sqlx"
	"github.com/jmoiron/sqlx"

	"github.com/Az3lff/bombordiro-crocodilo/internal/repository/pg/auth"
)

type Repository struct {
	Auth *auth.Repository
	Maps *maps.Repository
}

func New(db *sqlx.DB, ctxGetter *trmsqlx.CtxGetter) *Repository {
	return &Repository{
		Auth: auth.New(db, ctxGetter),
		Maps: maps.New(db, ctxGetter),
	}
}

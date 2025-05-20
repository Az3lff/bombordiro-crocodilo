package maps

import (
	"context"
	"github.com/google/uuid"

	"github.com/Az3lff/bombordiro-crocodilo/internal/entities"

	trmsqlx "github.com/avito-tech/go-transaction-manager/sqlx"
	"github.com/jmoiron/sqlx"
)

type Repository struct {
	db        *sqlx.DB
	ctxGetter *trmsqlx.CtxGetter
}

func New(db *sqlx.DB, ctxGetter *trmsqlx.CtxGetter) *Repository {
	return &Repository{
		db:        db,
		ctxGetter: ctxGetter,
	}
}

func (r *Repository) InsertMap(ctx context.Context, appMap *entities.Map) (err error) {
	query := `
	insert into content.map(
			id,
			title,
			description,
			file_url
	) values (
	        $1, $2, $3, $4
	) RETURNING *
  `

	err = r.ctxGetter.DefaultTrOrDB(ctx, r.db).GetContext(
		ctx,
		appMap,
		query,
		appMap.ID,
		appMap.Title,
		appMap.Desc,
		appMap.FileUrl,
	)
	if err != nil {
		return err
	}

	return err
}

func (r *Repository) SelectMaps(ctx context.Context) (maps []entities.Map, err error) {
	query := `
		select *
		from content.map
	`

	err = r.ctxGetter.DefaultTrOrDB(ctx, r.db).SelectContext(ctx, &maps, query)
	if err != nil {
		return nil, err
	}

	return maps, err
}

func (r *Repository) SelectMap(ctx context.Context, id uuid.UUID) (appMap entities.Map, err error) {
	query := `
		select *
		from content.map
		where id = $1
	`

	err = r.ctxGetter.DefaultTrOrDB(ctx, r.db).GetContext(
		ctx,
		&appMap,
		query,
		id,
	)
	if err != nil {
		return appMap, err
	}

	return appMap, err
}

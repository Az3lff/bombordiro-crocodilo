package auth

import (
	"context"
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

func (r *Repository) SelectExists(ctx context.Context, login string) (exists bool, err error) {
	query := `
		select exists(
			select 1
			from student.student
			where 
				login = $1 
		) as result
	`

	err = r.ctxGetter.DefaultTrOrDB(ctx, r.db).GetContext(
		ctx,
		&exists,
		query,
		login,
	)
	if err != nil {
		return exists, err
	}

	return exists, nil
}

func (r *Repository) InsertStudent(ctx context.Context, student *entities.Student) (err error) {
	query := `
	insert into student.student(
			login,
			password,
			first_name,
			second_name
	) values (
	        $1, $2, $3, $4
	) RETURNING *
  `

	err = r.ctxGetter.DefaultTrOrDB(ctx, r.db).GetContext(
		ctx,
		student,
		query,
		student.Login,
		student.Password,
		student.FirstName,
		student.SecondName,
	)
	if err != nil {
		return err
	}

	return err
}

func (r *Repository) SelectStudentByLogin(ctx context.Context, login string) (user entities.Student, err error) {
	query := `
	select 
	    *
	from student.student
	where login = $1 
  `

	err = r.ctxGetter.DefaultTrOrDB(ctx, r.db).GetContext(
		ctx,
		&user,
		query,
		login,
	)
	if err != nil {
		return user, err
	}

	return user, err
}

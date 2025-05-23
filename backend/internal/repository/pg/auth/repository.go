package auth

import (
	"context"
	"database/sql"
	"fmt"
	"github.com/Az3lff/bombordiro-crocodilo/internal/entities"
	"time"

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
			from "user"."user"
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

func (r *Repository) InsertUser(ctx context.Context, user *entities.User) (err error) {
	query := `
	insert into "user"."user"(
		login,
		password,
		first_name,
		second_name
	) values(
	         $1,
	         $2,
	         $3,
	         $4
	) returning *
	`

	err = r.ctxGetter.DefaultTrOrDB(ctx, r.db).GetContext(
		ctx,
		user,
		query,
		user.Login,
		user.Password,
		user.FirstName,
		user.SecondName,
	)
	if err != nil {
		return err
	}

	return err
}

func (r *Repository) SelectByLogin(ctx context.Context, login string) (user entities.User, err error) {
	query := `
	select 
	    *
	from "user"."user"
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

func (r *Repository) InsertInviteToken(ctx context.Context, token *entities.InviteToken) (err error) {
	query := `
	insert into "user".invite(
		   token,
		   created_by,
		   created_at,
		   role
	) values (
	        $1, $2, $3, $4
	)
	`

	_, err = r.ctxGetter.DefaultTrOrDB(ctx, r.db).ExecContext(
		ctx,
		query,
		token.Token,
		token.CreatedBy,
		time.Now(),
		token.Role,
	)
	if err != nil {
		return err
	}

	return err
}
func (r *Repository) UseInviteToken(ctx context.Context, adminID int, token string) (role string, err error) {
	query := `
		update "user".invite set 
			used_by = $1,
			used_at = $2
		where token = $3 and used_by is null and used_at is null
		returning role
	`

	err = r.ctxGetter.DefaultTrOrDB(ctx, r.db).QueryRowContext(
		ctx,
		query,
		adminID,
		time.Now(),
		token,
	).Scan(&role)
	if err != nil {
		if err == sql.ErrNoRows {
			return "", fmt.Errorf("invalid token")
		}
		return "", err
	}

	return role, nil
}

func (r *Repository) InsertRoleUser(ctx context.Context, userRole entities.UserRole) (err error) {
	query := `
	insert into "user".users_role(
		user_id,
		role
	)values (
		$1, 
		$2
	)
`

	_, err = r.ctxGetter.DefaultTrOrDB(ctx, r.db).ExecContext(
		ctx,
		query,
		userRole.UserID,
		userRole.Role,
	)

	if err != nil {
		return err
	}

	return err
}

func (r *Repository) SelectRoleUser(ctx context.Context, userID int) (user entities.UserRole, err error) {
	query := `
		select 
			*
	from "user".users_role
	where user_id = $1
	`

	err = r.ctxGetter.DefaultTrOrDB(ctx, r.db).GetContext(
		ctx,
		&user,
		query,
		userID,
	)
	if err != nil {
		return user, err
	}

	return user, err
}

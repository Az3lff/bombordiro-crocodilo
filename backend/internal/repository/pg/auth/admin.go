package auth

import (
	"context"
	"fmt"
	"time"

	"github.com/Az3lff/bombordiro-crocodilo/internal/entities"
)

func (r *Repository) SelectAdminExists(ctx context.Context, login string) (exists bool, err error) {
	query := `
		select exists(
			select 1
			from admin.admin
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

func (r *Repository) InsertAdmin(ctx context.Context, admin *entities.Admin) (err error) {
	query := `
	insert into admin.admin(
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
		admin,
		query,
		admin.Login,
		admin.Password,
		admin.FirstName,
		admin.SecondName,
	)
	if err != nil {
		return err
	}

	return err
}

func (r *Repository) SelectAdminByLogin(ctx context.Context, login string) (admin entities.Admin, err error) {
	query := `
	select 
	    *
	from admin.admin
	where login = $1 
  `

	err = r.ctxGetter.DefaultTrOrDB(ctx, r.db).GetContext(
		ctx,
		&admin,
		query,
		login,
	)
	if err != nil {
		return admin, err
	}

	return admin, err
}

func (r *Repository) InsertInviteToken(ctx context.Context, token *entities.InviteToken) (err error) {
	query := `
	insert into admin.invite_token(
		   token,
		   crated_by,
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

func (r *Repository) UseInviteToken(ctx context.Context, adminID int, token string) error {
	query := `
		update admin.invite set 
			used_by = $1,
			used_at = $2
		where token = $3
	`

	result, err := r.ctxGetter.DefaultTrOrDB(ctx, r.db).ExecContext(
		ctx,
		query,
		adminID,
		time.Now(),
		token,
	)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return fmt.Errorf("token not found")
	}

	return nil
}

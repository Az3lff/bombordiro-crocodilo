package entities

import "time"

type (
	// admins
	Admin struct {
		ID         int     `db:"id"`
		Login      string  `db:"login"`
		Password   string  `db:"password"`
		FirstName  string  `db:"first_name"`
		SecondName string  `db:"second_name"`
		ImageUrl   *string `db:"image_url"`
	}
	InviteToken struct {
		Token     string     `db:"token"`
		CreatedBy int        `db:"created_by"`
		UsedBy    *int       `db:"used_by"`
		CreatedAt string     `db:"created_at"`
		UsedAt    *time.Time `db:"used_at"`
		Role      string     `db:"role"`
	}
	// student
	Student struct {
		ID         int     `db:"id"`
		Login      string  `db:"login"`
		Password   string  `db:"password"`
		FirstName  string  `db:"first_name"`
		SecondName string  `db:"second_name"`
		ImageUrl   *string `db:"image_url"`
	}
)

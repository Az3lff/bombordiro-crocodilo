package entities

import "time"

type (
	InviteToken struct {
		Token     string     `db:"token"`
		CreatedBy int        `db:"created_by"`
		UsedBy    *int       `db:"used_by"`
		CreatedAt time.Time  `db:"created_at"`
		UsedAt    *time.Time `db:"used_at"`
		Role      string     `db:"role"`
	}
)

type (
	User struct {
		ID         int    `db:"id"`
		Login      string `db:"login"`
		Password   string `db:"password"`
		FirstName  string `db:"first_name"`
		SecondName string `db:"second_name"`
	}
	UserRole struct {
		UserID int    `db:"user_id"`
		Role   string `db:"role"`
	}
	ClientInfo struct {
	}
)

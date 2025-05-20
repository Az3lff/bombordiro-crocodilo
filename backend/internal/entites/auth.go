package entites

type (
	// teachers
	Teacher struct {
		ID         int    `db:"id"`
		Login      string `db:"login"`
		Password   string `db:"password"`
		FirstName  string `db:"first_name"`
		SecondName string `db:"second_name"`
	}
	InviteToken struct {
	}
	// student
)

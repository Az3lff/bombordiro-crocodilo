package entities

import "github.com/google/uuid"

type (
	Map struct {
		ID       uuid.UUID `db:"id"`
		Title    string    `db:"title"`
		DescFile string    `db:"description_file"`
		MapFile  string    `db:"map_file"`
	}
)

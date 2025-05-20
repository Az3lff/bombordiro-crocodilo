package entities

import "github.com/google/uuid"

type (
	Map struct {
		ID      uuid.UUID `db:"id"`
		Title   string    `db:"title"`
		Desc    string    `db:"description"`
		FileUrl string    `db:"file_url"`
	}
)

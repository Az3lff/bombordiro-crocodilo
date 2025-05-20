package models

import "github.com/google/uuid"

type (
	File struct {
		Filename string
		Bytes    []byte
	}
	Map struct {
		ID      uuid.UUID `json:"id"`
		Title   string    `json:"title"`
		Desc    string    `json:"desc"`
		FileUrl string    `json:"file_url"`
	}
	PostMapRequest struct {
		ID    uuid.UUID
		Title string
		Desc  string
		File  File
	}

	GetMapResponse struct {
		Map
	}
	GetMapsResponse struct {
		Maps []Map `json:"maps"`
	}
)

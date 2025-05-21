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
		DescUrl string    `json:"desc_url"`
		MapUrl  string    `json:"map_url"`
	}
	PostMapRequest struct {
		ID    uuid.UUID
		Title string
		Desc  *File
		File  *File
	}

	GetMapResponse struct {
		Map
	}
	GetMapsResponse struct {
		Maps []Map `json:"maps"`
	}
)

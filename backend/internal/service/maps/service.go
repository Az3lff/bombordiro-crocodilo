package maps

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"path/filepath"

	txmanager "github.com/avito-tech/go-transaction-manager/trm/manager"
	"github.com/google/uuid"

	"github.com/Az3lff/bombordiro-crocodilo/internal/entities"
	"github.com/Az3lff/bombordiro-crocodilo/internal/models"
	"github.com/Az3lff/bombordiro-crocodilo/internal/repository/pg/maps"

	"github.com/Az3lff/bombordiro-crocodilo/pkg/s3"
)

type Service struct {
	repo      *maps.Repository
	txmanager *txmanager.Manager
	s3        *s3.Client
}

func New(repository *maps.Repository, txmanager *txmanager.Manager, s3 *s3.Client) *Service {
	return &Service{
		repo:      repository,
		txmanager: txmanager,
		s3:        s3,
	}
}

func (s *Service) CreateMap(ctx context.Context, req models.PostMapRequest) (err error) {
	mapUrl, err := s.uploadFile(ctx, bytes.NewReader(req.File.Bytes), req.File.Filename)
	if err != nil {
		return err
	}
	descUrl, err := s.uploadFile(ctx, bytes.NewReader(req.Desc.Bytes), req.Desc.Filename)
	if err != nil {
		return err
	}

	appMap := &entities.Map{
		ID:       uuid.New(),
		Title:    req.Title,
		DescFile: descUrl,
		MapFile:  mapUrl,
	}

	err = s.repo.InsertMap(ctx, appMap)
	if err != nil {
		return err
	}

	return err
}

func (s *Service) GetMaps(ctx context.Context) (resp models.GetMapsResponse, err error) {
	maps, err := s.repo.SelectMaps(ctx)
	if err != nil {
		return resp, err
	}

	resp.Maps = make([]models.Map, len(maps))
	for i, m := range maps {
		resp.Maps[i] = models.Map{
			ID:      m.ID,
			Title:   m.Title,
			DescUrl: m.DescFile,
			MapUrl:  m.MapFile,
		}
	}

	return resp, err
}

func (s *Service) GetMap(ctx context.Context, id uuid.UUID) (resp models.GetMapResponse, err error) {
	appMap, err := s.repo.SelectMap(ctx, id)
	if err != nil {
		return resp, err
	}

	resp.Map = models.Map{
		ID:      appMap.ID,
		Title:   appMap.Title,
		DescUrl: appMap.DescFile,
		MapUrl:  appMap.MapFile,
	}

	return resp, err
}

func (s *Service) DeleteMap(ctx context.Context, id uuid.UUID) (err error) {
	err = s.repo.DeleteMap(ctx, id)
	if err != nil {
		return err
	}
	
	return err
}

func (s *Service) uploadFile(ctx context.Context, r io.Reader, filename string) (url string, err error) {
	buf := make([]byte, 5*1024*1024)

	var (
		partNum  int32 = 1
		uploadID *string
	)

	id := uuid.New()

	ext := filepath.Ext(filename)
	if ext == "" {
		ext = ".dat"
	}

	url = fmt.Sprintf("https://storage.yandexcloud.net/profkom-dev/%s%s", id.String(), ext)

	for {
		n, readErr := io.ReadFull(r, buf)
		last := readErr == io.EOF || readErr == io.ErrUnexpectedEOF

		if n > 0 {
			id, _, err := s.s3.UploadChunk(
				ctx,
				id.String()+ext,
				partNum,
				buf[:n],
				uploadID,
				last,
			)
			if err != nil {
				return "", err
			}
			if uploadID == nil {
				uploadID = &id
			}
			partNum++
		}

		if last {
			break
		}
		if readErr != nil {
			return "", readErr
		}
	}

	return url, err
}

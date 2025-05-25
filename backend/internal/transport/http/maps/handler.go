package maps

import (
	"io"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"

	"github.com/Az3lff/bombordiro-crocodilo/internal/models"
	"github.com/Az3lff/bombordiro-crocodilo/internal/service/maps"
)

type Handler struct {
	service *maps.Service
}

func NewHandler(service *maps.Service) *Handler {
	return &Handler{
		service: service,
	}
}

func (h *Handler) PostMap(c *fiber.Ctx) (err error) {
	var request models.PostMapRequest
	request.ID = uuid.New()
	request.Title = c.FormValue("title")

	request.Desc, err = h.file(c, "desc")
	if err != nil {
		return err
	}

	request.File, err = h.file(c, "file")
	if err != nil {
		return err
	}

	err = h.service.CreateMap(c.Context(), request)
	if err != nil {
		return err
	}

	return c.SendStatus(fiber.StatusCreated)
}

func (h *Handler) DeleteMap(c *fiber.Ctx) (err error) {
	id := c.Params("id")
	uid, err := uuid.Parse(id)
	if err != nil {
		return err
	}

	err = h.service.DeleteMap(c.Context(), uid)
	if err != nil {
		return err
	}

	return c.SendStatus(200)
}

func (h *Handler) GetMap(c *fiber.Ctx) (err error) {
	id := c.Params("id")
	uid, err := uuid.Parse(id)
	if err != nil {
		return err
	}

	resp, err := h.service.GetMap(c.Context(), uid)
	if err != nil {
		return err
	}

	return c.JSON(resp)
}

func (h *Handler) GetMaps(c *fiber.Ctx) (err error) {
	resp, err := h.service.GetMaps(c.Context())
	if err != nil {
		return err
	}

	return c.JSON(resp)
}

func (h *Handler) file(c *fiber.Ctx, key string) (file *models.File, err error) {
	formFile, err := c.FormFile(key)
	if err != nil {
		return file, err
	}

	f, err := formFile.Open()
	if err != nil {
		return file, err
	}
	defer f.Close()

	fileBytes, err := io.ReadAll(f)
	if err != nil {
		return file, err
	}

	return &models.File{
		Filename: formFile.Filename,
		Bytes:    fileBytes,
	}, err
}

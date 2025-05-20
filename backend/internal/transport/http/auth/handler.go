package auth

import (
	"github.com/Az3lff/bombordiro-crocodilo/internal/service/auth"
	"github.com/gofiber/fiber/v2"
)

type Handler struct {
	service *auth.Service
}

func NewHandler(service *auth.Service) *Handler {
	return &Handler{
		service: service,
	}
}

func (h *Handler) ClientSignIn(c *fiber.Ctx) (err error) {
	return err
}

func (h *Handler) ClientSignInConfirm(c *fiber.Ctx) (err error) {
	return err
}

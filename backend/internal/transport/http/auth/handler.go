package auth

import (
	"github.com/Az3lff/bombordiro-crocodilo/internal/models"
	"github.com/gofiber/fiber/v2"

	"github.com/Az3lff/bombordiro-crocodilo/internal/service/auth"
)

type Handler struct {
	service *auth.Service
}

func NewHandler(service *auth.Service) *Handler {
	return &Handler{
		service: service,
	}
}

// admin
func (h *Handler) AdminSignUp(c *fiber.Ctx) (err error) {
	var request models.AdminSignUpRequest

	if err := c.BodyParser(&request); err != nil {
		return err
	}

	resp, err := h.service.AdminSignUp(c.Context(), request)
	if err != nil {
		return err
	}

	return c.JSON(resp)
}

func (h *Handler) AdminSignIn(c *fiber.Ctx) (err error) {
	var request models.AdminSignInRequest

	if err := c.BodyParser(&request); err != nil {
		return err
	}

	resp, err := h.service.AdminSignIn(c.Context(), request)
	if err != nil {
		return err
	}

	return c.JSON(resp)
}

// client
func (h *Handler) ClientSignUp(c *fiber.Ctx) (err error) {
	var request models.ClientSignUpRequest

	if err := c.BodyParser(&request); err != nil {
		return err
	}

	resp, err := h.service.ClientSignUp(c.Context(), request)
	if err != nil {
		return err
	}

	return c.JSON(resp)
}

func (h *Handler) ClientSignIn(c *fiber.Ctx) (err error) {
	var request models.ClientSignInRequest

	if err := c.BodyParser(&request); err != nil {
		return err
	}

	resp, err := h.service.ClientSignIn(c.Context(), request)
	if err != nil {
		return err
	}

	return c.JSON(resp)
}

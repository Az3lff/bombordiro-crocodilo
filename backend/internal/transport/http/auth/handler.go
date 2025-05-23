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

func (h *Handler) SignUp(c *fiber.Ctx) (err error) {
	var request models.SignUpRequest

	if err := c.BodyParser(&request); err != nil {
		return err
	}

	resp, err := h.service.SignUp(c.Context(), request)
	if err != nil {
		return err
	}

	return c.JSON(resp)
}

func (h *Handler) SignIn(c *fiber.Ctx) (err error) {
	var request models.SignInRequest

	if err := c.BodyParser(&request); err != nil {
		return err
	}

	resp, err := h.service.SignIn(c.Context(), request)
	if err != nil {
		return err
	}

	return c.JSON(resp)
}

//func (h *Handler) GenerateToken(c *fiber.Ctx) (err error) {
//	var request models.PostInviteTokenRequest
//
//	_ = c.Locals("user")
//	//if !ok{
//	//	return c.SendStatus(fiber.StatusUnauthorized)
//	//}
//
//	request.Role = c.Query("role")
//	request.AdminID = 5
//
//	resp, err := h.service.GenerateToken(c.Context(), request)
//	if err != nil {
//		return err
//	}
//
//	return c.JSON(resp)
//}

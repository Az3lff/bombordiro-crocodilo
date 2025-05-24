package middleware

import (
	"github.com/Az3lff/bombordiro-crocodilo/internal/models"
	"github.com/Az3lff/bombordiro-crocodilo/pkg/roles"
	"github.com/gofiber/fiber/v2"
)

const (
	Authorization = "Authorization"
	PermissionKey = "permission"
	UserKey       = "user"
)

type Middleware struct {
	cfg     Config
	service service
}

func New(cfg Config, service service) *Middleware {
	return &Middleware{
		cfg:     cfg,
		service: service,
	}
}

func (m *Middleware) SetClientAccess(c *fiber.Ctx) (err error) {
	authToken := c.Get(Authorization)
	if authToken == "" {
		return c.SendStatus(fiber.StatusUnauthorized)
	}

	permission, ok := c.Locals(PermissionKey).(int64)
	if !ok {
		permission = 0
	}

	c.Locals(PermissionKey, roles.GetAccess(permission, roles.Client))

	return c.Next()
}

func (m *Middleware) SetTeacherAccess(c *fiber.Ctx) (err error) {
	authToken := c.Get(Authorization)
	if authToken == "" {
		return c.SendStatus(fiber.StatusUnauthorized)
	}

	permission, ok := c.Locals(PermissionKey).(int64)
	if !ok {
		permission = 0
	}

	c.Locals(PermissionKey, roles.GetAccess(permission, roles.Teacher))

	return c.Next()
}

func (m *Middleware) Auth(c *fiber.Ctx) (err error) {
	authToken := c.Get(Authorization)
	if authToken == "" {
		return c.SendStatus(fiber.StatusUnauthorized)
	}

	resp, err := m.service.Auth(c.Context(), models.AuthRequest{
		AuthToken: authToken,
	})
	if err != nil {
		return err
	}

	permission, ok := c.Locals(PermissionKey).(int64)
	if !ok {
		permission = 0
	}

	if !roles.CheckAccess(roles.RoleMap[resp.Role], permission) {
		return c.SendStatus(fiber.StatusForbidden)
	}

	c.Locals(UserKey, models.User{
		ID:         resp.ID,
		Login:      resp.Login,
		FirstName:  resp.FirstName,
		SecondName: resp.SecondName,
		Role:       resp.Role,
	})

	return c.Next()
}

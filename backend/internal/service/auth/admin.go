package auth

import (
	"context"
	"fmt"
	"github.com/Az3lff/bombordiro-crocodilo/internal/entities"
	"github.com/golang-jwt/jwt/v5"
	"strconv"

	"github.com/Az3lff/bombordiro-crocodilo/internal/models"
)

func (s *Service) AdminSignUp(ctx context.Context, req models.AdminSignUpRequest) (resp models.AdminSignUpResponse, err error) {
	exist, err := s.repo.SelectAdminExists(ctx, req.Login)
	if err != nil {
		return resp, err
	}

	if exist {
		return resp, fmt.Errorf("user already exists")
	}

	hashPassword, err := s.jwtManager.HashPassword(req.Password)
	if err != nil {
		return resp, err
	}

	admin := &entities.Admin{
		Login:      req.Login,
		Password:   hashPassword,
		FirstName:  req.FirstName,
		SecondName: req.SecondName,
	}

	err = s.txmanager.Do(ctx, func(ctx context.Context) (err error) {
		err = s.repo.InsertAdmin(ctx, admin)
		if err != nil {
			return err
		}

		err = s.repo.UseInviteToken(ctx, admin.ID, req.InviteToken)
		if err != nil {
			return err
		}

		return err
	})
	if err != nil {
		return resp, err
	}

	token, _, err := s.jwtManager.GenerateTokens(strconv.Itoa(admin.ID), jwt.MapClaims{})
	if err != nil {
		return resp, err
	}

	return models.AdminSignUpResponse{
		AuthToken: token,
	}, err
}

func (s *Service) AdminSignIn(ctx context.Context, req models.AdminSignInRequest) (resp models.AdminSignInResponse, err error) {
	user, err := s.repo.SelectAdminByLogin(ctx, req.Login)
	if err != nil {
		return resp, err
	}

	if s.jwtManager.ComparePassword(user.Password, req.Password) != nil {
		return resp, fmt.Errorf("invalid password")
	}

	token, _, err := s.jwtManager.GenerateTokens(strconv.Itoa(user.ID), jwt.MapClaims{})
	if err != nil {
		return resp, err
	}

	return models.AdminSignInResponse{
		AuthToken: token,
	}, err
}

func (s *Service) GenerateToken(ctx context.Context, adminID int) (token string, err error) {
	return token, err
}

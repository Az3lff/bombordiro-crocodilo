package auth

import (
	"context"
	"fmt"
	"github.com/Az3lff/bombordiro-crocodilo/internal/entities"
	"github.com/golang-jwt/jwt/v5"
	"strconv"

	"github.com/Az3lff/bombordiro-crocodilo/internal/models"
)

func (s *Service) ClientSignUp(ctx context.Context, req models.ClientSignUpRequest) (resp models.ClientSignUpResponse, err error) {
	exist, err := s.repo.SelectExists(ctx, req.Login)
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

	student := &entities.Student{
		Login:      req.Login,
		Password:   hashPassword,
		FirstName:  req.FirstName,
		SecondName: req.SecondName,
	}

	err = s.repo.InsertStudent(ctx, student)
	if err != nil {
		return resp, err
	}

	token, _, err := s.jwtManager.GenerateTokens(strconv.Itoa(student.ID), jwt.MapClaims{})
	if err != nil {
		return resp, err
	}

	return models.ClientSignUpResponse{
		AuthToken: token,
	}, err
}

func (s *Service) ClientSignIn(ctx context.Context, req models.ClientSignInRequest) (resp models.ClientSignInResponse, err error) {
	user, err := s.repo.SelectStudentByLogin(ctx, req.Login)
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

	return models.ClientSignInResponse{
		AuthToken: token,
	}, err
}

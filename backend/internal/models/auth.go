package models

type (
	// admin sign in
	AdminSignInRequest struct {
		Login    string `json:"login"`
		Password string `json:"password"`
	}
	AdminSignInResponse struct {
		AuthToken string `json:"auth_token"`
	}
	// admin sign up
	AdminSignUpRequest struct {
		Login       string `json:"login"`
		Password    string `json:"password"`
		FirstName   string `json:"first_name"`
		SecondName  string `json:"second_name"`
		InviteToken string `json:"invite_token"`
	}
	AdminSignUpResponse struct {
		AuthToken string `json:"auth_token"`
	}
	// client sign in
	ClientSignInRequest struct {
		Login    string `json:"login"`
		Password string `json:"password"`
	}
	ClientSignInResponse struct {
		AuthToken string `json:"auth_token"`
	}
	// client sign up
	ClientSignUpRequest struct {
		Login      string `json:"login"`
		Password   string `json:"password"`
		FirstName  string `json:"first_name"`
		SecondName string `json:"second_name"`
	}
	ClientSignUpResponse struct {
		AuthToken string `json:"auth_token"`
	}
	// utils
	PostInviteTokenRequest struct {
	}
)

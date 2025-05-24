package models

type (
	SignUpRequest struct {
		Login       string `json:"login"`
		Password    string `json:"password"`
		FirstName   string `json:"first_name"`
		SecondName  string `json:"second_name"`
		InviteToken string `json:"invite_token,omitempty"`
	}
	SignUpResponse struct {
		AuthToken string `json:"auth_token"`
		Role      string `json:"role"`
	}
)

type (
	SignInRequest struct {
		Login    string `json:"login"`
		Password string `json:"password"`
	}
	SignInResponse struct {
		Role      string `json:"role"`
		AuthToken string `json:"auth_token"`
	}
)

type (
	PostInviteTokenRequest struct {
		Role    string `json:"role"`
		AdminID int    `json:"admin_id"`
	}
	PostInviteTokenResponse struct {
		InviteToken string `json:"invite_token"`
	}
)

type (
	AuthRequest struct {
		AuthToken string `json:"auth_token"`
	}
	AuthResponse struct {
		ID         int    `json:"id"`
		Login      string `json:"login"`
		FirstName  string `json:"first_name"`
		SecondName string `json:"second_name"`
		Role       string `json:"role"`
	}
)

type (
	User struct {
		ID         int    `json:"id"`
		Login      string `json:"login"`
		FirstName  string `json:"first_name"`
		SecondName string `json:"last_name"`
		Role       string `json:"role"`
	}
)

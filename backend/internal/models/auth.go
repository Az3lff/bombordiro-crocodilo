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

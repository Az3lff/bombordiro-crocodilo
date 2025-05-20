package models

type (
	// sign in
	TeacherSignInRequest struct {
		Login    string `json:"login"`
		Password string `json:"password"`
	}
	TeacherSignInResponse struct {
		AuthToken string `json:"auth_token"`
	}
	// sign up
	TeacherSignUpRequest struct {
		Login       string `json:"login"`
		Password    string `json:"password"`
		FirstName   string `json:"first_name"`
		SecondName  string `json:"second_name"`
		InviteToken string `json:"invite_token"`
	}
	TeacherSignUpResponse struct {
		AuthToken string `json:"auth_token"`
	}
)

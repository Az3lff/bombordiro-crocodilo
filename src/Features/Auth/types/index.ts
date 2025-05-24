export interface LoginData {
  login: string;
  password: string;
}

export interface RegisterData extends LoginData {
  first_name: string;
  second_name: string;
  invite_token: string;
}

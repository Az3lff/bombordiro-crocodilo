export interface LoginData {
  login: string;
  password: string;
}

export interface RegisterData extends LoginData {
  firstName: string;
  secondName: string;
  inviteToken: string;
}
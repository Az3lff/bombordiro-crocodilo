import axios from "axios";
import { LoginData, RegisterData } from "../../Features/Auth/types";

export const login = (data: LoginData) => axios.post('http://localhost:8000/client/v1/auth/sign-in', data);
export const register = (data: RegisterData) => axios.post('http://localhost:8000/client/v1/auth/sign-up', data);
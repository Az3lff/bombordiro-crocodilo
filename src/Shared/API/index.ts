import axios from "axios";
import { LoginData, RegisterData } from "../../Features/Auth/types";
import type { TokenRole } from "../../Features/Admin/types";
import { $token } from "../../Entities/session"

const BASE_URL = 'http://82.202.156.164:8000';
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = $token.getState();
  if (token) {
    config.headers["Authorization"] = token;
  }
  return config;
});

export const login = (data: LoginData) => axiosInstance.post('/api/v1/auth/sign-in', data);
export const register = (data: RegisterData) => axiosInstance.post('/api/v1/auth/sign-up', data);
export const generateToken = (role: TokenRole) => axiosInstance.post('/admin/v1/auth/token', null, {
    params: { role },
});

export const uploadMap = (data: FormData) => axiosInstance.post('/admin/v1/maps/', data);
import { createEvent, createStore } from "effector";
import { persist } from 'effector-storage/local';

function decodeJwtRole(token: string): 'admin' | 'client' | 'teacher' | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.role === 'admin' || payload.role === 'client' || payload.role === 'teacher') {
      return payload.role;
    }
    return null;
  } catch {
    return null;
  }
}

export const userLoggedIn = createEvent<string>();  
export const userLoggedOut = createEvent();

// Храним сам токен
export const $token = createStore<string | null>(null)
  .on(userLoggedIn, (_,  token) => token)
  .reset(userLoggedOut);

export const $userRole = createStore<'admin' | 'client' | 'teacher' | null>(null)
  .on(userLoggedIn, (_, token) => decodeJwtRole(token))
  .on($token, (_, token) => token ? decodeJwtRole(token) : null)
  .reset(userLoggedOut);

// Является ли пользователь авторизован
export const $isAuthenticated = $token.map(Boolean);
export const $isAdmin = $userRole.map((role) => role === 'admin');

// Сохраняем токен в localStorage
persist({ store: $token, key: 'auth_token' });
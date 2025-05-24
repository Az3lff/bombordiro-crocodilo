import { createEvent, createStore, createEffect } from "effector";
import { login, register } from "../../../Shared/API/auth";
import type { LoginData, RegisterData } from "../types"

export const loginFx = createEffect(async (data: LoginData) => {
  const response = await login(data);
  return response.data.auth_token as string;
});

export const registerFx = createEffect(async (data: RegisterData) => {
  const response = await register(data);
  return response;
});


export const $authError = createStore<string | null>(null)
  .on(loginFx.failData, (_, error) => 'Ошибка входа: ' + error.message)
  .on(registerFx.failData, (_, error) => 'Ошибка регистрации: ' + error.message)
  .reset(loginFx.done, registerFx.done);

export const setAuthError = createEvent<string>();
$authError.on(setAuthError, (_, error) => error);
import { createEvent, createStore, createEffect } from "effector";
import { generateToken } from "../../../Shared/API";
import type { TokenRole } from "../../../Features/Admin/types";

export const generateTokenFx = createEffect(async (role: TokenRole) => {
    const response = await generateToken(role);
    return response.data.invite_token as string;
});

export const $tokenError = createStore<string | null>(null)
  .on(generateTokenFx.failData, (_, error) => 'Ошибка получения кода приглашения: ' + error.message)
  .reset(generateTokenFx.done);

export const setTokenError = createEvent<string>();
$tokenError.on(setTokenError, (_, error) => error);
import { createEvent, createStore } from "effector";

type StringMatrix = string[][];

// Создаем событие для обновления значения
export const setMessage = createEvent<StringMatrix>();
export const addMessage = createEvent<string[]>();
export const clearAllMessages = createEvent();

export const $messageStore = createStore<StringMatrix>([])
    .on(setMessage, (_, newMatrix) => newMatrix)
    .on(addMessage, (state, newRow) => [...state, newRow])
    .reset(clearAllMessages);
import { createEvent, createStore } from 'effector';

// Событие для установки скорости
export const setSpeed = createEvent<number>();

// Стор со значением по умолчанию — 5
export const $speed = createStore(5).on(setSpeed, (_, newSpeed) => newSpeed);

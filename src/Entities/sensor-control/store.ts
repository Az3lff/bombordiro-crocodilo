import { createEvent, createStore } from "effector";

export const setIsSensorVisible = createEvent<boolean>();
export const $sensorVisible = createStore(false)
  .on(setIsSensorVisible, (_, visible) => visible);
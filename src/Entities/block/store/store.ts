import { createEvent, createStore } from "effector";

export const setBlocklyCode = createEvent<string>();
export const $blocklyCode = createStore("").on(setBlocklyCode, (_, code) => code);

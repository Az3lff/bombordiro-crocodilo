import { createStore, createEvent } from 'effector';

export interface Map {
  id: string;
  title: string;
  desc_url: string;
  map_url: string;
}

export const setCurrentMap = createEvent<Map>();
export const resetCurrentMap = createEvent();

export const $currentMap = createStore<Map | null>(null)
  .on(setCurrentMap, (_, map) => map)
  .reset(resetCurrentMap);
import { createEvent, createStore, sample } from "effector";

// Стор для хранения ссылки на игрока
export const $playerRef = createStore<any>(null);
export const setPlayerRef = createEvent<any>();
export const startMoving = createEvent();
export const stopMoving = createEvent();
export const turnLeft = createEvent();
export const turnRight = createEvent();


$playerRef.on(setPlayerRef, (_, ref) => ref);

// Событие, которое инициирует движение игрока

// Реакция на событие movePlayerForward
sample({
  source: $playerRef,
  clock: startMoving,
  filter: (ref): ref is { startMoving: () => void } => !!ref && typeof ref.startMoving === "function",
  fn: (player) => {
    player.startMoving();
  },
});

sample({
  source: $playerRef,
  clock: stopMoving,
  filter: (ref): ref is { stopMoving: () => void } => !!ref && typeof ref.stopMoving === "function",
  fn: (player) => {
    player.stopMoving();
  },
});
sample({
  source: $playerRef,
  clock: turnLeft,
  filter: (ref): ref is { turnLeft: () => void } => !!ref && typeof ref.turn === "function",
  fn: (player) => {
    player.turn('LEFT');
  },
});
sample({
  source: $playerRef,
  clock: turnRight,
  filter: (ref): ref is { turnLeft: () => void } => !!ref && typeof ref.turn === "function",
  fn: (player) => {
    player.turn('RIGHT');
  },
});

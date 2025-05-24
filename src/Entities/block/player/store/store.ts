import { createEvent, createStore, sample } from "effector";

export const $playerRef = createStore<any>(null);
export const setPlayerRef = createEvent<any>();
export const startMoving = createEvent();
export const stopMoving = createEvent();
export const turnLeft = createEvent<number>();
export const turnRight = createEvent<number>();
export const resetPlayerPosition = createEvent();

$playerRef
  .on(setPlayerRef, (_, ref) => ref)
  .on(resetPlayerPosition, (ref) => {
    if (ref?.resetPosition) {
      ref.resetPosition();
    }
    return ref;
  });

sample({
  source: $playerRef,
  clock: turnLeft,
  filter: (ref): ref is { turnLeft: (angle: number) => void } => !!ref,
  fn: (player, angle) => {
    player.turnLeft(angle);
  },
});

sample({
  source: $playerRef,
  clock: turnRight,
  filter: (ref): ref is { turnRight: (angle: number) => void } => !!ref,
  fn: (player, angle) => {
    player.turnRight(angle);
  },
});

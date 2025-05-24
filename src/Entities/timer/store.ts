import { createEvent, createStore, createEffect, sample } from 'effector';

export const start = createEvent();
export const pause = createEvent();
export const stop = createEvent();
export const reset = createEvent();

const tick = createEvent<number>();

export const $isRunning = createStore(false)
  .on(start, () => true)
  .on(pause, () => false)
  .on(stop, () => false);

export const $milliseconds = createStore(0)
  .on(tick, (time, now) => now)
  .reset(stop, reset);

let interval: any;

export const startTimerFx = createEffect(() => {
  const startTime = Date.now() - $milliseconds.getState();

  interval = setInterval(() => {
    tick(Date.now() - startTime);
  }, 10);
});

export const stopTimerFx = createEffect(() => {
  clearInterval(interval);
});

sample({
  clock: start,
  target: startTimerFx,
});

sample({
  clock: pause,
  target: stopTimerFx,
});

sample({
  clock: stop,
  target: stopTimerFx,
});

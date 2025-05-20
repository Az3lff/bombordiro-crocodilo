import { createStore, createEvent } from 'effector';

type MotorsSpeed = {
  left: number;
  right: number;
};

const $motorsSpeed = createStore<MotorsSpeed>({
  left: 0,
  right: 0
});

const setLeftSpeed = createEvent<number>();
const setRightSpeed = createEvent<number>();
const setBothSpeeds = createEvent<{ left?: number; right?: number }>();
const resetSpeeds = createEvent();

$motorsSpeed
  .on(setLeftSpeed, (state, speed) => ({ ...state, left: speed }))
  .on(setRightSpeed, (state, speed) => ({ ...state, right: speed }))
  .on(setBothSpeeds, (state, speeds) => ({
    ...state,
    left: speeds.left ?? state.left,
    right: speeds.right ?? state.right
  }))
  .reset(resetSpeeds);

const getSpeeds = () => $motorsSpeed.getState();
const getLeftSpeed = () => getSpeeds().left;
const getRightSpeed = () => getSpeeds().right;

export const motorsStore = {
  $motorsSpeed,
  setLeftSpeed,
  setRightSpeed,
  setBothSpeeds: setBothSpeeds,
  resetSpeeds,
  getSpeeds,
  getLeftSpeed,
  getRightSpeed
};
export const Controls = {
  up: "up",
  down: "down",
  left: "left",
  right: "right",
  boost: "boost",
  jump: "jump",
};

export const gravity = -9.81;

export const analogState: { x: number; z: number } = {
  x: 0.7,
  z: 0.7,
};

export let jumping = false;

export function setJumping(state: boolean) {
  jumping = state;
}

export type IOError = undefined | null | string;

export interface Player {
  id: string;
  coins: number;
  position: [number, number, number];
  rotation: number;
  isSpectator: boolean;
  name: string;
}

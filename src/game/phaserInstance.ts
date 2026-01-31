import type Phaser from "phaser";

declare global {
  // eslint-disable-next-line no-var
  interface Window {
    __PHASER_GAME__?: Phaser.Game | null;
  }
}

export {};

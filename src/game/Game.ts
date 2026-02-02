import { EventBus } from "./core/EventBus";
import type { GameEventMap } from "./events/GameEventMap";

import { PlacementSystem } from "./systems/PlacementSystem";
//*import { ValidationSystem } from "./systems/ValidationSystem";
import { PlayScene } from "./scenes/PlayScene";
import { Board } from "./board/Board";
import { BootScene } from "./scenes/BootScene";

export class Game {
  public readonly bus: EventBus<GameEventMap>;

  constructor() {
    this.bus = new EventBus<GameEventMap>();
  }

  // createPhaserGame(container: HTMLElement) {
  //   return new Phaser.Game({
  //     type: Phaser.AUTO,
  //     parent: container,
  //     scene: [BootScene, PlayScene],
  //   });
  // }
}

// game/ui/UiLayer.ts
import Phaser from "phaser";
import { EventBus } from "../core/EventBus";
import { GameEventMap } from "../events/GameEventMap";

import { LineResultBanner } from "./hud/LineResultBanner";
import { NextCardPreview } from "./hud/NextCardPreview";
import { ScoreDisplay } from "./hud/ScoreDisplay";
import { PlayerDisplay } from "./units/PlayerDisplay";
import { EnemyDisplay } from "./units/EnemyDisplay";

export class UiLayer extends Phaser.GameObjects.Container {
  private bus: EventBus<GameEventMap>;
  private lineResultBanner: LineResultBanner;
  private nextCardPreview: NextCardPreview;
  private scoreDisplay: ScoreDisplay;
  private playerDisplay: PlayerDisplay;
  private enemyDisplay: EnemyDisplay;
  constructor(scene: Phaser.Scene, bus: EventBus<GameEventMap>) {
    super(scene, 0, 0);
    this.bus = bus;
    scene.add.existing(this);
    this.setDepth(1000);
    this.nextCardPreview = new NextCardPreview(scene, bus, 80, 40);
    // UI elements
    this.lineResultBanner = new LineResultBanner(scene, bus, 1200, 50);
    this.scoreDisplay = new ScoreDisplay(scene, bus, 1200, 50);
    this.playerDisplay = new PlayerDisplay(this.scene, this.bus, 200, 600);
    this.enemyDisplay = new EnemyDisplay(this.scene, this.bus, 1300, 600);
    this.add([
      this.lineResultBanner,
      this.nextCardPreview,
      this.scoreDisplay,
      this.enemyDisplay,
      this.playerDisplay,
    ]);
    this.bus.on("CARD_DRAWN", ({ card }) => {
      this.nextCardPreview.setPreviewCard(card);
    });
  }

  destroy(fromScene?: boolean) {
    super.destroy(fromScene);
  }
}

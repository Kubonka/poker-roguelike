// game/ui/UiLayer.ts
import Phaser from "phaser";
import { EventBus } from "../core/EventBus";
import { GameEventMap } from "../events/GameEventMap";

import { LineResultBanner } from "./hud/LineResultBanner";
import { NextCardPreview } from "./preview/NextCardPreview";

export class UiLayer extends Phaser.GameObjects.Container {
  private bus: EventBus<GameEventMap>;
  private lineResultBanner: LineResultBanner;
  private nextCardPreview: NextCardPreview;

  constructor(scene: Phaser.Scene, bus: EventBus<GameEventMap>) {
    super(scene, 0, 0);
    this.bus = bus;
    scene.add.existing(this);
    this.setDepth(1000);
    this.nextCardPreview = new NextCardPreview(scene, bus, 80, 40);
    // UI elements
    this.lineResultBanner = new LineResultBanner(scene, bus);

    this.add([this.lineResultBanner, this.nextCardPreview]);
    this.bus.on("CARD_DRAWN", ({ card }) => {
      console.log("1");
      this.nextCardPreview.setPreviewCard(card);
    });
  }

  destroy(fromScene?: boolean) {
    super.destroy(fromScene);
  }
}

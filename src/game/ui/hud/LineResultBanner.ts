// game/ui/hud/LineResultBanner.ts
import Phaser from "phaser";
import { EventBus } from "../../core/EventBus";
import { GameEventMap } from "../../events/GameEventMap";

export class LineResultBanner extends Phaser.GameObjects.Container {
  private text: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, bus: EventBus<GameEventMap>) {
    super(scene, 1250, 800);

    scene.add.existing(this);

    this.text = scene.add
      .text(0, 0, "", {
        fontSize: "48px",
        color: "#ffd700",
      })
      .setOrigin(0.5);

    this.add(this.text);

    bus.on("LINE_COMPLETED", ({ rank }) => {
      if (rank !== "high_card") {
        this.show(rank);
      }
    });
  }

  private show(rank: string) {
    this.text.setText(rank.toUpperCase());
    this.setVisible(true);

    this.scene.time.delayedCall(2200, () => {
      this.setVisible(false);
    });
  }
}

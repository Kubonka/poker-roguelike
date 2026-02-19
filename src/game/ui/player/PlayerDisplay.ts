import { EventBus } from "@/game/core/EventBus";
import { GameEventMap } from "@/game/events/GameEventMap";

export class PlayerDisplay extends Phaser.GameObjects.Container {
  private bus!: EventBus<GameEventMap>;
  private hitPoints: Phaser.GameObjects.Text;
  constructor(
    scene: Phaser.Scene,
    bus: EventBus<GameEventMap>,
    x: number,
    y: number,
  ) {
    super(scene, x, y);
    scene.add.existing(this);
    this.bus = bus;
    this.hitPoints = scene.add
      .text(0, 0, "", {
        fontSize: "36px",
        color: "#ffd700",
      })
      .setOrigin(0.5);
    this.bus.on("PLAYER_DAMAGED", (payload) =>
      this.updateHealthBar(payload.hitPoints, payload.damage),
    );
  }
  private updateHealthBar(hitPoints, damage) {}
}

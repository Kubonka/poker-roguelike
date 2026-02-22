import { EventBus } from "@/game/core/EventBus";
import { GameEventMap } from "@/game/events/GameEventMap";

export class PlayerDisplay extends Phaser.GameObjects.Container {
  private bus!: EventBus<GameEventMap>;
  private playerName: Phaser.GameObjects.Text;
  private hitPoints: Phaser.GameObjects.Text;
  private lastDamage: Phaser.GameObjects.Text;
  constructor(
    scene: Phaser.Scene,
    bus: EventBus<GameEventMap>,
    x: number,
    y: number,
  ) {
    super(scene, x, y);
    scene.add.existing(this);
    this.bus = bus;
    this.playerName = scene.add
      .text(0, -60, "PLAYER", {
        fontSize: "40px",
        color: "#ffd700",
      })
      .setOrigin(0.5);
    this.hitPoints = scene.add
      .text(0, 20, "", {
        fontSize: "36px",
        color: "#ffd700",
      })
      .setOrigin(0.5);
    this.lastDamage = scene.add
      .text(0, 0, "", {
        fontSize: "24px",
        color: "#ffd700",
      })
      .setOrigin(0.5);
    this.add([this.hitPoints, this.lastDamage, this.playerName]);
    this.bus.on("PLAYER_DAMAGED", (payload) =>
      this.updateHealth(payload.hitPoints, payload.damage),
    );
    this.bus.on("UPDATE_PLAYER", (payload) =>
      this.updateHealth(payload.player.hitPoints, 0),
    );
  }
  private updateHealth(hitPoints: number, damage: number) {
    this.hitPoints.setText(hitPoints.toString());
    if (damage > 0) {
      this.lastDamage.setText(`-${damage}`);
      this.lastDamage.setVisible(true);

      this.scene.time.delayedCall(1200, () => {
        this.lastDamage.setVisible(false);
      });
    }
  }
}

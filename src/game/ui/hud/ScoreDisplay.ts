import { EventBus } from "@/game/core/EventBus";
import { GameEventMap } from "@/game/events/GameEventMap";

export class ScoreDisplay extends Phaser.GameObjects.Container {
  private bus!: EventBus<GameEventMap>;
  private newScore: Phaser.GameObjects.Text;
  private totalScore: Phaser.GameObjects.Text;
  private comboMultiplier: Phaser.GameObjects.Text;
  constructor(
    scene: Phaser.Scene,
    bus: EventBus<GameEventMap>,
    x: number,
    y: number,
  ) {
    super(scene, x, y);
    scene.add.existing(this);
    this.bus = bus;
    this.comboMultiplier = scene.add
      .text(50, 25, "", {
        fontSize: "36px",
        color: "#ffd700",
      })
      .setOrigin(0.5);
    this.totalScore = scene.add
      .text(50, 200, "", {
        fontSize: "48px",
        color: "#ffd700",
      })
      .setOrigin(0.5);

    this.newScore = scene.add
      .text(170, 150, "", {
        fontSize: "36px",
        color: "#ffd700",
      })
      .setOrigin(0.5);
    this.add([this.totalScore, this.newScore, this.comboMultiplier]);
    this.bus.on("SCORE_ADDED", ({ amount, total, source }) => {
      console.log(`+${amount} (${source}) → total: ${total}`);
    });
    this.bus.on("SCORE_ADDED", (payload) =>
      this.updateScore(payload.amount, payload.source, payload.total),
    );
    this.bus.on("COMBO_CHANGED", (payload) =>
      this.updateCombo(payload.comboMultiplier),
    );
  }

  private updateScore(amount: number, source: string, total: number) {
    // score incremental
    if (amount != 1) {
      this.newScore.setText(`+${amount}`);
      this.newScore.setVisible(true);

      this.scene.time.delayedCall(2200, () => {
        this.newScore.setVisible(false);
      });

      // score total (siempre visible)
      this.totalScore.setText(`SCORE : ${total.toString()}`);
    }
  }
  private updateCombo(comboMultiplier: number) {
    this.comboMultiplier.setText(`COMBO x${comboMultiplier.toString()}`);
  }
}

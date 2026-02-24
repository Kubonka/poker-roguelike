import { EventBus } from "@/game/core/EventBus";
import { Enemy } from "@/game/enemy/Enemy";
import { EnemySkill } from "@/game/enemy/EnemySkill";
import { GameEventMap } from "@/game/events/GameEventMap";

export class EnemyDisplay extends Phaser.GameObjects.Container {
  private bus!: EventBus<GameEventMap>;
  private enemyName: Phaser.GameObjects.Text;
  private hitPoints: Phaser.GameObjects.Text;
  private lastDamage: Phaser.GameObjects.Text;
  private skillDisplay: EnemySkillDisplay;
  constructor(
    scene: Phaser.Scene,
    bus: EventBus<GameEventMap>,
    x: number,
    y: number,
  ) {
    super(scene, x, y);
    scene.add.existing(this);
    this.bus = bus;
    this.skillDisplay = new EnemySkillDisplay(this.scene, this.bus, -40, 20);
    this.enemyName = scene.add
      .text(20, -60, `ENEMY lvl ${1}}`, {
        fontSize: "40px",
        color: "#ffd700",
      })
      .setOrigin(0.5);
    this.hitPoints = scene.add
      .text(50, 48, "", {
        fontSize: "36px",
        color: "#ffd700",
      })
      .setOrigin(0.5);
    this.lastDamage = scene.add
      .text(50, 10, "", {
        fontSize: "24px",
        color: "#ffd700",
      })
      .setOrigin(0.5);
    this.add([
      this.hitPoints,
      this.lastDamage,
      this.skillDisplay,
      this.enemyName,
    ]);
    this.bus.on("ENEMY_DAMAGED", (payload) =>
      this.updateHealthBar(payload.enemy.hitPoints, payload.damage),
    );
    this.bus.on("UPDATE_ENEMY", (payload) => {
      this.updateName(payload.enemy);
      this.updateHealthBar(payload.enemy.hitPoints, 0);
    });
  }
  private updateName(enemy: Enemy) {
    this.enemyName.setText(`ENEMY lvl ${enemy.enemyLvl.toString()}`);
  }
  private updateHealthBar(hitPoints: number, damage: number) {
    //console.log("hitPoints", hitPoints);
    //console.log("damage", damage);
    this.hitPoints.setText(hitPoints.toString());
    this.lastDamage.setText(`-${damage}`);
    this.lastDamage.setVisible(true);

    this.scene.time.delayedCall(1200, () => {
      this.lastDamage.setVisible(false);
    });
  }
}
class EnemySkillDisplay extends Phaser.GameObjects.Container {
  private bus!: EventBus<GameEventMap>;
  private timeToCast: Phaser.GameObjects.Text;
  private damage: Phaser.GameObjects.Text;
  private damageSprite!: Phaser.GameObjects.Sprite;
  private timeToCastSprite!: Phaser.GameObjects.Sprite;
  constructor(
    scene: Phaser.Scene,
    bus: EventBus<GameEventMap>,
    x: number,
    y: number,
  ) {
    super(scene, x, y);
    this.bus = bus;
    this.timeToCastSprite = scene.add.sprite(-57, 0, "hourglass_icon");
    this.damageSprite = scene.add.sprite(-40, 60, "attack_icon");
    this.timeToCast = scene.add
      .text(0, 0, "", {
        fontSize: "36px",
        color: "#ffd700",
      })
      .setOrigin(0.5);
    this.damage = scene.add
      .text(0, 42, "", {
        fontSize: "36px",
        color: "#ffd700",
      })
      .setOrigin(0.5);
    this.add([
      this.timeToCast,
      this.damage,
      this.damageSprite,
      this.timeToCastSprite,
    ]);
    this.bus.on("UPDATE_ENEMY", (payload) =>
      this.updateEnemySkill(payload.enemy.currentSkill),
    );
  }
  private updateEnemySkill(skill: EnemySkill | null) {
    console.log("skill updated", skill);
    if (!skill) return;
    this.timeToCast.setText(skill.currentTurnsToCast.toString());
    this.damage.setText(skill.currentValue.toString());
  }
}

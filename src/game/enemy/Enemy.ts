import { EventBus } from "../core/EventBus";
import { GameEventMap } from "../events/GameEventMap";
import { EnemySkill } from "./EnemySkill";

export class Enemy extends Phaser.GameObjects.Container {
  private isMyTurn = false;
  public hitPoints = 200;
  private skills: EnemySkill[] = [];
  public currentSkill: EnemySkill | null = null;
  public enemyLvl: number;
  public dead = false;
  constructor(
    scene: Phaser.Scene,
    private readonly bus: EventBus<GameEventMap>,
    x: number,
    y: number,
    enemyLvl: number,
  ) {
    super(scene, x, y);
    this.enemyLvl = enemyLvl;
    this.bus.on("ENEMY_TURN_STARTED", this.onTurnStarted);

    // ❌ ELIMINAR — causa actualización duplicada
    // this.bus.on("PLAYER_TURN_RESOLVED", () =>
    //   this.bus.emit("UPDATE_ENEMY", { enemy: this }),
    // );

    this.bus.on("SCORE_ADDED", (payload) => this.takeDamage(payload.amount));

    this.initSkills();
  }

  private initSkills() {
    const skillsData = [
      {
        name: "low",
        value: Math.floor(18 + this.enemyLvl * 18 * 0.1),
        turnsToCast: 3,
        timeout: 5,
      },
      {
        name: "mid",
        value: Math.floor(10 + this.enemyLvl * 40 * 0.1),
        turnsToCast: 6,
        timeout: 10,
      },
      {
        name: "high",
        value: Math.floor(10 + this.enemyLvl * 90 * 0.1),
        turnsToCast: 10,
        timeout: 15,
      },
    ];

    skillsData.forEach((skill) => {
      const newSkill = new EnemySkill(
        skill.value,
        skill.timeout,
        skill.name,
        skill.turnsToCast,
      );
      this.skills.push(newSkill);
    });
  }
  private onTurnStarted = () => {
    this.isMyTurn = true;

    // actualizar cooldowns
    this.skills.forEach((s) => {
      if (!s.active) s.updateCooldown();
    });

    // intentar casteo
    if (this.currentSkill) {
      const result = this.currentSkill.tryCast();

      if (result.status) {
        this.bus.emit("ENEMY_SKILL_USED", {
          skill: this.currentSkill,
        });

        this.currentSkill.enterCooldown();
        this.currentSkill = null;
      }
    }

    // asignar skill si no hay
    if (!this.currentSkill) {
      this.assignNewSkill();
    }

    this.isMyTurn = false;

    // ✔ ÚNICA actualización del turno enemigo
    this.bus.emit("UPDATE_ENEMY", { enemy: this });

    // ✔ resolver turno en siguiente tick
    //this.scene.time.delayedCall(0, () => {
    this.bus.emit("ENEMY_TURN_RESOLVED", { enemy: this });
    //});
  };

  private assignNewSkill() {
    const pool = this.skills.filter((s) => s.active);
    if (pool.length) {
      const rnd = Math.floor(Math.random() * pool.length);
      this.currentSkill = pool[rnd];
    }
  }

  public takeDamage(damage: number) {
    if (this.currentSkill) {
      const skillValue = this.currentSkill.getValue();
      if (skillValue > 0) {
        const absorbed = Math.min(damage, skillValue);
        this.currentSkill.setValue(skillValue - absorbed);
        damage -= absorbed;
      }
    }

    if (damage > 0) {
      this.hitPoints = Math.max(0, this.hitPoints - damage);
    }

    this.bus.emit("ENEMY_DAMAGED", { enemy: this, damage });
    if (this.hitPoints <= 0) this.bus.emit("ENEMY_DEAD", undefined);
    this.bus.emit("UPDATE_ENEMY", { enemy: this });
    //this.bus.emit("ENEMY_TURN_RESOLVED", { enemy: this });

    // ✔ actualización solo por daño real
  }

  destroy() {
    this.bus.off("ENEMY_TURN_STARTED", this.onTurnStarted);
  }
}

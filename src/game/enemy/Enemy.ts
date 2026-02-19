import { EventBus } from "../core/EventBus";
import { GameEventMap } from "../events/GameEventMap";
import { EnemySkill } from "./EnemySkill";

const skillsData = [
  { name: "low1", value: 20, turnsToCast: 4, timeout: 7 },
  { name: "mid", value: 50, turnsToCast: 6, timeout: 10 },
  { name: "high", value: 100, turnsToCast: 10, timeout: 15 },
  { name: "low2", value: 15, turnsToCast: 3, timeout: 5 },
];
export class Enemy extends Phaser.GameObjects.Container {
  private isMyTurn = false;
  private hitPoints = 1000;
  private skills: EnemySkill[] = [];
  private currentSkill: EnemySkill | null = null;
  constructor(
    scene: Phaser.Scene,
    private readonly bus: EventBus<GameEventMap>,
    x: number,
    y: number,
  ) {
    super(scene, x, y);
    this.bus.on("ENEMY_TURN_STARTED", this.onTurnStarted);
    this.initSkills();
  }
  private initSkills() {
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
  private onTurnStarted = async () => {
    this.isMyTurn = true;
    //si esta casteando
    //  si -> reducir el timer del skill
    //  no -> buscar un skill en el array de skills y castearlo
    this.skills.forEach((s) => s.update());
    if (this.currentSkill) {
      if (this.currentSkill.tryCast()) {
        this.bus.emit("ENEMY_SKILL_USED", { skill: this.currentSkill });
        this.currentSkill = null;
      }
    } else {
      this.assignNewSkill();
    }
    this.bus.emit("ENEMY_TURN_RESOLVED", undefined);
    this.isMyTurn = false;
  };

  private assignNewSkill() {
    const pool = this.skills.filter((s) => s.active);
    if (pool.length) {
      const rnd = Math.floor(Math.random() * pool.length);
      this.currentSkill = pool[rnd];
    }
  }
  destroy() {
    this.bus.off("ENEMY_TURN_STARTED", this.onTurnStarted);
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
  }
}

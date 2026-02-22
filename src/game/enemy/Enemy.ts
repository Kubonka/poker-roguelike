import { EventBus } from "../core/EventBus";
import { GameEventMap } from "../events/GameEventMap";
import { EnemySkill } from "./EnemySkill";

export class Enemy extends Phaser.GameObjects.Container {
  private isMyTurn = false;
  public hitPoints = 1000;
  private skills: EnemySkill[] = [];
  public currentSkill: EnemySkill | null = null;

  constructor(
    scene: Phaser.Scene,
    private readonly bus: EventBus<GameEventMap>,
    x: number,
    y: number,
  ) {
    super(scene, x, y);

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
      { name: "low1", value: 20, turnsToCast: 4, timeout: 7 },
      { name: "mid", value: 50, turnsToCast: 6, timeout: 10 },
      { name: "high", value: 100, turnsToCast: 10, timeout: 15 },
      { name: "low2", value: 15, turnsToCast: 3, timeout: 5 },
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
    this.scene.time.delayedCall(0, () => {
      this.bus.emit("ENEMY_TURN_RESOLVED", { enemy: this });
    });
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

    // ✔ actualización solo por daño real
    this.bus.emit("UPDATE_ENEMY", { enemy: this });
  }

  destroy() {
    this.bus.off("ENEMY_TURN_STARTED", this.onTurnStarted);
  }
}
// import { EventBus } from "../core/EventBus";
// import { GameEventMap } from "../events/GameEventMap";
// import { EnemySkill } from "./EnemySkill";

// const skillsData = [
//   { name: "low1", value: 20, turnsToCast: 4, timeout: 7 },
//   { name: "mid", value: 50, turnsToCast: 6, timeout: 10 },
//   { name: "high", value: 100, turnsToCast: 10, timeout: 15 },
//   { name: "low2", value: 15, turnsToCast: 3, timeout: 5 },
// ];

// export class Enemy extends Phaser.GameObjects.Container {
//   private isMyTurn = false;
//   public hitPoints = 1000;
//   private skills: EnemySkill[] = [];
//   public currentSkill: EnemySkill | null = null;

//   constructor(
//     scene: Phaser.Scene,
//     private readonly bus: EventBus<GameEventMap>,
//     x: number,
//     y: number,
//   ) {
//     super(scene, x, y);

//     this.bus.on("ENEMY_TURN_STARTED", this.onTurnStarted);
//     this.bus.on("PLAYER_TURN_RESOLVED", () =>
//       this.bus.emit("UPDATE_ENEMY", { enemy: this }),
//     );
//     this.bus.on("SCORE_ADDED", (payload) => this.takeDamage(payload.amount));

//     this.initSkills();
//   }

//   private initSkills() {
//     skillsData.forEach((skill) => {
//       const newSkill = new EnemySkill(
//         skill.value,
//         skill.timeout,
//         skill.name,
//         skill.turnsToCast,
//       );
//       this.skills.push(newSkill);
//     });
//   }

//   private onTurnStarted = () => {
//     this.bus.emit("UPDATE_ENEMY", { enemy: this });
//     this.isMyTurn = true;

//     // actualizar cooldowns
//     this.skills.forEach((s) => {
//       if (!s.active) s.updateCooldown();
//     });

//     // intentar casteo si existe
//     if (this.currentSkill) {
//       const result = this.currentSkill.tryCast();
//       if (result.status) {
//         this.bus.emit("ENEMY_SKILL_USED", { skill: this.currentSkill });
//         this.currentSkill.enterCooldown();
//         this.currentSkill = null;
//       }
//     }

//     // asignar skill si no hay
//     if (!this.currentSkill) {
//       this.assignNewSkill();
//     }

//     this.isMyTurn = false;

//     // resolver turno en el siguiente tick del juego
//     this.scene.time.delayedCall(0, () => {
//       this.bus.emit("ENEMY_TURN_RESOLVED", { enemy: this });
//     });
//   };

//   private assignNewSkill() {
//     const pool = this.skills.filter((s) => s.active);
//     if (pool.length) {
//       const rnd = Math.floor(Math.random() * pool.length);
//       this.currentSkill = pool[rnd];
//     }
//   }

//   destroy() {
//     this.bus.off("ENEMY_TURN_STARTED", this.onTurnStarted);
//   }

//   public takeDamage(damage: number) {
//     if (this.currentSkill) {
//       const skillValue = this.currentSkill.getValue();
//       if (skillValue > 0) {
//         const absorbed = Math.min(damage, skillValue);
//         this.currentSkill.setValue(skillValue - absorbed);
//         damage -= absorbed;
//       }
//     }
//     if (damage > 0) {
//       this.hitPoints = Math.max(0, this.hitPoints - damage);
//     }
//     this.bus.emit("ENEMY_DAMAGED", { enemy: this, damage });
//     this.bus.emit("UPDATE_ENEMY", { enemy: this });
//   }
// }
// // import { EventBus } from "../core/EventBus";
// // import { GameEventMap } from "../events/GameEventMap";
// // import { EnemySkill } from "./EnemySkill";

// // const skillsData = [
// //   { name: "low1", value: 20, turnsToCast: 4, timeout: 7 },
// //   { name: "mid", value: 50, turnsToCast: 6, timeout: 10 },
// //   { name: "high", value: 100, turnsToCast: 10, timeout: 15 },
// //   { name: "low2", value: 15, turnsToCast: 3, timeout: 5 },
// // ];
// // export class Enemy extends Phaser.GameObjects.Container {
// //   private isMyTurn = false;
// //   public hitPoints = 1000;
// //   private skills: EnemySkill[] = [];
// //   public currentSkill: EnemySkill | null = null;
// //   constructor(
// //     scene: Phaser.Scene,
// //     private readonly bus: EventBus<GameEventMap>,
// //     x: number,
// //     y: number,
// //   ) {
// //     super(scene, x, y);
// //     this.bus.on("ENEMY_TURN_STARTED", this.onTurnStarted);
// //     // this.bus.on("PLAYER_TURN_RESOLVED", (payload) =>
// //     //   this.bus.emit("UPDATE_ENEMY", { enemy: this }),
// //     // );
// //     this.bus.on("SCORE_ADDED", (payload) => this.takeDamage(payload.amount));
// //     this.initSkills();
// //   }
// //   private initSkills() {
// //     skillsData.forEach((skill) => {
// //       const newSkill = new EnemySkill(
// //         skill.value,
// //         skill.timeout,
// //         skill.name,
// //         skill.turnsToCast,
// //       );
// //       this.skills.push(newSkill);
// //     });
// //   }
// //   private onTurnStarted = () => {
// //     this.bus.emit("UPDATE_ENEMY", { enemy: this });
// //     this.isMyTurn = true;

// //     // 1) actualizar cooldowns solo de skills no activos
// //     this.skills.forEach((s) => {
// //       if (!s.active) s.updateCooldown();
// //     });

// //     // 2) si hay skill en cast, intentar castearlo
// //     if (this.currentSkill) {
// //       const result = this.currentSkill.tryCast();

// //       if (result.status) {
// //         this.bus.emit("ENEMY_SKILL_USED", {
// //           skill: this.currentSkill,
// //         });

// //         this.currentSkill.enterCooldown(); // pasa a cooldown
// //         this.currentSkill = null; // deja de castearlo
// //       }
// //     }

// //     // 3) si no hay skill, asignar uno listo
// //     if (!this.currentSkill) {
// //       this.assignNewSkill();
// //     }

// //     this.scene.time.delayedCall(0, () => {
// //       this.bus.emit("ENEMY_TURN_RESOLVED", { enemy: this });
// //     });
// //     //this.bus.emit("ENEMY_TURN_RESOLVED", { enemy: this });
// //     console.log("ENEMY TURN RESOLVED");
// //     this.isMyTurn = false;
// //   };
// //   // private onTurnStarted = async () => {
// //   //   this.isMyTurn = true;
// //   //   //si esta casteando
// //   //   //  si -> reducir el timer del skill
// //   //   //  no -> buscar un skill en el array de skills y castearlo
// //   //   this.skills.forEach((s) => s.update());
// //   //   console.log("this", this.currentSkill);
// //   //   if (this.currentSkill) {
// //   //     const skillCast = this.currentSkill.tryCast();
// //   //     if (skillCast.status) {
// //   //       console.log("SKILL USED");
// //   //       this.bus.emit("ENEMY_SKILL_USED", {
// //   //         skill: this.currentSkill as EnemySkill,
// //   //       });
// //   //       this.currentSkill = null;
// //   //     }
// //   //   } else {
// //   //     console.log("NEW SKILL");
// //   //     this.assignNewSkill();
// //   //   }
// //   //   this.bus.emit("ENEMY_TURN_RESOLVED", { enemy: this });
// //   //   this.isMyTurn = false;
// //   // };

// //   private assignNewSkill() {
// //     const pool = this.skills.filter((s) => s.active);
// //     if (pool.length) {
// //       const rnd = Math.floor(Math.random() * pool.length);
// //       this.currentSkill = pool[rnd];
// //     }
// //   }
// //   destroy() {
// //     this.bus.off("ENEMY_TURN_STARTED", this.onTurnStarted);
// //   }
// //   public takeDamage(damage: number) {
// //     if (this.currentSkill) {
// //       const skillValue = this.currentSkill.getValue();
// //       if (skillValue > 0) {
// //         const absorbed = Math.min(damage, skillValue);
// //         this.currentSkill.setValue(skillValue - absorbed);
// //         damage -= absorbed;
// //       }
// //     }
// //     if (damage > 0) {
// //       this.hitPoints = Math.max(0, this.hitPoints - damage);
// //     }
// //     this.bus.emit("ENEMY_DAMAGED", { enemy: this, damage: damage });
// //     this.bus.emit("UPDATE_ENEMY", { enemy: this });
// //   }
// // }

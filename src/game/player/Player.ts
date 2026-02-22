// import { EventBus } from "../core/EventBus";
// import { GameEventMap } from "../events/GameEventMap";
import { EventBus } from "../core/EventBus";
import { GameEventMap } from "../events/GameEventMap";

export class Player extends Phaser.GameObjects.Container {
  private isMyTurn = false;
  public hitPoints = 1000;

  // control determinista por turno
  private currentTurn = 0;
  private resolvedTurn = -1;

  constructor(
    scene: Phaser.Scene,
    private readonly bus: EventBus<GameEventMap>,
    x: number,
    y: number,
  ) {
    super(scene, x, y);

    // número de turno global
    this.bus.on("TURN_STARTED", (payload) => {
      this.currentTurn = payload.turn;
    });

    this.bus.on("PLAYER_TURN_STARTED", this.onTurnStarted);

    // eventos que pueden cerrar la acción del jugador
    this.bus.on("SCORE_ADDED", (payload) => this.resolveAction(payload.amount));
    this.bus.on("LINE_NOT_COMPLETED", () => this.resolveAction(0));

    this.bus.on("ENEMY_SKILL_USED", (payload) =>
      this.takeDamage(payload.skill.currentValue),
    );
  }

  private onTurnStarted = () => {
    this.bus.emit("UPDATE_PLAYER", { player: this });
    this.isMyTurn = true;
  };

  private resolveAction(score: number) {
    console.log(
      "resolve check",
      this.isMyTurn,
      this.currentTurn,
      this.resolvedTurn,
    );

    if (!this.isMyTurn) return;

    // ya resolvió este turno
    if (this.resolvedTurn === this.currentTurn) return;

    this.resolvedTurn = this.currentTurn;
    this.isMyTurn = false;

    this.bus.emit("PLAYER_TURN_RESOLVED", { player: this });
  }

  public takeDamage(damage: number) {
    if (damage <= 0) return;
    this.hitPoints = Math.max(0, this.hitPoints - damage);
    this.bus.emit("PLAYER_DAMAGED", {
      hitPoints: this.hitPoints,
      damage: damage,
    });
  }

  destroy() {
    this.bus.off("PLAYER_TURN_STARTED", this.onTurnStarted);
  }
}
// export class Player extends Phaser.GameObjects.Container {
//   private isMyTurn = false;
//   private resolvedThisTurn = false;
//   private hitPoints = 1000;

//   constructor(
//     scene: Phaser.Scene,
//     private readonly bus: EventBus<GameEventMap>,
//     x: number,
//     y: number,
//   ) {
//     super(scene, x, y);

//     this.bus.on("PLAYER_TURN_STARTED", this.onTurnStarted);

//     //Si hay score (puede venir más de una vez), resolver solo una vez
//     this.bus.on("SCORE_ADDED", (payload) => this.resolveAction(payload.amount));

//     // Si no hubo líneas, resolver con 0, pero también solo una vez
//     this.bus.on("LINE_NOT_COMPLETED", () => this.resolveAction(0));

//     this.bus.on("ENEMY_SKILL_USED", (payload) =>
//       this.takeDamage(payload.skill.currentValue),
//     );
//   }

//   private onTurnStarted = () => {
//     console.log("PLAYER TURN ACTIVATED");
//     this.isMyTurn = true;
//     this.resolvedThisTurn = false;
//   };

//   private resolveAction(score: number) {
//     console.log("1", this.isMyTurn, this.resolvedThisTurn);
//     if (!this.isMyTurn || this.resolvedThisTurn) return;
//     this.resolvedThisTurn = true;
//     this.bus.emit("PLAYER_TURN_RESOLVED", { player: this });
//     this.isMyTurn = false;
//   }

//   public takeDamage(damage: number) {
//     if (damage <= 0) return;
//     this.hitPoints = Math.max(0, this.hitPoints - damage);
//     this.bus.emit("PLAYER_DAMAGED", {
//       hitPoints: this.hitPoints,
//       damage: damage,
//     });
//   }

//   destroy() {
//     this.bus.off("PLAYER_TURN_STARTED", this.onTurnStarted);
//   }
// }

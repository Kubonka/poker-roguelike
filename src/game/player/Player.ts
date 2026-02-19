import { EventBus } from "../core/EventBus";
import { GameEventMap } from "../events/GameEventMap";

export class Player {
  private isMyTurn = false;
  private hitPoints = 1000;

  constructor(private readonly bus: EventBus<GameEventMap>) {
    this.bus.on("PLAYER_TURN_STARTED", this.onTurnStarted);
    this.bus.on("SCORE_ADDED", (payload) => this.resolveAction(payload.amount));
    this.bus.on("LINE_NOT_COMPLETED", () =>
      this.bus.emit("PLAYER_TURN_RESOLVED", { score: 0 }),
    );
  }

  private onTurnStarted = () => {
    this.isMyTurn = true;
  };

  private resolveAction(score: number) {
    if (!this.isMyTurn) return;
    this.bus.emit("PLAYER_TURN_RESOLVED", { score });
    this.isMyTurn = false;
  }

  public takeDamage(damage: number) {
    this.hitPoints = Math.max(0, this.hitPoints - damage);
    this.bus.emit("PLAYER_DAMAGED", {
      hitPoints: this.hitPoints,
      damage: damage,
    });
  }

  destroy() {
    this.bus.off("PLAYER_TURN_STARTED", this.onTurnStarted);
  }
  //* -----------------------------
}

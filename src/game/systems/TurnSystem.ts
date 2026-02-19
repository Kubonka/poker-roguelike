import { EventBus } from "../core/EventBus";
import { GameEventMap } from "../events/GameEventMap";

export class TurnSystem {
  private turn = 1;
  private state: TurnState = "TURN_START";

  constructor(private readonly bus: EventBus<GameEventMap>) {
    this.registerEvents();
    this.startFirstTurn();
  }

  private registerEvents() {
    // Cuando el jugador termina su acción (ej: después de score)
    this.bus.on("PLAYER_TURN_RESOLVED", () => {
      if (this.state === "PLAYER_TURN") {
        this.changeState("ENEMY_TURN");
      }
    });

    // Cuando termina el enemigo
    this.bus.on("ENEMY_TURN_RESOLVED", () => {
      if (this.state === "ENEMY_TURN") {
        this.changeState("TURN_END");
        this.endTurn();
      }
    });
  }

  private startFirstTurn() {
    //this.bus.emit("PLAYER_TURN", { turn: this.turn });
    this.enterPlayerPhase();
  }

  private enterPlayerPhase() {
    this.changeState("PLAYER_TURN");
    this.bus.emit("PLAYER_TURN_STARTED", undefined);
  }

  private enterEnemyPhase() {
    this.changeState("ENEMY_TURN");
    this.bus.emit("ENEMY_TURN_STARTED", undefined);
  }

  private endTurn() {
    this.bus.emit("TURN_ENDED", { turn: this.turn });

    this.turn++;
    this.bus.emit("TURN_STARTED", { turn: this.turn });

    this.enterPlayerPhase();
  }

  private changeState(newState: TurnState) {
    this.state = newState;
    this.bus.emit("TURN_STATE_CHANGED", { state: newState });
  }

  public getTurn() {
    return this.turn;
  }

  public getState() {
    return this.state;
  }
}

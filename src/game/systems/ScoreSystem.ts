import { EventBus } from "../core/EventBus";
import { GameEventMap } from "../events/GameEventMap";
import { SCORE_TABLE } from "../core/ScoreTable";
import { TurnSystem } from "./TurnSystem";

export class ScoreSystem {
  constructor(
    private bus: EventBus<GameEventMap>,
    private turn: TurnSystem,
  ) {
    bus.on("LINE_COMPLETED", ({ rank }) => {
      const base = SCORE_TABLE[rank];
      const mult = this.turn.getComboMultiplier();
      const amount = Math.floor(base * mult);

      this.totalScore += amount;

      bus.emit("SCORE_ADDED", {
        amount,
        total: this.totalScore,
        source: rank,
      });
    });
  }

  getTotal(): number {
    return this.totalScore;
  }

  reset(): void {
    this.totalScore = 0;
  }
}

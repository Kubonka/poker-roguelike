import { EventBus } from "../core/EventBus";
import { GameEventMap } from "../events/GameEventMap";
import { SCORE_TABLE } from "../core/weightsAndScores";
import { Board } from "../board/Board";

export class ScoreSystem {
  private totalScore = 0;
  private comboMultiplier: number = 1;
  constructor(
    private bus: EventBus<GameEventMap>,
    private board: Board,
  ) {
    bus.on("LINE_COMPLETED", (payload) => {
      this.calculateLineScore(payload.rank, payload.index, payload.lineType);
      this.comboMultiplier += 0.5;
      bus.emit("COMBO_CHANGED", { comboMultiplier: this.comboMultiplier });
    });
    bus.on("LINE_NOT_COMPLETED", () => {
      this.comboMultiplier = 1;
      bus.emit("COMBO_CHANGED", { comboMultiplier: this.comboMultiplier });
    });
  }

  getTotal(): number {
    return this.totalScore;
  }

  reset(): void {
    this.totalScore = 0;
  }
  private calculateLineScore(
    rank: PokerRank,
    index: number,
    lineType: LineType,
  ) {
    const base = SCORE_TABLE[rank];
    const lineModifier = this.board.getLineModifier(lineType, index);
    let mult = lineModifier?.multiplier as number;
    if (lineModifier?.rank !== rank) mult = 1;
    const amount = Math.floor(base * this.comboMultiplier * mult);
    this.totalScore += amount;
    this.bus.emit("SCORE_ADDED", {
      amount,
      total: this.totalScore,
      source: rank,
    });
    if (lineModifier) this.bus.emit("REMOVE_LINE_MODIFIER", { lineModifier });
  }
}

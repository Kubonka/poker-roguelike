import { Board } from "../board/Board";
import { Card } from "../cards/Card";
import { EventBus } from "../core/EventBus";
import { PokerHandEvaluator } from "../core/PokerHandEvaluator";
import { GameEventMap } from "../events/GameEventMap";

export class ValidationSystem {
  constructor(
    private readonly bus: EventBus<GameEventMap>,
    private readonly board: Board,
  ) {
    this.bus.on("CARD_PLACED", ({ row, col }) => this.checkLine(row, col));
  }
  // static canPlace(): boolean {
  //   return Cell.isEmpty();
  // }
  public checkLine(row: number, col: number) {
    const rowCards: Card[] = this.board
      .getRow(row)
      .map((c) => c.card) as Card[];

    const colCards: Card[] = this.board
      .getCol(col)
      .map((c) => c.card) as Card[];

    let lineCompleted = false;
    if (rowCards.length === 5) {
      const resultRow = this.solvePokerHand(rowCards);

      this.bus.emit("LINE_COMPLETED", {
        lineType: "row",
        index: row,
        rank: resultRow,
      });

      if (resultRow !== "high_card") lineCompleted = true;
    }
    if (colCards.length === 5) {
      const resultCol = this.solvePokerHand(colCards);

      this.bus.emit("LINE_COMPLETED", {
        lineType: "col",
        index: col,
        rank: resultCol,
      });

      if (resultCol !== "high_card") lineCompleted = true;
    }
    if (!lineCompleted) this.bus.emit("LINE_NOT_COMPLETED", undefined);
  }

  private solvePokerHand(cards: Card[]): PokerRank {
    //*royal flush
    //*poker
    //*fullhouse
    //*flush
    //*straight
    //*three of a kind
    //*two Pair
    //*one Pair
    if (PokerHandEvaluator.isStraightFlush(cards)) return "straight_flush";
    if (PokerHandEvaluator.isFourOfKind(cards)) return "four_kind";
    if (PokerHandEvaluator.isFullHouse(cards)) return "full_house";
    if (PokerHandEvaluator.isFlush(cards)) return "flush";
    if (PokerHandEvaluator.isStraight(cards)) return "straight";
    if (PokerHandEvaluator.isThreeOfAKind(cards)) return "three_kind";
    if (PokerHandEvaluator.isTwoPair(cards)) return "two_pair";
    if (PokerHandEvaluator.isOnePair(cards)) return "one_pair";
    return "high_card";
  }
}

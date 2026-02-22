import type { EventBus } from "../core/EventBus";
import type { GameEventMap } from "../events/GameEventMap";
import { Board } from "../board/Board";
import { Card } from "../cards/Card";
import { ValidationSystem } from "./ValidationSystem";
import { Cell } from "../board/Cell";
import { Deck } from "../cards/Deck";
import { TurnSystem } from "./TurnSystem";

export class PlacementSystem {
  constructor(
    private readonly bus: EventBus<GameEventMap>,
    private readonly board: Board,
    private readonly deck: Deck,
    private readonly turnSystem: TurnSystem,
  ) {
    this.bus.on("CELL_CLICKED", this.onCellClicked);
  }
  // public setCurrentCard(card: Card) {
  //   this.currentCard = card;
  // }
  private onCellClicked = (payload: { cell: Cell }) => {
    console.log("3", this.turnSystem.getState());
    if (this.turnSystem.getState() !== "PLAYER_TURN") return;
    const cell = payload.cell;
    const card = this.deck.currentCard;
    if (!card) return;
    if (!cell.card) {
      this.board.placeCard(card, cell);
      this.bus.emit("CARD_PLACED", {
        row: cell.getRow(),
        col: cell.getCol(),
        card,
      });
      return;
    }
  };
}

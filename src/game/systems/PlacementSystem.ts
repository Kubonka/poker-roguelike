import type { EventBus } from "../core/EventBus";
import type { GameEventMap } from "../events/GameEventMap";
import { Board } from "../board/Board";
import { Card } from "../cards/Card";
import { ValidationSystem } from "./ValidationSystem";

export class PlacementSystem {
  constructor(
    private readonly bus: EventBus<GameEventMap>,
    private readonly board: Board,
  ) {
    this.bus.on("CELL_CLICKED", this.onCellClicked);
  }

  private onCellClicked = (payload: { row: number; col: number }) => {
    if (!ValidationSystem.canPlace(this.board, payload.row, payload.col)) {
      return;
    }
    this.bus.emit("PLACE_CARD", {
      row: payload.row,
      col: payload.col,
    });
  };
}

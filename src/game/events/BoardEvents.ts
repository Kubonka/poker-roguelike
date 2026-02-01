import { Cell } from "../board/Cell";

export interface BoardEvents {
  CELL_CLICKED: {
    cell: Cell;
  };
  LINE_COMPLETED: {
    lineType: "row" | "col";
    index: number;
    rank: PokerRank;
  };
}

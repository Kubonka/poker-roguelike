import { Cell } from "../board/Cell";
import { LineModifier } from "../board/LineModifier";

export interface BoardEvents {
  CELL_CLICKED: {
    cell: Cell;
  };
  LINE_COMPLETED: {
    lineType: LineType;
    index: number;
    rank: PokerRank;
  };
  LINE_NOT_COMPLETED: undefined;
  REMOVE_LINE_MODIFIER: { lineModifier: LineModifier };
}

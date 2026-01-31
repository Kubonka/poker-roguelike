export interface BoardEvents {
  CELL_CLICKED: {
    row: number;
    col: number;
  };

  LINE_COMPLETED: {
    lineType: "row" | "col";
    index: number;
    rank: PokerRank;
  };

  LINE_BLOCKED: {
    lineType: "row" | "col";
    index: number;
  };
}

import { Card } from "../cards/Card";

export interface BoardCommands {
  PLACE_CARD: {
    row: number;
    col: number;
    card: Card;
  };
  DRAW_CARD: void;
}

import { Card } from "../cards/Card";

export interface CardEvents {
  CARD_DRAWN: { card: Card };
  CARD_PLACED: { row: number; col: number; card: Card };
  CARD_REMOVED: { card: Card };
}

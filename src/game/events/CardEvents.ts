export interface CardEvents {
  CARD_DRAWN: { cardId: number };
  CARD_PLACED: { cardId: number; row: number; col: number };
  CARD_CURSED: { cardId: string; turns: number };
  DECK_RESHUFFLED: void;
}

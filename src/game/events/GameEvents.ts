export interface GameEvents {
  SCORE_ADDED: {
    amount: number;
    total: number;
    source: PokerRank;
  };
  GAME_OVER: {
    reason: "no_moves" | "blocked_board" | "deck_empty";
  };
  DECK_RESHUFFLED: void;
  TEST_COMPLETE: undefined;
  TURN_END: undefined;
}

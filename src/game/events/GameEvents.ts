export interface GameEvents {
  SCORE_ADDED: {
    amount: number;
    total: number;
    source: PokerRank;
  };
  GAME_OVER: {
    reason: "no_moves" | "blocked_board" | "deck_empty";
  };
}

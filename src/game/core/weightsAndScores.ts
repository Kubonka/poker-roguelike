export const SCORE_TABLE: Record<PokerRank, number> = {
  high_card: 0,
  one_pair: 8,
  two_pair: 18,
  three_kind: 35,
  straight: 55,
  flush: 28,
  full_house: 80,
  four_kind: 120,
  straight_flush: 170,
};
export const POKER_RANK_WEIGHTS: Record<
  Exclude<PokerRank, "high_card">,
  number
> = {
  one_pair: 38,
  two_pair: 24,
  three_kind: 16,
  flush: 14,
  straight: 10,
  full_house: 5,
  four_kind: 2,
  straight_flush: 1,
};

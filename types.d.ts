type BoardCoord = { row: number; col: number };
type Coord = { x: number; y: number };
type CardValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;
type CardSuit = "diamonds" | "hearts" | "clubs" | "spades";
type PokerRank =
  | "straight_flush"
  | "four_kind"
  | "full_house"
  | "flush"
  | "straight"
  | "three_kind"
  | "two_pair"
  | "one_pair"
  | "high_card";
type ModifierSign = "bonus" | "penalty";
type LineType = "row" | "col";
interface HandModifier {
  rank: PokerRank; // straight
  sign: ModifierSign; // bonus | penalty
  multiplier: number; // ej: 1.5 o 0.7
}

type TurnState = "TURN_START" | "PLAYER_TURN" | "ENEMY_TURN" | "TURN_END";

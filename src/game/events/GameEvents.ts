import { EnemySkill } from "../enemy/EnemySkill";

export interface GameEvents {
  COMBO_CHANGED: {
    comboMultiplier: number;
  };

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

  TURN_STARTED: { turn: number };
  TURN_STATE_CHANGED: { state: TurnState };
  PLAYER_TURN_STARTED: void;
  ENEMY_TURN_STARTED: void;
  TURN_ENDED: { turn: number };
  PLAYER_TURN_RESOLVED: { score: number };
  ENEMY_TURN_RESOLVED: void;

  PLAYER_DAMAGED: { hitPoints: number; damage: number };
  ENEMY_DAMAGED: { hitPoints: number; damage: number };
  ENEMY_SKILL_USED: { skill: EnemySkill };
}

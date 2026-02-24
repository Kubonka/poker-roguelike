import { Enemy } from "../enemy/Enemy";
import { EnemySkill } from "../enemy/EnemySkill";
import { Player } from "../player/Player";

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
  PLAYER_TURN_RESOLVED: { player: Player };
  ENEMY_TURN_RESOLVED: { enemy: Enemy };

  PLAYER_DAMAGED: { hitPoints: number; damage: number };
  ENEMY_DAMAGED: { enemy: Enemy; damage: number };
  ENEMY_DEAD: void;
  ENEMY_SKILL_USED: { skill: EnemySkill };
}

import { Enemy } from "../enemy/Enemy";
import { Player } from "../player/Player";

export interface HudCommands {
  UPDATE_ENEMY: { enemy: Enemy };
  UPDATE_PLAYER: { player: Player };
}

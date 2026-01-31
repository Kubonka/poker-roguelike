import type { CardEvents } from "./CardEvents";
import type { BoardEvents } from "./BoardEvents";
import type { GameEvents } from "./GameEvents";
import type { BoardCommands } from "./BoardCommands";

export interface GameEventMap
  extends CardEvents, BoardEvents, GameEvents, BoardCommands {}

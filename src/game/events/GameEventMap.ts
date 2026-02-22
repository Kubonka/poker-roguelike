import type { CardEvents } from "./CardEvents";
import type { BoardEvents } from "./BoardEvents";
import type { GameEvents } from "./GameEvents";
import type { BoardCommands } from "./BoardCommands";
import { HudCommands } from "./HudCommands";

export interface GameEventMap
  extends CardEvents, BoardEvents, GameEvents, BoardCommands, HudCommands {}

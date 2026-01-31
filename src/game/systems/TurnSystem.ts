import { EventBus } from "../core/EventBus";
import { GameEventMap } from "../events/GameEventMap";

export class TurnSystem {
  private comboCount = 0;
  private inTurn = false;

  constructor(private bus: EventBus<GameEventMap>) {
    bus.on("CARD_PLACED", () => {
      this.comboCount = 0;
      this.inTurn = true;
    });

    bus.on("LINE_COMPLETED", () => {
      this.comboCount++;
    });

    bus.on("TURN_END", () => {
      this.comboCount = 0;
      this.inTurn = false;
    });
  }

  getComboMultiplier(): number {
    return 1 + this.comboCount * 0.5;
  }
}

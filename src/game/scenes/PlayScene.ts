import { Board } from "../board/Board";
import { Deck } from "../cards/Deck";
import { EventBus } from "../core/EventBus";
import { GameEventMap } from "../events/GameEventMap";
import { PlacementSystem } from "../systems/PlacementSystem";
import { ScoreSystem } from "../systems/ScoreSystem";
import { ValidationSystem } from "../systems/ValidationSystem";

export class PlayScene extends Phaser.Scene {
  private board!: Board;
  private deck!: Deck;
  private placementSystem!: PlacementSystem;
  private validationSystem!: ValidationSystem;
  private scoreSystem!: ScoreSystem;

  constructor(private bus: EventBus<GameEventMap>) {
    super("PlayScene");
  }

  create() {
    this.bus.on("SCORE_ADDED", ({ amount, total, source }) => {
      console.log(`+${amount} (${source}) → total: ${total}`);
    });
    const initialX = 400;
    const initialY = 30;

    this.deck = new Deck(this, this.bus, 0, 0);
    this.board = new Board(this, this.bus, initialX, initialY, 5, 5, this.deck);

    this.placementSystem = new PlacementSystem(this.bus, this.board);
    this.validationSystem = new ValidationSystem(this.bus, this.board);
    this.scoreSystem = new ScoreSystem(this.bus);

    this.bus.on("LINE_COMPLETED", this.handleLineCompleted);
  }

  shutdown() {
    this.bus.off("LINE_COMPLETED", this.handleLineCompleted);
  }

  private handleLineCompleted = (payload: GameEventMap["LINE_COMPLETED"]) => {
    const { lineType, index, rank } = payload;
    //! ACA VA DE TODO
    if (rank === "high_card") return;

    this.board.clearLine(lineType, index);
    console.log("rank ", rank);
  };
}

import { Board } from "../board/Board";
import { Card } from "../cards/Card";
import { Deck } from "../cards/Deck";
import { EventBus } from "../core/EventBus";
import { GameEventMap } from "../events/GameEventMap";
import { PlacementSystem } from "../systems/PlacementSystem";
import { ScoreSystem } from "../systems/ScoreSystem";
import { TestScoresSystem } from "../systems/TestScoresSystem";
import { ValidationSystem } from "../systems/ValidationSystem";
import { UiLayer } from "../ui/UiLayer";

export class PlayScene extends Phaser.Scene {
  private bus!: EventBus<GameEventMap>;
  private board!: Board;
  private deck!: Deck;
  private currentCard: Card | null = null;
  private placementSystem!: PlacementSystem;
  private validationSystem!: ValidationSystem;
  private scoreSystem!: ScoreSystem;
  private testSystem!: TestScoresSystem;

  constructor() {
    super("PlayScene");
  }
  // constructor() {
  //   super("PlayScene");
  //   //this.bus.on("CARD_DRAWN", (payload) => (this.currentCard = payload.card));
  //   this.bus.on("CARD_PLACED", () => {
  //     this.deck.draw();
  //   });
  //   this.bus.on("LINE_COMPLETED", this.handleLineCompleted);
  //   this.bus.on("SCORE_ADDED", ({ amount, total, source }) => {
  //     console.log(`+${amount} (${source}) → total: ${total}`);
  //   });
  //   //!test
  //   this.bus.on("TEST_COMPLETE", () => this.scene.restart());

  //   //*
  // }

  create() {
    const initialX = 400;
    const initialY = 30;

    this.deck = new Deck(this, this.bus, -50, -50);
    this.board = new Board(this, this.bus, initialX, initialY, 5, 5, this.deck);

    this.placementSystem = new PlacementSystem(this.bus, this.board, this.deck);
    this.validationSystem = new ValidationSystem(this.bus, this.board);

    new UiLayer(this, this.bus);

    this.testSystem = new TestScoresSystem(this.bus);
    this.testSystem.initStorage();

    this.deck.draw();
  }
  // create() {
  //   const initialX = 400;
  //   const initialY = 30;

  //   this.deck = new Deck(this, this.bus, -50, -50);
  //   console.log("ENTRA");
  //   this.board = new Board(this, this.bus, initialX, initialY, 5, 5, this.deck);
  //   this.placementSystem = new PlacementSystem(this.bus, this.board, this.deck);
  //   this.validationSystem = new ValidationSystem(this.bus, this.board);
  //   //this.scoreSystem = new ScoreSystem(this.bus,); //todo seguir por aca
  //   new UiLayer(this, this.bus);
  //   //!TEST
  //   this.testSystem = new TestScoresSystem(this.bus);
  //   this.testSystem.initStorage();
  //   this.deck.draw();
  // }

  shutdown() {
    this.bus.off("LINE_COMPLETED", this.handleLineCompleted);
  }

  init(data: { bus: EventBus<GameEventMap> }) {
    this.bus = data.bus;

    this.bus.on("CARD_PLACED", () => {
      this.deck.draw();
    });

    this.bus.on("LINE_COMPLETED", this.handleLineCompleted);

    this.bus.on("SCORE_ADDED", ({ amount, total, source }) => {
      console.log(`+${amount} (${source}) → total: ${total}`);
    });

    this.bus.on("TEST_COMPLETE", () => this.scene.restart());
  }
  private handleLineCompleted = (payload: GameEventMap["LINE_COMPLETED"]) => {
    const { lineType, index, rank } = payload;
    //! ACA VA DE TODO
    if (rank === "high_card") return;

    this.board.clearLine(lineType, index);
    //! test
    this.testSystem.addMatch(rank);
    this.testSystem.consumeHand();
    console.log("rank ", rank);
  };
}

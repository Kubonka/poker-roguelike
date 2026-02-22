import { Board } from "../board/Board";
import { Card } from "../cards/Card";
import { Deck } from "../cards/Deck";
import { EventBus } from "../core/EventBus";
import { ScoreTableSim } from "../core/ScoreStrategySim";
import { Enemy } from "../enemy/Enemy";
import { GameEventMap } from "../events/GameEventMap";
import { Player } from "../player/Player";
import { PlacementSystem } from "../systems/PlacementSystem";
import { ScoreSystem } from "../systems/ScoreSystem";
import { TestScoresSystem } from "../systems/TestScoresSystem";
import { TurnSystem } from "../systems/TurnSystem";
import { ValidationSystem } from "../systems/ValidationSystem";
import { UiLayer } from "../ui/UiLayer";
import {
  BOARD_LAYOUT,
  BoardLayoutConfig,
} from "../ui/layout/BoardLayoutConfig";

export class PlayScene extends Phaser.Scene {
  private bus!: EventBus<GameEventMap>;
  private board!: Board;
  private deck!: Deck;
  private currentCard: Card | null = null;
  private placementSystem!: PlacementSystem;
  private validationSystem!: ValidationSystem;
  private scoreSystem!: ScoreSystem;
  private turnSystem!: TurnSystem;
  private testSystem!: TestScoresSystem;
  private player!: Player;
  private enemy!: Enemy;
  constructor() {
    super("PlayScene");
  }

  create() {
    this.bus.on("TEST_COMPLETE", () => this.scene.restart());
    const initialX = 500;
    const initialY = 120;
    this.deck = new Deck(this, this.bus, -150, -150);
    this.board = new Board(
      this,
      this.bus,
      initialX,
      initialY,
      5,
      5,
      BOARD_LAYOUT,
      this.deck,
    );
    this.validationSystem = new ValidationSystem(this.bus, this.board);
    this.scoreSystem = new ScoreSystem(this.bus, this.board);
    this.player = new Player(this, this.bus, 0, 300);
    this.enemy = new Enemy(this, this.bus, 900, 300);
    this.turnSystem = new TurnSystem(this.bus);
    this.placementSystem = new PlacementSystem(
      this.bus,
      this.board,
      this.deck,
      this.turnSystem,
    );
    new UiLayer(this, this.bus);
    this.time.delayedCall(0, () => {
      this.board.setUpBoard();
    });
    this.deck.draw();
    this.bus.emit("UPDATE_PLAYER", { player: this.player });
    this.bus.emit("ENEMY_DAMAGED", { enemy: this.enemy, damage: 0 });
    this.bus.emit("UPDATE_ENEMY", { enemy: this.enemy });
    //*BEGIN

    //! TEST
    this.testSystem = new TestScoresSystem(this.bus);
    this.testSystem.initStorage();
    const sim = new ScoreTableSim();
    //sim.printReport();
  }

  shutdown() {
    this.bus.off("LINE_COMPLETED", this.handleLineCompleted);
  }

  init(data: { bus: EventBus<GameEventMap> }) {
    this.bus = data.bus;

    this.bus.on("CARD_PLACED", () => {
      this.deck.draw();
    });

    this.bus.on("LINE_COMPLETED", this.handleLineCompleted);

    // this.bus.on("SCORE_ADDED", ({ amount, total, source }) => {
    //   console.log(`+${amount} (${source}) → total: ${total}`);
    // });

    this.bus.on("TEST_COMPLETE", () => this.scene.restart());
  }
  private handleLineCompleted = (payload: GameEventMap["LINE_COMPLETED"]) => {
    const { lineType, index, rank } = payload;
    //! ACA VA DE TODO
    if (rank === "high_card") {
      //this.bus.emit("", undefined);
      return;
    }
    this.board.clearLine(lineType, index);
    //! test
    //this.testSystem.addMatch(rank);
    //this.testSystem.consumeHand();
    //console.log("rank ", rank);
  };
}

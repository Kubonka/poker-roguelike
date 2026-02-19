import { Card } from "../cards/Card";
import { EventBus } from "../core/EventBus";
import { GameEventMap } from "../events/GameEventMap";
import { BoardLayoutConfig } from "../ui/layout/BoardLayoutConfig";

export class Cell extends Phaser.GameObjects.Container {
  card: Card | null = null;
  private row: number = -1;
  private col: number = -1;
  bgSprite;
  constructor(
    scene: Phaser.Scene,
    private bus: EventBus<GameEventMap>,
    row: number,
    col: number,
    private layout: BoardLayoutConfig,
  ) {
    super(scene, 0, 0);
    scene.add.existing(this);

    this.row = row;
    this.col = col;

    this.bgSprite = scene.add.sprite(0, 0, "card-bg");
    this.bgSprite.setOrigin(0);
    this.bgSprite.setDisplaySize(layout.cellWidth, layout.cellHeight);
    this.bgSprite.setTint(0x777777);

    this.bgSprite.setInteractive();
    this.bgSprite.on("pointerdown", () =>
      bus.emit("CELL_CLICKED", { cell: this }),
    );

    this.add(this.bgSprite);
  }

  removeCard() {
    if (!this.card) return;
    //this.card.destroy();
    this.bus.emit("CARD_REMOVED", { card: this.card });
    this.card = null;
  }

  isEmpty(): boolean {
    return this.card === null;
  }
  getCenterWorldPosition(): { x: number; y: number } {
    const bounds = this.getBounds();
    return {
      x: bounds.centerX,
      y: bounds.centerY,
    };
  }
  setCard(card: Card) {
    this.card = card;
  }
  public getRow(): number {
    return this.row;
  }
  public getCol(): number {
    return this.col;
  }
}

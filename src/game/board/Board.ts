import { Cell } from "./Cell";
import { Card } from "../cards/Card";
import { EventBus } from "../core/EventBus";
import { GameEventMap } from "../events/GameEventMap";
import { Deck } from "../cards/Deck";

export class Board extends Phaser.GameObjects.Container {
  private cells: Cell[][];
  private deck!: Deck;
  constructor(
    scene: Phaser.Scene,
    private bus: EventBus<GameEventMap>,
    x: number,
    y: number,
    public readonly rows: number,
    public readonly cols: number,
    deck: Deck,
  ) {
    super(scene, x, y);
    scene.add.existing(this);
    this.deck = deck;
    this.bus.on("PLACE_CARD", ({ row, col }) => {
      this.placeCard(row, col);
    });

    this.cells = Array.from({ length: rows }, (_, row) =>
      Array.from({ length: cols }, (_, col) => {
        console.log(row, col);
        const cell = new Cell(scene, bus, row, col, col * 140, row * 175);
        this.add(cell);
        return cell;
      }),
    );
  }

  getCell(row: number, col: number): Cell {
    return this.cells[row][col];
  }

  public clearLine(type: "row" | "col", index: number) {
    const cells = type === "row" ? this.getRow(index) : this.getCol(index);

    for (const cell of cells) {
      cell.removeCard();
    }
  }
  private placeCard(row: number, col: number): void {
    const xOffset = -49;
    const yOffset = -70;
    const card = this.deck.draw();
    if (!card) return;

    const cell = this.cells[row][col];
    cell.card = card;
    this.add(card);

    const bounds = cell.getBounds();
    const worldX = bounds.centerX;
    const worldY = bounds.centerY;
    const localX = worldX - this.x;
    const localY = worldY - this.y;

    card.setPosition(localX + xOffset, localY + yOffset);
    this.bringToTop(card);
    this.bus.emit("CARD_PLACED", { cardId: card.cardId, row, col });
    console.log(
      "NEXT CARD : ",
      this.deck.drawPile[this.deck.drawPile.length - 1].value,
    );
  }
  public getRow(row: number): Cell[] {
    const newArr: Cell[] = [];
    for (let j = 0; j < this.cells.length; j++) {
      const cell = this.cells[row][j];
      if (cell.card !== null) {
        newArr.push(cell);
      }
    }
    return newArr;
  }
  public getCol(col: number): Cell[] {
    const newArr: Cell[] = [];
    for (let i = 0; i < this.cells[0].length; i++) {
      const cell = this.cells[i][col];
      if (cell.card !== null) {
        newArr.push(cell);
      }
    }
    return newArr;
  }
}

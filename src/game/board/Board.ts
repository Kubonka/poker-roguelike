import { Cell } from "./Cell";
import { Card } from "../cards/Card";
import { EventBus } from "../core/EventBus";
import { GameEventMap } from "../events/GameEventMap";
import { Deck } from "../cards/Deck";
import { LineModifier } from "./LineModifier";
import { BoardLayoutConfig } from "../ui/layout/BoardLayoutConfig";
import { POKER_RANK_WEIGHTS } from "../core/weightsAndScores";

type LineKey = `${LineType}:${number}`;
export class Board extends Phaser.GameObjects.Container {
  private cells: Cell[][] = [];
  private deck!: Deck;
  private lineModifiers = new Map<string, LineModifier>();
  constructor(
    scene: Phaser.Scene,
    private bus: EventBus<GameEventMap>,
    x: number,
    y: number,
    public readonly rows: number,
    public readonly cols: number,
    private layout: BoardLayoutConfig,
    deck: Deck,
  ) {
    super(scene, x, y);
    scene.add.existing(this);
    this.deck = deck;
    this.createGrid();
    this.initLineModifiers();
    this.bus.on("REMOVE_LINE_MODIFIER", (payload) =>
      this.removeLineModifier(payload.lineModifier),
    );
  }
  private createGrid() {
    for (let row = 0; row < this.rows; row++) {
      this.cells[row] = [];
      for (let col = 0; col < this.cols; col++) {
        const x = col * (this.layout.cellWidth + this.layout.spacingX);
        const y = row * (this.layout.cellHeight + this.layout.spacingY);
        const cell = new Cell(this.scene, this.bus, row, col, this.layout);
        this.add(cell);
        cell.setPosition(x, y);
        this.cells[row][col] = cell;
      }
    }
  }
  getCell(row: number, col: number): Cell {
    return this.cells[row][col];
  }
  public async setUpBoard() {
    const positions: BoardCoord[] = [
      { row: 0, col: 0 },
      { row: 1, col: 1 },
      { row: 2, col: 2 },
      { row: 3, col: 3 },
      { row: 4, col: 4 },
      { row: 0, col: 4 },
      { row: 1, col: 3 },
      { row: 3, col: 1 },
      { row: 4, col: 0 },
    ];
    //!
    const discardedCards = this.deck.discardCards(9);
    for (const pos of positions) {
      const cell = this.cells[pos.row][pos.col];
      const card = discardedCards.pop() as Card;
      this.placeCard(card, cell);

      await new Promise((r) => setTimeout(r, 100));
    }
  }
  private weightedRandom<T extends string>(weights: Record<T, number>): T {
    const entries = Object.entries(weights) as [T, number][];
    const totalWeight = entries.reduce((sum, [, w]) => sum + w, 0);

    let roll = Math.random() * totalWeight;

    for (const [key, weight] of entries) {
      roll -= weight;
      if (roll <= 0) {
        return key;
      }
    }

    // fallback defensivo
    return entries[entries.length - 1][0];
  }

  private createLineModifier(
    index: number,
    lineType: LineType,
    sign: ModifierSign,
  ) {
    const key = this.makeKey(lineType, index);

    let x = 0;
    let y = 0;

    if (lineType === "row") {
      x = -this.layout.cellWidth * 1.1;
      y = index * (this.layout.cellHeight + this.layout.spacingX);
    } else {
      y = -this.layout.cellHeight * 0.9;
      x = index * (this.layout.cellWidth + this.layout.spacingY);
    }

    const rndRank = this.weightedRandom(POKER_RANK_WEIGHTS);
    const lineModifier = new LineModifier(
      this.scene,
      x,
      y,
      lineType,
      index,
      rndRank,
      0.5,
      sign,
    );

    this.lineModifiers.set(key, lineModifier);
    this.add(lineModifier);
  }
  private makeKey(lineType: LineType, index: number): LineKey {
    return `${lineType}:${index}`;
  }
  private initLineModifiers() {
    for (const j of [0, 2, 4]) {
      this.createLineModifier(j, "col", "penalty");
    }
    for (const i of [0, 2, 4]) {
      this.createLineModifier(i, "row", "bonus");
    }
  }

  private removeLineModifier(lineModifier: LineModifier) {
    const key = this.lmKey(lineModifier.lineType, lineModifier.index);

    const lm = this.lineModifiers.get(key);
    if (!lm) return;

    this.lineModifiers.delete(key);
    this.remove(lm, true);

    const candidates = this.findCandidateLines();
    if (candidates.length === 0) return;

    const { index, lineType } =
      candidates[Math.floor(Math.random() * candidates.length)];

    this.createLineModifier(index, lineType, lineModifier.sign);
  }

  private findCandidateLines(): { lineType: LineType; index: number }[] {
    const candidates: { lineType: LineType; index: number }[] = [];

    for (let j = 0; j < this.cells[0].length; j++) {
      if (!this.lineModifiers.has(this.lmKey("col", j))) {
        candidates.push({ lineType: "col", index: j });
      }
    }

    for (let i = 0; i < this.cells.length; i++) {
      if (!this.lineModifiers.has(this.lmKey("row", i))) {
        candidates.push({ lineType: "row", index: i });
      }
    }

    return candidates;
  }

  public clearLine(lineType: LineType, index: number) {
    const cells = lineType === "row" ? this.getRow(index) : this.getCol(index);

    for (const cell of cells) {
      cell.removeCard();
    }
  }
  placeCard(card: Card, cell: Cell) {
    this.add(card); // misma jerarquía que las cells
    cell.setCard(card);
    card.moveToCell(cell);
    //! OJO ACA
    //card.moveToCell(cell);
    //this.bringToTop(card); // garantiza orden de render
    //cell.setCard(card);
  }
  public getRow(row: number): Cell[] {
    const result: Cell[] = [];
    const rowCells = this.cells[row];
    if (!rowCells) return result;

    for (let col = 0; col < rowCells.length; col++) {
      const cell = rowCells[col];
      if (cell.card !== null) {
        result.push(cell);
      }
    }

    return result;
  }
  public getCol(col: number): Cell[] {
    const result: Cell[] = [];

    for (let row = 0; row < this.cells.length; row++) {
      const cell = this.cells[row][col];
      if (cell && cell.card !== null) {
        result.push(cell);
      }
    }

    return result;
  }

  private lmKey(lineType: LineType, index: number): string {
    return `${lineType}:${index}`;
  }

  public getLineModifier(
    lineType: LineType,
    index: number,
  ): LineModifier | null {
    return this.lineModifiers.get(this.makeKey(lineType, index)) ?? null;
  }
}

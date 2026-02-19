import { Cell } from "../board/Cell";
const CARD_SIZE = {
  width: 90,
  height: 130,
};
export class Card extends Phaser.GameObjects.Container {
  private static nextId = 0;
  public readonly cardId: number = -1;
  public placed: boolean = false;
  public value: CardValue[] = [];
  public valueRange: [number, number] = [0, 0];
  public suit: CardSuit[] = [];
  private bgSprite: Phaser.GameObjects.Sprite;
  private valueText: Phaser.GameObjects.Text[] = [];
  private suitSprite: Phaser.GameObjects.Sprite[] = [];
  private modifier: HandModifier | null = null;
  //mvp 2 > add TAG
  //tagImg:Phaser.GameObjects.Sprite;
  //tag:string
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, 0, 0);
    scene.add.existing(this);

    this.cardId = Card.nextId++;
    this.bgSprite = scene.add.sprite(0, 0, "card-bg");
    this.bgSprite.setOrigin(0);
    this.bgSprite.setDisplaySize(CARD_SIZE.width, CARD_SIZE.height);

    this.add(this.bgSprite);
  }

  private valueToString(value: number): string {
    switch (value) {
      case 1:
        return "A";
      case 2:
        return "2";
      case 3:
        return "3";
      case 4:
        return "4";
      case 5:
        return "5";
      case 6:
        return "6";
      case 7:
        return "7";
      case 8:
        return "8";
      case 9:
        return "9";
      case 10:
        return "10";
      case 11:
        return "J";
      case 12:
        return "Q";

      default:
        return "K";
    }
  }

  public setValue(value: CardValue) {
    if (this.value.length === 1) {
      if (this.value[0] < value) this.value.push(value);
      else this.value.unshift(value);
    } else {
      this.value.push(value);
    }
    this.generateValueRange();
    this.setValueText();
  }
  private setValueText() {
    const baseX = 0;
    const baseY = 55;
    const centerOffset = 35;
    if (this.value.length === 1) {
      const text = this.valueToString(this.value[0]);
      this.valueText[0] = this.scene.add.text(0, 0, text, {
        fontFamily: "Arial",
        fontSize: "36px",
        fontStyle: "bold",
        color: "#000",
      });
      this.add(this.valueText[0]);
      const extraOffset = text === "10" ? -10 : 0;
      this.valueText[0].setPosition(baseX + centerOffset + extraOffset, baseY);
    } else {
      this.value.forEach((val, i) => {
        const text = this.valueToString(this.value[0]);
        if (!this.valueText[i]) {
          this.valueText[i] = this.scene.add.text(0, 0, text, {
            fontFamily: "Arial",
            fontSize: "36px",
            fontStyle: "bold",
            color: "#000",
          });
          this.add(this.valueText[i]);
        }

        const extraOffset = text === "10" ? 0 : 8;
        const spacing = i * 48;

        this.valueText[i].setPosition(baseX + spacing + extraOffset, baseY);
      });
    }
    if (this.value.length > 1) {
      const g = this.scene.add.graphics();

      g.lineStyle(2, 0x000000, 1);
      g.beginPath();
      g.moveTo(baseX + 45, baseY - 10);
      g.lineTo(baseX + 45, baseY + 45);
      g.strokePath();

      this.add(g);
    }
  }
  private generateValueRange() {
    if (this.value.length > 1) {
      this.valueRange[0] = this.value[0];
      this.valueRange[1] = this.value[1];
    } else {
      this.valueRange = [this.value[0], this.value[0]];
    }
  }
  public setSuit(suits: CardSuit[]) {
    const baseX = 5;
    const baseY = 5;
    const spacing = 25;
    suits.forEach((val, i) => {
      this.suit[i] = val;
      if (!this.suitSprite[i]) {
        this.suitSprite[i] = this.scene.add.sprite(0, 0, `suit-${val}`);
        this.suitSprite[i].setOrigin(0, 0);
        this.suitSprite[i].setScale(0.05, 0.05);
      }
      this.suitSprite[i].setPosition(baseX + spacing * i, baseY);
      this.add(this.suitSprite[i]);
    });
  }

  moveToCell(cell: Cell) {
    const { x, y } = cell.getCenterWorldPosition();
    this.setPosition(x - CARD_SIZE.width / 2, y - CARD_SIZE.height / 2);
  }
  public moveToDiscardPile({ x, y }: Coord) {
    this.setPosition(x, y);
  }
  public copyFrom(targetCard: Card) {
    targetCard.value.forEach((v) => this.setValue(v));
    this.setSuit([...targetCard.suit]);
  }
}

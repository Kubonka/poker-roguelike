const MOD_SIZE = {
  width: 90,
  height: 90,
};
export class LineModifier extends Phaser.GameObjects.Container {
  public isActive!: boolean;
  private bgSpriteCircle!: Phaser.GameObjects.Sprite;
  private bgSpriteCards!: Phaser.GameObjects.Sprite;
  public readonly multiplier: number = 1;
  public readonly rank: PokerRank = "high_card";
  public readonly lineType!: LineType;
  public readonly index!: number;
  public readonly sign!: ModifierSign;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    lineType: LineType,
    index: number,
    rank: PokerRank,
    multiplier: number = 0,
    sign: ModifierSign,
  ) {
    super(scene, x, y);
    this.bgSpriteCircle = scene.add.sprite(7, 25, "line_modifier_circle");
    this.bgSpriteCircle.setDisplaySize(MOD_SIZE.width, MOD_SIZE.height);
    this.bgSpriteCircle.setOrigin(0, 0);

    if (sign === "bonus") this.bgSpriteCircle.setTint(0x00ff00);
    else this.bgSpriteCircle.setTint(0xff0000);

    this.bgSpriteCards = scene.add.sprite(7, 25, `line_modifier_${rank}`);
    this.bgSpriteCards.setOrigin(0, 0);
    this.bgSpriteCards.setDisplaySize(MOD_SIZE.width, MOD_SIZE.height);

    this.multiplier = sign === "bonus" ? 1 + multiplier : 1 - multiplier;

    this.lineType = lineType;
    this.index = index;
    this.rank = rank;
    this.sign = sign;
    this.isActive = true;

    this.add([this.bgSpriteCards, this.bgSpriteCircle]);
    scene.add.existing(this);
  }

  public setIsActive(value: boolean) {
    this.isActive = value;
  }
}

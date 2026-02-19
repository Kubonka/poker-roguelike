export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    //* BACKGROUND  Y FOREGROUND
    this.load.svg("card-bg", "/suits/bg.svg", {
      width: 500,
      height: 700,
    });
    //* PALOS
    this.load.svg("suit-clubs", "/suits/club.svg", {
      width: 512,
      height: 512,
    });

    this.load.svg("suit-spades", "/suits/spade.svg", {
      width: 512,
      height: 512,
    });

    this.load.svg("suit-hearts", "/suits/heart.svg", {
      width: 512,
      height: 512,
    });

    this.load.svg("suit-diamonds", "/suits/diamond.svg", {
      width: 512,
      height: 512,
    });
    //* MODIFICADORES
    this.load.svg("line_modifier_circle", "/lineModifier/circle.svg", {
      width: 512,
      height: 512,
    });
    this.load.svg("line_modifier_one_pair", "/lineModifier/one-pair.svg", {
      width: 512,
      height: 512,
    });
    this.load.svg("line_modifier_two_pair", "/lineModifier/two-pair.svg", {
      width: 512,
      height: 512,
    });
    this.load.svg("line_modifier_three_kind", "/lineModifier/three-kind.svg", {
      width: 512,
      height: 512,
    });
    this.load.svg("line_modifier_straight", "/lineModifier/straight.svg", {
      width: 512,
      height: 512,
    });
    this.load.svg("line_modifier_flush", "/lineModifier/flush.svg", {
      width: 512,
      height: 512,
    });
    this.load.svg("line_modifier_full_house", "/lineModifier/full-house.svg", {
      width: 512,
      height: 512,
    });
    this.load.svg("line_modifier_four_kind", "/lineModifier/four-kind.svg", {
      width: 512,
      height: 512,
    });
    this.load.svg(
      "line_modifier_straight_flush",
      "/lineModifier/straight-flush.svg",
      {
        width: 512,
        height: 512,
      },
    );
  }

  create() {
    this.scene.start("PlayScene", {
      bus: this.registry.get("bus"),
    });
  }
}

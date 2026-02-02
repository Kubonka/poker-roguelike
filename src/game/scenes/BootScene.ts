export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    this.load.svg("card-bg", "/suits/cardBg.svg", {
      width: 500,
      height: 700,
    });
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
  }

  create() {
    this.scene.start("PlayScene", {
      bus: this.registry.get("bus"),
    });
  }
}

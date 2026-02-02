import { Card } from "@/game/cards/Card";
import { EventBus } from "@/game/core/EventBus";
import { GameEventMap } from "@/game/events/GameEventMap";

export class NextCardPreview extends Phaser.GameObjects.Container {
  private previewCard: Card | null = null;

  constructor(
    scene: Phaser.Scene,
    bus: EventBus<GameEventMap>,
    x: number,
    y: number,
  ) {
    super(scene, x, y);

    // Carta visual de preview (no interactiva)
    // this.previewCard = new Card(scene, 0, 0);
    // this.previewCard.setScale(0.8);
    // this.previewCard.disableInteractive();

    scene.add.existing(this);
    //bus.on("CARD_DRAWN", this.handleCardDrawn);
  }
  private handleCardDrawn(payload: { card: Card }) {
    //!clonar la card
  }
  /** API pública para actualizar la carta preview */
  public setPreviewCard(card: Card) {
    if (this.previewCard) {
      this.remove(this.previewCard);
    }
    this.previewCard = card;
    this.previewCard.setPosition(this.x, this.y);
    this.add(this.previewCard);
    console.log("1");
  }

  /** Lógica interna de render */
  // private updatePreview(card: Card) {
  //   // reset visual
  //   console.log(" UPDATE PREVIEW", card.valueRange);
  //   this.clearPreview();
  //   // copiar valores
  //   console.log("card.value", card.value);
  //   console.log("card.suit", card.suit);
  //   card.value.forEach((v) => this.previewCard.setValue(v));
  //   this.previewCard.setSuit([...card.suit]);
  //   //
  // }

  // private clearPreview() {
  //   // resetear estado interno de la carta preview
  //   this.previewCard.value = [];
  //   this.previewCard.valueRange = [0, 0];

  //   // eliminar textos y sprites previos
  //   this.previewCard.removeAll(true);

  //   // reconstruir fondo
  //   // (Card no tiene reset, así que recreamos)
  //   this.previewCard = new Card(this.scene, 0, 0);
  //   this.previewCard.disableInteractive();
  //   this.add(this.previewCard);
  // }
}

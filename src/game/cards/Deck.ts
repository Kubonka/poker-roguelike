import { EventBus } from "../core/EventBus";
import { GameEventMap } from "../events/GameEventMap";
import { Card } from "./Card";

export class Deck extends Phaser.GameObjects.Container {
  cards: Card[] = [];
  drawPile: Card[] = [];
  discardPile: Card[] = [];
  constructor(
    scene: Phaser.Scene,
    private bus: EventBus<GameEventMap>,
    x: number,
    y: number,
  ) {
    super(scene, x, y);
    scene.add.existing(this);
    this.initCards();
  }
  private initCards() {
    const suits: CardSuit[] = ["clubs", "diamonds", "hearts", "spades"];
    const values: CardValue[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    suits.forEach((s) =>
      values.forEach((v) => {
        const newCard = new Card(this.scene, 0, 0, v);
        newCard.setSuit([s]);
        this.cards.push(newCard);
        this.add(newCard);
      }),
    );
    this.discardPile = [...this.cards];
  }
  public addCard(card: Card) {
    this.cards.push(card);
  }
  public draw(): Card | null {
    console.log("count : ", this.drawPile.length);
    if (this.drawPile.length === 0) {
      console.log("entra reshufle");
      this.reShuffle();
      console.log("sale reshufle");
    }
    const card = this.drawPile.pop() ?? null;
    if (card) {
      this.bus.emit("CARD_DRAWN", { cardId: card.cardId });
    }
    return card;
  }
  private reShuffle() {
    //todo hacer bien el reshuffle  NO ESTOY USANDO DISCARD PILE
    if (this.discardPile.length === 0) return;

    this.drawPile = this.shuffleArray(this.discardPile);

    this.discardPile = [];
    this.bus.emit("DECK_RESHUFFLED", undefined);
    console.log(" ----- ***** DECK RESHUFLED ***** -----");
  }
  private shuffleArray(arr: Card[]) {
    const newArr = [...arr];
    for (let j = 0; j < 5; j++) {
      for (let i = 0; i < newArr.length; i++) {
        const targetIndex = Math.floor(Math.random() * newArr.length);
        const aux = newArr[i];
        newArr[i] = newArr[targetIndex];
        newArr[targetIndex] = aux;
      }
    }
    return newArr;
  }
}

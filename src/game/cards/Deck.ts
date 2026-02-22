import { EventBus } from "../core/EventBus";
import { GameEventMap } from "../events/GameEventMap";
import { Card } from "./Card";

export class Deck extends Phaser.GameObjects.Container {
  cards: Card[] = [];
  drawPile: Card[] = [];
  discardPile: Card[] = [];
  currentCard: Card | null = null;
  private discardPilePos: Coord = { x: 1900, y: 70 };
  constructor(
    scene: Phaser.Scene,
    private bus: EventBus<GameEventMap>,
    x: number,
    y: number,
  ) {
    super(scene, x, y);
    scene.add.existing(this);
    this.setPosition(x, y);
    this.initCards();
    this.bus.on("CARD_REMOVED", (payload: { card: Card }) =>
      this.handleCardRemoved(payload.card),
    );
  }
  public discardCards(count: number): Card[] {
    const result: Card[] = [];
    for (let i = 0; i < count; i++) {
      const card = this.drawPile.pop();
      result.push(card as Card);
      this.handleCardRemoved(card as Card);
    }
    return result;
  }
  private initCards() {
    const suits: CardSuit[] = ["clubs", "diamonds", "hearts", "spades"];
    const values: CardValue[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    suits.forEach((s) =>
      values.forEach((v) => {
        const newCard = new Card(this.scene, 0, 0);
        newCard.setValue(v);
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
  private handleCardRemoved(card: Card) {
    this.discardPile.push(card);
    card.moveToDiscardPile(this.discardPilePos);
  }

  public draw() {
    //const card = new Card(this.scene, 0, 0);
    if (!this.drawPile.length) {
      this.reShuffle();
    }
    this.currentCard = this.drawPile.pop() as Card;
    //console.log(this.currentCard.cardId);
    this.bus.emit("CARD_DRAWN", { card: this.currentCard });
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

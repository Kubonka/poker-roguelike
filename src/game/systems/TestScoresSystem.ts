"use client";
export class TestScoresSystem {
  private static STORAGE_KEY = "test_scores";

  public cardCount = 156;
  private readonly INITIAL_CARD_COUNT = 156;

  private state: PokerRank[] = [];

  constructor() {
    if (typeof window !== "undefined") {
      this.ensureStorage();
    }
  }

  // Inicializa el array si no existe
  private ensureStorage() {
    if (!localStorage.getItem(TestScoresSystem.STORAGE_KEY)) {
      localStorage.setItem(TestScoresSystem.STORAGE_KEY, JSON.stringify([]));
    }
  }

  private loadHistory(): PokerRank[][] {
    const raw = localStorage.getItem(TestScoresSystem.STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PokerRank[][]) : [];
  }

  private saveHistory(history: PokerRank[][]) {
    localStorage.setItem(TestScoresSystem.STORAGE_KEY, JSON.stringify(history));
  }

  private commitState() {
    if (this.state.length === 0) return;

    const history = this.loadHistory();
    history.push([...this.state]); // copia defensiva
    this.saveHistory(history);

    // reset
    this.state = [];
    this.cardCount = this.INITIAL_CARD_COUNT;
  }

  public addMatch(rank: PokerRank) {
    this.state.push(rank);
  }

  public consumeHand() {
    this.cardCount -= 5;

    if (this.cardCount <= 0) {
      this.commitState();
    }
  }

  public getCurrentState() {
    return this.state;
  }

  public getHistory(): PokerRank[][] {
    return this.loadHistory();
  }
}

import { EventBus } from "../core/EventBus";
import { GameEventMap } from "../events/GameEventMap";

export class TestScoresSystem {
  private static STORAGE_KEY = "test_scores";

  private readonly INITIAL_CARD_COUNT = 156;
  public cardCount = this.INITIAL_CARD_COUNT;

  private state: PokerRank[] = [];

  constructor(private bus: EventBus<GameEventMap>) {
    // if (typeof window !== "undefined") {
    //   this.ensureStorage();
    // }
  }

  public initStorage() {
    if (typeof window === "undefined") return;

    try {
      if (!localStorage.getItem(TestScoresSystem.STORAGE_KEY)) {
        localStorage.setItem(TestScoresSystem.STORAGE_KEY, JSON.stringify([]));
      }
    } catch (e) {
      console.warn("LocalStorage not available", e);
    }
  }
  // Inicializa el array si no existe
  private ensureStorage() {
    const storage = this.storage;
    if (!storage) return;

    if (!storage.getItem(TestScoresSystem.STORAGE_KEY)) {
      storage.setItem(TestScoresSystem.STORAGE_KEY, JSON.stringify([]));
    }
  }

  private loadHistory(): PokerRank[][] {
    const storage = this.storage;
    if (!storage) return [];

    try {
      const raw = storage.getItem(TestScoresSystem.STORAGE_KEY);
      return raw ? (JSON.parse(raw) as PokerRank[][]) : [];
    } catch {
      return [];
    }
  }

  private saveHistory(history: PokerRank[][]) {
    const storage = this.storage;
    if (!storage) return;

    try {
      storage.setItem(TestScoresSystem.STORAGE_KEY, JSON.stringify(history));
    } catch {
      // fail silently (modo incógnito, storage lleno, etc)
    }
  }

  private commitState() {
    if (this.state.length === 0) return;

    const history = this.loadHistory();
    history.push([...this.state]); // copia defensiva
    this.saveHistory(history);

    // reset
    this.state = [];
    this.cardCount = this.INITIAL_CARD_COUNT;
    this.bus.emit("TEST_COMPLETE", undefined);
  }

  public addMatch(rank: PokerRank) {
    this.state.push(rank);
  }

  public consumeHand() {
    this.cardCount -= 5;
    console.log(this.cardCount);

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
  private get storage(): Storage | null {
    try {
      if (typeof window === "undefined") return null;
      return window.localStorage;
    } catch {
      return null;
    }
  }
}

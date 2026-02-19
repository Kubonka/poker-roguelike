import { EventBus } from "../core/EventBus";
import { GameEventMap } from "../events/GameEventMap";

export class TestScoresSystem {
  private static STORAGE_KEY = "test_scores";

  private readonly INITIAL_CARD_COUNT = 104;
  public cardCount = this.INITIAL_CARD_COUNT;

  // ahora es number[]
  private state: number[] = [];

  constructor(private bus: EventBus<GameEventMap>) {}

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

  private loadHistory(): number[][] {
    const storage = this.storage;
    if (!storage) return [];

    try {
      const raw = storage.getItem(TestScoresSystem.STORAGE_KEY);
      return raw ? (JSON.parse(raw) as number[][]) : [];
    } catch {
      return [];
    }
  }

  private saveHistory(history: number[][]) {
    const storage = this.storage;
    if (!storage) return;

    try {
      storage.setItem(TestScoresSystem.STORAGE_KEY, JSON.stringify(history));
    } catch {
      // fail silently
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

  // ahora recibe number
  public addMatch(value: number) {
    this.state.push(value);
  }

  public consumeHand() {
    this.cardCount -= 5;

    if (this.cardCount <= 0) {
      this.commitState();
    }
  }

  public getCurrentState(): number[] {
    return this.state;
  }

  public getHistory(): number[][] {
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

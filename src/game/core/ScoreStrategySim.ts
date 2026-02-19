// Poker ranks usados en el proyecto
export type PokerRank =
  | "pair"
  | "two_pair"
  | "flush"
  | "three"
  | "straight"
  | "full_house"
  | "poker"
  | "straight_flush";

type ScoreTable = Record<PokerRank, number>;
type FrequencyTable = Record<PokerRank, number>;

export class ScoreTableSim {
  private readonly scoreTable: ScoreTable = {
    pair: 10,
    two_pair: 25,
    flush: 30,
    three: 45,
    straight: 70,
    full_house: 90,
    poker: 130,
    straight_flush: 180,
  };

  // Frecuencias agregadas de 20 partidas (la simulación mental)
  private readonly frequencies: FrequencyTable = {
    pair: 100,
    two_pair: 50,
    flush: 30,
    three: 12,
    straight: 10,
    full_house: 6,
    poker: 4,
    straight_flush: 1,
  };

  public simulate() {
    const breakdown: Record<
      PokerRank,
      { count: number; scorePerHand: number; total: number }
    > = {
      pair: { count: 0, scorePerHand: 0, total: 0 },
      two_pair: { count: 0, scorePerHand: 0, total: 0 },
      flush: { count: 0, scorePerHand: 0, total: 0 },
      three: { count: 0, scorePerHand: 0, total: 0 },
      straight: { count: 0, scorePerHand: 0, total: 0 },
      full_house: { count: 0, scorePerHand: 0, total: 0 },
      poker: { count: 0, scorePerHand: 0, total: 0 },
      straight_flush: { count: 0, scorePerHand: 0, total: 0 },
    };

    let grandTotal = 0;

    (Object.keys(this.scoreTable) as PokerRank[]).forEach((rank) => {
      const count = this.frequencies[rank];
      const score = this.scoreTable[rank];
      const total = count * score;

      breakdown[rank] = {
        count,
        scorePerHand: score,
        total,
      };

      grandTotal += total;
    });

    return {
      totalScore: grandTotal,
      breakdown,
    };
  }

  /** Útil para debug o logging */
  public printReport() {
    const result = this.simulate();

    console.log("=== SCORE TABLE SIMULATION (20 runs) ===");

    (
      Object.entries(result.breakdown) as [
        PokerRank,
        { count: number; scorePerHand: number; total: number },
      ][]
    ).forEach(([rank, data]) => {
      console.log(
        `${rank.padEnd(15)} | ${data.count
          .toString()
          .padStart(3)} × ${data.scorePerHand
          .toString()
          .padStart(3)} = ${data.total}`,
      );
    });

    console.log("--------------------------------------");
    console.log("TOTAL SCORE:", result.totalScore);
  }
}

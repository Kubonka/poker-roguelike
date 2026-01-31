import { Card } from "../cards/Card";

export class PokerHandEvaluator {
  private static combinations<T>(arr: T[], size: number): T[][] {
    if (size === 0) return [[]];
    if (arr.length < size) return [];

    const [head, ...tail] = arr;

    const withHead = this.combinations(tail, size - 1).map((c) => [head, ...c]);
    const withoutHead = this.combinations(tail, size);

    return [...withHead, ...withoutHead];
  }
  private static possibleValuesStraight(card: Card): number[] {
    const [min, max] = card.valueRange;

    if (min === max) {
      // Si es As, puede ser 1 o 14
      return min === 1 ? [1, 14] : [min];
    }

    const values = new Set<number>();
    values.add(min);
    values.add(max);

    if (min === 1 || max === 1) {
      values.add(14);
    }

    return Array.from(values);
  }
  private static possibleValues(card: Card): number[] {
    const [min, max] = card.valueRange;
    return min === max ? [min] : [min, max];
  }
  static isStraightFive(cards: Card[]): boolean {
    const valuesPerCard = cards.map((c) => this.possibleValuesStraight(c));

    const tryAssign = (index: number, chosen: number[]): boolean => {
      if (index === valuesPerCard.length) {
        const sorted = [...chosen].sort((a, b) => a - b);

        // No valores duplicados
        if (new Set(sorted).size !== 5) return false;

        for (let i = 1; i < 5; i++) {
          if (sorted[i] !== sorted[0] + i) return false;
        }

        return true;
      }

      for (const v of valuesPerCard[index]) {
        if (tryAssign(index + 1, [...chosen, v])) {
          return true;
        }
      }

      return false;
    };

    return tryAssign(0, []);
  }
  private static countByValue(cards: Card[]): Map<number, number> {
    const map = new Map<number, number>();

    cards.forEach((card) => {
      for (const v of PokerHandEvaluator.possibleValues(card)) {
        map.set(v, (map.get(v) ?? 0) + 1);
      }
    });

    return map;
  }
  private static buildValueBuckets(cards: Card[]): Map<number, number[]> {
    const map = new Map<number, number[]>();

    cards.forEach((card, idx) => {
      for (const v of PokerHandEvaluator.possibleValues(card)) {
        if (!map.has(v)) map.set(v, []);
        map.get(v)!.push(idx);
      }
    });

    return map;
  }
  static isOnePair(cards: Card[]): boolean {
    const valueBuckets = PokerHandEvaluator.buildValueBuckets(cards);

    for (const [value, indices] of valueBuckets.entries()) {
      if (indices.length < 2) continue;

      // Elegimos 2 cartas para el par
      for (let i = 0; i < indices.length; i++) {
        for (let j = i + 1; j < indices.length; j++) {
          const used = new Set([indices[i], indices[j]]);
          const usedValues = new Set([value]);

          let valid = true;

          // Las otras cartas deben poder tomar valores distintos
          for (let k = 0; k < cards.length; k++) {
            if (used.has(k)) continue;

            const possible = PokerHandEvaluator.possibleValues(cards[k]).filter(
              (v) => !usedValues.has(v),
            );

            if (possible.length === 0) {
              valid = false;
              break;
            }

            // elegimos uno cualquiera y lo marcamos
            usedValues.add(possible[0]);
          }

          if (valid) {
            console.log("IS ONE PAIR ", valid);
            return true;
          }
        }
      }
    }

    return false;
  }
  static isTwoPair(cards: Card[]): boolean {
    const valueBuckets = PokerHandEvaluator.buildValueBuckets(cards);
    const values = Array.from(valueBuckets.keys());

    // Elegimos dos valores distintos
    for (let a = 0; a < values.length; a++) {
      for (let b = a + 1; b < values.length; b++) {
        const v1 = values[a];
        const v2 = values[b];

        const idxs1 = valueBuckets.get(v1)!;
        const idxs2 = valueBuckets.get(v2)!;

        if (idxs1.length < 2 || idxs2.length < 2) continue;

        // Elegimos 2 cartas para el primer par
        for (let i = 0; i < idxs1.length; i++) {
          for (let j = i + 1; j < idxs1.length; j++) {
            const pair1 = new Set([idxs1[i], idxs1[j]]);

            // Elegimos 2 cartas para el segundo par
            for (let k = 0; k < idxs2.length; k++) {
              for (let l = k + 1; l < idxs2.length; l++) {
                const c3 = idxs2[k];
                const c4 = idxs2[l];

                if (pair1.has(c3) || pair1.has(c4)) continue;

                const used = new Set([...pair1, c3, c4]);

                // Buscar kicker
                let kickerValid = false;

                for (let m = 0; m < cards.length; m++) {
                  if (used.has(m)) continue;

                  const possible = PokerHandEvaluator.possibleValues(
                    cards[m],
                  ).filter((v) => v !== v1 && v !== v2);

                  if (possible.length > 0) {
                    kickerValid = true;
                    break;
                  }
                }

                if (kickerValid) return true;
              }
            }
          }
        }
      }
    }

    return false;
  }
  static isThreeOfAKind(cards: Card[]): boolean {
    const valueBuckets = PokerHandEvaluator.buildValueBuckets(cards);
    const values = Array.from(valueBuckets.keys());

    for (const v of values) {
      const idxs = valueBuckets.get(v)!;
      if (idxs.length < 3) continue;

      // Elegimos 3 cartas para el trío
      for (let i = 0; i < idxs.length; i++) {
        for (let j = i + 1; j < idxs.length; j++) {
          for (let k = j + 1; k < idxs.length; k++) {
            const trio = new Set([idxs[i], idxs[j], idxs[k]]);

            const remaining: number[] = [];
            for (let m = 0; m < cards.length; m++) {
              if (!trio.has(m)) remaining.push(m);
            }

            // Son exactamente 2 cartas
            const [c1, c2] = remaining;

            const v1 = PokerHandEvaluator.possibleValues(cards[c1]).filter(
              (x) => x !== v,
            );
            const v2 = PokerHandEvaluator.possibleValues(cards[c2]).filter(
              (x) => x !== v,
            );

            let valid = false;

            for (const a of v1) {
              for (const b of v2) {
                if (a !== b) {
                  valid = true;
                  break;
                }
              }
              if (valid) break;
            }

            if (valid) return true;
          }
        }
      }
    }

    return false;
  }
  static isStraight(cards: Card[]): boolean {
    const hands = PokerHandEvaluator.combinations(cards, 5);

    for (const hand of hands) {
      if (this.isStraightFive(hand)) {
        return true;
      }
    }

    return false;
  }
  static isFlush(cards: Card[]): boolean {
    const allSuits: CardSuit[] = ["hearts", "diamonds", "spades", "clubs"];

    for (const suit of allSuits) {
      let ok = true;

      for (const card of cards) {
        if (!card.suit.includes(suit)) {
          ok = false;
          break;
        }
      }

      if (ok) return true;
    }

    return false;
  }
  static isFullHouse(cards: Card[]): boolean {
    const buckets = PokerHandEvaluator.buildValueBuckets(cards);

    for (const [tripleValue, tripleCards] of buckets) {
      if (tripleCards.length < 3) continue;

      for (const [pairValue, pairCards] of buckets) {
        if (pairValue === tripleValue) continue;
        if (pairCards.length < 2) continue;

        // verificar que no se usen las mismas cartas
        const used = new Set<number>();

        tripleCards.slice(0, 3).forEach((i) => used.add(i));

        let pairCount = 0;
        for (const i of pairCards) {
          if (!used.has(i)) pairCount++;
        }

        if (pairCount >= 2) {
          return true;
        }
      }
    }

    return false;
  }
  static isFourOfKind(cards: Card[]): boolean {
    const counts = PokerHandEvaluator.countByValue(cards);

    for (const count of counts.values()) {
      if (count >= 4) return true;
    }

    return false;
  }
  static isStraightFlush(cards: Card[]): boolean {
    const allSuits: CardSuit[] = ["hearts", "diamonds", "spades", "clubs"];

    for (const suit of allSuits) {
      const suitedCards = cards.filter((card) => card.suit.includes(suit));

      if (suitedCards.length < 5) continue;

      if (PokerHandEvaluator.isStraight(suitedCards)) {
        return true;
      }
    }

    return false;
  }
}

export const HAND_MODIFIER_DEFS: Record<
  PokerRank,
  Omit<HandModifier, "sign" | "multiplier">
> = {
  one_pair: { rank: "one_pair" },
  two_pair: { rank: "two_pair" },
  three_kind: { rank: "three_kind" },
  straight: { rank: "straight" },
  flush: { rank: "flush" },
  full_house: { rank: "full_house" },
  four_kind: { rank: "four_kind" },
  straight_flush: { rank: "straight_flush" },
  high_card: { rank: "high_card" },
};

function createBonusModifier(rank: PokerRank): HandModifier {
  return {
    ...HAND_MODIFIER_DEFS[rank],
    sign: "bonus",
    multiplier: 1.5,
  };
}

const lineModifiersTable = {
  one_pair: { rank: "one_pair" },
  two_pair: { rank: "two_pair" },
  three_kind: { rank: "three_kind" },
  straight: { rank: "straight" },
  flush: { rank: "flush" },
  full_house: { rank: "full_house" },
  four_kind: { rank: "four_kind" },
  straight_flush: { rank: "straight_flush" },
  high_card: { rank: "high_card" },
};

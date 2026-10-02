// Pure maths for the Money Counter practice modes. Everything is in whole
// cents. Unit tested in src/lib/__tests__/money-counter-calc.test.ts.

import { ALL_MONEY_PIECES } from "./money-data";

export type MoneyCounts = Record<string, number>;

export function pileTotalCents(counts: MoneyCounts): number {
  return ALL_MONEY_PIECES.reduce(
    (sum, piece) => sum + piece.valueCents * Math.max(0, Math.floor(counts[piece.id] ?? 0)),
    0
  );
}

/**
 * Australia has no 1c or 2c coins, so a cash total is rounded to the
 * nearest 5 cents: 1-2c round down, 3-4c round up (and the same for 6-9c).
 * Card payments are not rounded.
 */
export function roundCashCents(cents: number): number {
  return Math.round(Math.round(cents) / 5) * 5;
}

/**
 * The fewest Australian coins and notes that make exactly `cents`
 * (rounded to the nearest 5c first). Biggest pieces first, which always
 * gives the fewest pieces for Australian money.
 */
export function fewestPieces(cents: number): MoneyCounts {
  let left = roundCashCents(Math.max(0, cents));
  const result: MoneyCounts = {};
  const byValue = [...ALL_MONEY_PIECES].sort((a, b) => b.valueCents - a.valueCents);
  for (const piece of byValue) {
    const n = Math.floor(left / piece.valueCents);
    if (n > 0) {
      result[piece.id] = n;
      left -= n * piece.valueCents;
    }
  }
  return result;
}

export type TargetLevel = "dollars" | "coins" | "big";

export const TARGET_LEVELS: { id: TargetLevel; label: string }[] = [
  { id: "dollars", label: "Easy: whole dollars" },
  { id: "coins", label: "Medium: dollars and cents" },
  { id: "big", label: "Hard: up to $80" },
];

/**
 * A practice amount to make. `rand` is a number from 0 up to (not
 * including) 1, passed in so this stays testable.
 */
export function practiceTarget(level: TargetLevel, rand: number): number {
  const r = Math.min(Math.max(rand, 0), 0.999999);
  switch (level) {
    case "dollars":
      return (1 + Math.floor(r * 20)) * 100; // $1 to $20
    case "coins":
      return (1 + Math.floor(r * 399)) * 5; // 5c to $19.95
    case "big":
      return (20 + Math.floor(r * 1581)) * 5; // $1 to $80 (5c steps)
    default:
      return 100;
  }
}

export type TargetResult =
  | { status: "exact" }
  | { status: "short"; byCents: number }
  | { status: "over"; byCents: number };

export function compareToTarget(pileCents: number, targetCents: number): TargetResult {
  if (pileCents === targetCents) return { status: "exact" };
  if (pileCents < targetCents) return { status: "short", byCents: targetCents - pileCents };
  return { status: "over", byCents: pileCents - targetCents };
}

export interface PaymentCheck {
  /** The price after cash rounding to 5c. */
  cashPriceCents: number;
  enough: boolean;
  changeCents: number;
  shortByCents: number;
}

/** Paying cash: is the pile enough, and how much change comes back? */
export function checkCashPayment(pileCents: number, priceCents: number): PaymentCheck {
  const cashPriceCents = roundCashCents(Math.max(0, priceCents));
  const diff = pileCents - cashPriceCents;
  return {
    cashPriceCents,
    enough: diff >= 0,
    changeCents: Math.max(0, diff),
    shortByCents: Math.max(0, -diff),
  };
}

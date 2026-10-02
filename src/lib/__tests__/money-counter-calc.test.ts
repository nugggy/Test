import { describe, expect, it } from "vitest";
import {
  checkCashPayment,
  compareToTarget,
  fewestPieces,
  pileTotalCents,
  practiceTarget,
  roundCashCents,
} from "../money-counter-calc";

describe("pileTotalCents", () => {
  it("adds up a pile of coins and notes", () => {
    expect(pileTotalCents({ "5c": 3, "2d": 1, "20n": 2 })).toBe(15 + 200 + 4000);
  });
  it("ignores unknown ids and bad counts", () => {
    expect(pileTotalCents({ nope: 4, "1d": -2, "10c": 1.7 })).toBe(10);
  });
});

describe("roundCashCents (Australian cash rounding)", () => {
  it("rounds 1-2c down and 3-4c up", () => {
    expect(roundCashCents(401)).toBe(400);
    expect(roundCashCents(402)).toBe(400);
    expect(roundCashCents(403)).toBe(405);
    expect(roundCashCents(404)).toBe(405);
  });
  it("rounds 6-7c down and 8-9c up", () => {
    expect(roundCashCents(396)).toBe(395);
    expect(roundCashCents(397)).toBe(395);
    expect(roundCashCents(398)).toBe(400);
    expect(roundCashCents(399)).toBe(400);
  });
});

describe("fewestPieces", () => {
  it("uses the biggest pieces first", () => {
    expect(fewestPieces(18595)).toEqual({
      "100n": 1,
      "50n": 1,
      "20n": 1,
      "10n": 1,
      "5n": 1,
      "50c": 1,
      "20c": 2,
      "5c": 1,
    });
  });
  it("makes $3.85 as $2, $1, 50c, 20c, 10c, 5c", () => {
    expect(fewestPieces(385)).toEqual({ "2d": 1, "1d": 1, "50c": 1, "20c": 1, "10c": 1, "5c": 1 });
  });
  it("makes nothing from zero", () => {
    expect(fewestPieces(0)).toEqual({});
  });
  it("always adds back up to the cash-rounded amount", () => {
    for (const cents of [5, 95, 1234, 9999, 4321]) {
      expect(pileTotalCents(fewestPieces(cents))).toBe(roundCashCents(cents));
    }
  });
});

describe("practiceTarget", () => {
  it("gives whole dollars on easy", () => {
    expect(practiceTarget("dollars", 0)).toBe(100);
    expect(practiceTarget("dollars", 0.9999)).toBe(2000);
  });
  it("always gives multiples of 5c that can be made with real coins", () => {
    for (const r of [0, 0.123, 0.5, 0.987, 1]) {
      for (const level of ["dollars", "coins", "big"] as const) {
        const t = practiceTarget(level, r);
        expect(t % 5).toBe(0);
        expect(t).toBeGreaterThan(0);
        expect(t).toBeLessThanOrEqual(8000);
      }
    }
  });
});

describe("compareToTarget", () => {
  it("says exact, short or over", () => {
    expect(compareToTarget(500, 500)).toEqual({ status: "exact" });
    expect(compareToTarget(450, 500)).toEqual({ status: "short", byCents: 50 });
    expect(compareToTarget(700, 500)).toEqual({ status: "over", byCents: 200 });
  });
});

describe("checkCashPayment", () => {
  it("works out change after cash rounding", () => {
    expect(checkCashPayment(500, 399)).toEqual({
      cashPriceCents: 400,
      enough: true,
      changeCents: 100,
      shortByCents: 0,
    });
  });
  it("says how much more is needed", () => {
    expect(checkCashPayment(300, 452)).toEqual({
      cashPriceCents: 450,
      enough: false,
      changeCents: 0,
      shortByCents: 150,
    });
  });
});

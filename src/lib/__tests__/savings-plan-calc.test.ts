import { describe, expect, it } from "vitest";
import {
  addMonths,
  amountPerPeriod,
  periodsUntil,
  savingsProgress,
  timeToReach,
} from "../savings-plan-calc";
import { normaliseSavingsGoals } from "../savings-plan-storage";

describe("savingsProgress", () => {
  it("works out saved, to go and percent", () => {
    expect(savingsProgress(500, [100, 25.5])).toEqual({
      saved: 125.5,
      toGo: 374.5,
      pct: 25,
      reached: false,
    });
  });
  it("counts money taken out", () => {
    expect(savingsProgress(100, [80, -30]).saved).toBe(50);
  });
  it("marks a goal as reached and caps at 100%", () => {
    const p = savingsProgress(100, [60, 60]);
    expect(p.reached).toBe(true);
    expect(p.pct).toBe(100);
    expect(p.toGo).toBe(0);
  });
  it("never reports 100% until it is really reached", () => {
    expect(savingsProgress(100, [99.99]).pct).toBe(99);
  });
  it("handles no goal amount", () => {
    expect(savingsProgress(0, [10])).toMatchObject({ pct: 0, reached: false });
  });
});

describe("addMonths", () => {
  it("clamps to the end of shorter months", () => {
    expect(addMonths("2026-01-31", 1)).toBe("2026-02-28");
    expect(addMonths("2026-11-15", 3)).toBe("2027-02-15");
  });
});

describe("periodsUntil", () => {
  it("counts whole weeks and fortnights", () => {
    expect(periodsUntil("2026-10-01", "2026-10-29", "week")).toBe(4);
    expect(periodsUntil("2026-10-01", "2026-10-29", "fortnight")).toBe(2);
  });
  it("counts whole months", () => {
    expect(periodsUntil("2026-10-01", "2027-01-01", "month")).toBe(3);
  });
  it("gives at least one period for a near date, and zero for a past date", () => {
    expect(periodsUntil("2026-10-01", "2026-10-03", "week")).toBe(1);
    expect(periodsUntil("2026-10-01", "2026-09-01", "week")).toBe(0);
  });
});

describe("amountPerPeriod", () => {
  it("splits what is left over the periods, rounding up to the cent", () => {
    expect(amountPerPeriod(100, "2026-10-01", "2026-10-22", "week")).toEqual({
      amount: 33.34,
      periods: 3,
    });
  });
  it("returns null without a date, after the date, or when nothing is left", () => {
    expect(amountPerPeriod(100, "2026-10-01", "", "week")).toBeNull();
    expect(amountPerPeriod(100, "2026-10-01", "2026-09-01", "week")).toBeNull();
    expect(amountPerPeriod(0, "2026-10-01", "2026-12-01", "week")).toBeNull();
  });
});

describe("timeToReach", () => {
  it("works out how many periods and roughly when", () => {
    expect(timeToReach(100, 30, "fortnight", "2026-10-01")).toEqual({
      periods: 4,
      date: "2026-11-26",
    });
    expect(timeToReach(90, 30, "month", "2026-01-31")).toEqual({ periods: 3, date: "2026-04-30" });
  });
  it("returns null when there is nothing to work out", () => {
    expect(timeToReach(100, 0, "week", "2026-10-01")).toBeNull();
    expect(timeToReach(0, 10, "week", "2026-10-01")).toBeNull();
  });
});

describe("savings storage migration", () => {
  it("loads old goals and adds the new fields with defaults", () => {
    const old = [
      {
        id: "g1",
        title: "Holiday",
        targetAmount: 800,
        targetDate: "",
        contributions: [{ id: "c1", date: "2026-09-01", amount: 50, note: "" }],
      },
    ];
    expect(normaliseSavingsGoals(old)).toEqual([
      { ...old[0], regularAmount: 0, regularPeriod: "fortnight" },
    ]);
  });
  it("keeps money taken out as a negative amount", () => {
    const goals = normaliseSavingsGoals([
      { id: "g", title: "x", targetAmount: 10, contributions: [{ id: "c", amount: -5 }] },
    ]);
    expect(goals[0].contributions[0].amount).toBe(-5);
  });
  it("ignores broken data", () => {
    expect(normaliseSavingsGoals({})).toEqual([]);
    expect(normaliseSavingsGoals([null, 3])).toEqual([]);
  });
});

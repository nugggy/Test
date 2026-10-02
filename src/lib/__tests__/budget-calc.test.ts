import { describe, expect, it } from "vitest";
import {
  addDays,
  checkAfford,
  daysBetween,
  filterByRange,
  formatDateOnly,
  parseDollars,
  rangeStart,
  sumDollars,
  summariseTransactions,
} from "../budget-calc";
import { normaliseTransactions, normaliseWeeklyPlan } from "../budget-storage";

describe("sumDollars", () => {
  it("adds without floating point drift", () => {
    expect(sumDollars([0.1, 0.2])).toBe(0.3);
    expect(sumDollars([19.99, 0.01, -5])).toBe(15);
  });
});

describe("checkAfford", () => {
  it("says yes and shows what is left", () => {
    expect(checkAfford(50, 19.95)).toEqual({ canAfford: true, leftAfter: 30.05, shortBy: 0 });
  });
  it("treats an exact amount as affordable", () => {
    expect(checkAfford(20, 20).canAfford).toBe(true);
  });
  it("says no and shows how much more is needed", () => {
    expect(checkAfford(10.5, 12)).toEqual({ canAfford: false, leftAfter: 0, shortBy: 1.5 });
  });
  it("handles an already overspent plan", () => {
    expect(checkAfford(-5, 10)).toEqual({ canAfford: false, leftAfter: 0, shortBy: 15 });
  });
});

describe("parseDollars", () => {
  it("accepts common ways of typing money", () => {
    expect(parseDollars("12.50")).toBe(12.5);
    expect(parseDollars("$1,200")).toBe(1200);
    expect(parseDollars(" 7 ")).toBe(7);
    expect(parseDollars("12.")).toBe(12);
    expect(parseDollars(".5")).toBe(0.5);
  });
  it("rejects anything else", () => {
    expect(parseDollars("")).toBeNull();
    expect(parseDollars("abc")).toBeNull();
    expect(parseDollars("-5")).toBeNull();
    expect(parseDollars("1.2.3")).toBeNull();
  });
});

describe("dates", () => {
  it("adds days across month and year ends", () => {
    expect(addDays("2026-01-31", 1)).toBe("2026-02-01");
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
  });
  it("is not thrown off by daylight saving changes", () => {
    // AEDT starts 4 October 2026 in NSW.
    expect(daysBetween("2026-10-03", "2026-10-05")).toBe(2);
  });
  it("formats in Australian order", () => {
    expect(formatDateOnly("2026-08-31")).toBe("31 Aug 2026");
    expect(formatDateOnly("not a date")).toBe("not a date");
  });
});

describe("date ranges", () => {
  const items = [
    { id: "a", date: "2026-10-02" },
    { id: "b", date: "2026-09-26" },
    { id: "c", date: "2026-09-25" },
    { id: "d", date: "2026-09-19" },
    { id: "e", date: "2026-09-30" },
  ];
  it("works out the start of each range", () => {
    expect(rangeStart("7d", "2026-10-02")).toBe("2026-09-26");
    expect(rangeStart("14d", "2026-10-02")).toBe("2026-09-19");
    expect(rangeStart("month", "2026-10-02")).toBe("2026-10-01");
    expect(rangeStart("all", "2026-10-02")).toBeNull();
  });
  it("filters to the range, including both ends", () => {
    expect(filterByRange(items, "7d", "2026-10-02").map((i) => i.id)).toEqual(["a", "b", "e"]);
    expect(filterByRange(items, "14d", "2026-10-02")).toHaveLength(5);
    expect(filterByRange(items, "month", "2026-10-02").map((i) => i.id)).toEqual(["a"]);
    expect(filterByRange(items, "all", "2026-10-02")).toHaveLength(5);
  });
});

describe("summariseTransactions", () => {
  it("totals money in and out", () => {
    expect(
      summariseTransactions([
        { type: "income", amount: 400.1 },
        { type: "expense", amount: 100.2 },
        { type: "expense", amount: 0.1 },
      ])
    ).toEqual({ income: 400.1, expenses: 100.3, balance: 299.8 });
  });
});

describe("budget storage migration", () => {
  it("loads an old weekly plan with no period or paid flags", () => {
    const old = { weeklyAmount: 350, items: [{ id: "plan-1", label: "Rent", cost: 200 }] };
    expect(normaliseWeeklyPlan(old)).toEqual({
      weeklyAmount: 350,
      period: "week",
      items: [{ id: "plan-1", label: "Rent", cost: 200, paid: false }],
    });
  });
  it("keeps a saved period and paid flag", () => {
    const saved = {
      weeklyAmount: 700,
      period: "fortnight",
      items: [{ id: "x", label: "Phone", cost: 30, paid: true }],
    };
    expect(normaliseWeeklyPlan(saved)).toEqual(saved);
  });
  it("falls back safely on missing or broken data", () => {
    expect(normaliseWeeklyPlan(null)).toEqual({ weeklyAmount: 0, period: "week", items: [] });
    expect(normaliseWeeklyPlan({ weeklyAmount: "abc", period: "year", items: "x" })).toEqual({
      weeklyAmount: 0,
      period: "week",
      items: [],
    });
  });
  it("keeps old transactions as they were", () => {
    const old = [
      { id: "txn-1", type: "income", description: "DSP", amount: 1000, category: "Centrelink / pension", date: "2026-09-01" },
    ];
    expect(normaliseTransactions(old)).toEqual(old);
    expect(normaliseTransactions("nope")).toEqual([]);
  });
});

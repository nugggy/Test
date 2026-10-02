import { describe, expect, it } from "vitest";
import {
  activeRows,
  categoryRows,
  groupTotals,
  perWeek,
  splitByPlanDates,
  totalsOf,
  weeksLeftInPlan,
} from "../ndis-budget-calc";
import { NDIS_CATEGORIES, categoryLabel } from "../ndis-budget-data";
import { normaliseNdisExpenses, normaliseNdisPlan } from "../ndis-budget-storage";

const plan = {
  startDate: "2026-07-01",
  endDate: "2027-06-30",
  allocations: {
    "core-daily-life": 20000,
    "core-transport": 1000,
    "cb-daily-living": 5000.5,
  },
};

const expenses = [
  { amount: 1200.1, categoryId: "core-daily-life", date: "2026-08-01" },
  { amount: 1500, categoryId: "core-transport", date: "2026-09-01" },
  { amount: 300, categoryId: "cb-daily-living", date: "2026-07-15" },
  // From the previous plan - should not count.
  { amount: 999, categoryId: "core-daily-life", date: "2026-06-30" },
];

describe("NDIS categories", () => {
  it("has all 15 support categories with unique ids and numbers", () => {
    const current = NDIS_CATEGORIES.filter((c) => !c.legacy);
    expect(current).toHaveLength(15);
    expect(new Set(current.map((c) => c.id)).size).toBe(15);
    expect(current.map((c) => c.number).sort()).toEqual(
      Array.from({ length: 15 }, (_, i) => String(i + 1).padStart(2, "0"))
    );
  });
  it("keeps the ids used by older saved data", () => {
    for (const id of [
      "core-daily-life",
      "core-consumables",
      "core-transport",
      "core-social",
      "capacity-building",
      "capital",
    ]) {
      expect(NDIS_CATEGORIES.some((c) => c.id === id)).toBe(true);
    }
  });
  it("labels categories with their number", () => {
    expect(categoryLabel("core-transport")).toBe("02 Transport");
    expect(categoryLabel("unknown-id")).toBe("unknown-id");
  });
});

describe("splitByPlanDates", () => {
  it("leaves out spending from outside the plan dates", () => {
    const { inPlan, outside } = splitByPlanDates(plan, expenses);
    expect(inPlan).toHaveLength(3);
    expect(outside).toHaveLength(1);
  });
  it("counts everything when there are no plan dates", () => {
    const { inPlan } = splitByPlanDates({ ...plan, startDate: "", endDate: "" }, expenses);
    expect(inPlan).toHaveLength(4);
  });
});

describe("category and group totals", () => {
  const rows = categoryRows(plan, splitByPlanDates(plan, expenses).inPlan);

  it("works out what is left per category, including overspending", () => {
    const daily = rows.find((r) => r.category.id === "core-daily-life");
    expect(daily).toMatchObject({ allocated: 20000, spent: 1200.1, left: 18799.9 });
    const transport = rows.find((r) => r.category.id === "core-transport");
    expect(transport?.left).toBe(-500);
    expect(transport?.fraction).toBe(1.5);
  });
  it("only shows categories that have money or spending", () => {
    expect(activeRows(rows).map((r) => r.category.id)).toEqual([
      "core-daily-life",
      "core-transport",
      "cb-daily-living",
    ]);
  });
  it("adds up each budget group and the whole plan", () => {
    expect(groupTotals(rows, "Core Supports")).toMatchObject({
      allocated: 21000,
      spent: 2700.1,
      left: 18299.9,
    });
    expect(groupTotals(rows, "Capacity Building").left).toBe(4700.5);
    expect(groupTotals(rows, "Capital Supports").allocated).toBe(0);
    expect(totalsOf(rows)).toMatchObject({ allocated: 26000.5, spent: 3000.1, left: 23000.4 });
  });
});

describe("weeks left and per week", () => {
  it("counts weeks from today to the end of the plan", () => {
    expect(weeksLeftInPlan(plan, "2027-06-24")).toBe(1);
    expect(weeksLeftInPlan(plan, "2027-06-23")).toBe(2);
    expect(weeksLeftInPlan(plan, "2027-07-01")).toBeNull();
  });
  it("uses the start date if the plan has not started yet", () => {
    expect(weeksLeftInPlan(plan, "2026-01-01")).toBe(53);
  });
  it("spreads money left evenly, rounding down to the cent", () => {
    expect(perWeek(100, 3)).toBe(33.33);
    expect(perWeek(-5, 3)).toBeNull();
    expect(perWeek(100, null)).toBeNull();
  });
});

describe("NDIS storage migration", () => {
  it("loads old spending without a provider", () => {
    const old = [{ id: "e1", description: "Shift", amount: 65.47, categoryId: "core-daily-life", date: "2026-08-01" }];
    expect(normaliseNdisExpenses(old)).toEqual([{ ...old[0], provider: "" }]);
  });
  it("loads an old plan, keeping legacy category amounts", () => {
    const old = {
      startDate: "2026-07-01",
      endDate: "2027-06-30",
      allocations: { "core-daily-life": 100, "capacity-building": 5000, capital: 2000 },
    };
    expect(normaliseNdisPlan(old)).toEqual(old);
  });
  it("shows legacy amounts in the dashboard totals", () => {
    const old = normaliseNdisPlan({ allocations: { "capacity-building": 5000 } });
    const rows = categoryRows(old, []);
    expect(activeRows(rows).map((r) => r.category.id)).toEqual(["capacity-building"]);
    expect(groupTotals(rows, "Capacity Building").allocated).toBe(5000);
  });
  it("copes with broken data", () => {
    expect(normaliseNdisPlan("x")).toEqual({ startDate: "", endDate: "", allocations: {} });
    expect(normaliseNdisExpenses(null)).toEqual([]);
  });
});

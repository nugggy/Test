import { describe, expect, it } from "vitest";
import { budgetTotal, tripLength, tripStatus } from "../holiday-planner-calc";
import { goalProgress } from "../goal-tracker-calc";
import { pictureFor } from "../meal-planner-pictures";
import { normaliseGoals } from "../goal-tracker-storage";
import { normaliseDailyTasks } from "../daily-life-storage";

describe("holiday planner", () => {
  it("counts sleeps until the trip", () => {
    expect(tripStatus("2026-10-10", "2026-10-15", "2026-10-02")).toEqual({
      kind: "upcoming",
      sleeps: 8,
    });
  });
  it("knows the trip day while away, and when it has finished", () => {
    expect(tripStatus("2026-10-10", "2026-10-15", "2026-10-10")).toEqual({ kind: "today" });
    expect(tripStatus("2026-10-10", "2026-10-15", "2026-10-12")).toEqual({
      kind: "during",
      day: 3,
      of: 6,
    });
    expect(tripStatus("2026-10-10", "2026-10-15", "2026-10-16")).toEqual({ kind: "finished" });
    expect(tripStatus("", "", "2026-10-16")).toEqual({ kind: "none" });
  });
  it("works out days and nights", () => {
    expect(tripLength("2026-10-10", "2026-10-15")).toEqual({ days: 6, nights: 5 });
    expect(tripLength("2026-10-15", "2026-10-10")).toBeNull();
  });
  it("adds up $ amounts in budget lines", () => {
    expect(
      budgetTotal(["Flights - $450", "Hotel $1,200.50", "Food - $", "Spending money: about $ 80"])
    ).toEqual({ total: 1730.5, counted: 3, skipped: 1 });
  });
});

describe("goal progress", () => {
  const steps = [
    { text: "Find the timetable", done: true },
    { text: "Practise with my support worker", done: false },
    { text: "Go by myself", done: false },
  ];
  it("shows the next step and percent", () => {
    expect(goalProgress(steps, "2026-10-12", "2026-10-02")).toEqual({
      done: 1,
      total: 3,
      pct: 33,
      achieved: false,
      nextStep: "Practise with my support worker",
      daysLeft: 10,
    });
  });
  it("is achieved only when every step is done", () => {
    expect(goalProgress(steps.map((s) => ({ ...s, done: true })), "", "2026-10-02").achieved).toBe(true);
    expect(goalProgress([], "", "2026-10-02").achieved).toBe(false);
  });
});

describe("shopping list pictures", () => {
  it("matches common items", () => {
    expect(pictureFor("1.5kg beef mince")).toBe("🥩");
    expect(pictureFor("2 onions")).toBe("🧅");
    expect(pictureFor("400ml coconut milk")).toBe("🥥");
    expect(pictureFor("1 cup milk")).toBe("🥛");
    expect(pictureFor("1 tin tomatoes")).toBe("🥫");
    expect(pictureFor("3 tomatoes")).toBe("🍅");
    expect(pictureFor("6 eggs")).toBe("🥚");
  });
  it("only matches whole words", () => {
    expect(pictureFor("2 pears")).toBe("🍐");
    expect(pictureFor("1 cup peas")).toBe("🫛");
    expect(pictureFor("Steak")).toBe("🥩");
  });
  it("falls back to a shopping bag", () => {
    expect(pictureFor("Birthday card")).toBe("🛍️");
  });
});

describe("goal and task storage", () => {
  it("loads old goals unchanged and fills missing fields", () => {
    const old = [
      { id: "g1", title: "Bus", category: "General", targetDate: "", notes: "", steps: [{ id: "s1", text: "Plan", done: true }] },
    ];
    expect(normaliseGoals(old, "General")).toEqual(old);
    expect(normaliseGoals([{ id: "g2", title: "x" }], "Meeting people")).toEqual([
      { id: "g2", title: "x", category: "Meeting people", targetDate: "", notes: "", steps: [] },
    ]);
  });
  it("loads old daily tasks unchanged", () => {
    const old = [{ id: "t1", title: "Laundry", emoji: "🧺", steps: [{ id: "s1", text: "Sort", done: false }] }];
    expect(normaliseDailyTasks(old)).toEqual(old);
    expect(normaliseDailyTasks(undefined)).toEqual([]);
  });
});

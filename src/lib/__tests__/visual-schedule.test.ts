import { describe, expect, it } from "vitest";
import {
  currentStepIndex,
  nextStepIndex,
  parseScheduleItems,
} from "@/lib/visual-schedule-storage";

describe("now and next", () => {
  const steps = (done: boolean[]) => done.map((d) => ({ done: d }));

  it("finds the first unfinished step as now, and the one after as next", () => {
    expect(currentStepIndex(steps([true, false, false]))).toBe(1);
    expect(nextStepIndex(steps([true, false, false]))).toBe(2);
  });

  it("skips steps already ticked further down", () => {
    expect(nextStepIndex(steps([false, true, false]))).toBe(2);
  });

  it("returns -1 when everything is done or nothing is left after now", () => {
    expect(currentStepIndex(steps([true, true]))).toBe(-1);
    expect(nextStepIndex(steps([true, false]))).toBe(-1);
    expect(currentStepIndex([])).toBe(-1);
  });
});

describe("parseScheduleItems", () => {
  it("loads older items without a duration", () => {
    const items = parseScheduleItems([{ id: "x", label: "Lunch", icon: "🍱", done: true }]);
    expect(items).toEqual([{ id: "x", label: "Lunch", icon: "🍱", done: true, durationMinutes: 0 }]);
  });

  it("ignores data that isn't a list", () => {
    expect(parseScheduleItems({ nope: true })).toEqual([]);
    expect(parseScheduleItems([null, 3])).toEqual([]);
  });
});

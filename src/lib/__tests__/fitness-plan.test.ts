import { describe, expect, it } from "vitest";
import {
  formatFitnessDate,
  normalizeFitnessEntries,
  weekStartKey,
  weekSummary,
} from "../fitness-log-storage";

describe("normalizeFitnessEntries", () => {
  it("loads existing sessions unchanged", () => {
    const rows = [{ id: "1", date: "2026-09-28", activity: "Walking", durationMinutes: 30, notes: "" }];
    expect(normalizeFitnessEntries(rows)).toEqual(rows);
  });

  it("fills gaps and skips rows with no date", () => {
    const out = normalizeFitnessEntries([{ id: "2", date: "2026-09-29" }, { id: "3" }, null]);
    expect(out).toEqual([{ id: "2", date: "2026-09-29", activity: "", durationMinutes: 0, notes: "" }]);
  });
});

describe("week summary", () => {
  it("starts weeks on Monday", () => {
    expect(weekStartKey("2026-10-02")).toBe("2026-09-28"); // Friday
    expect(weekStartKey("2026-10-04")).toBe("2026-09-28"); // Sunday
    expect(weekStartKey("2026-09-28")).toBe("2026-09-28"); // Monday
  });

  it("totals sessions, minutes and active days in the current week", () => {
    const entries = normalizeFitnessEntries([
      { id: "a", date: "2026-09-27", activity: "Swim", durationMinutes: 60 },
      { id: "b", date: "2026-09-28", activity: "Walk", durationMinutes: 20 },
      { id: "c", date: "2026-09-28", activity: "Stretch", durationMinutes: 10 },
      { id: "d", date: "2026-10-02", activity: "Gym", durationMinutes: 45 },
    ]);
    expect(weekSummary(entries, "2026-10-02")).toEqual({
      start: "2026-09-28",
      end: "2026-10-04",
      sessions: 3,
      minutes: 75,
      activeDays: 2,
    });
  });

  it("formats dates in Australian order", () => {
    expect(formatFitnessDate("2026-08-31")).toBe("31/08/2026");
  });
});

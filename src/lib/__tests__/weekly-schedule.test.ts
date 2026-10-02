import { describe, expect, it } from "vitest";
import { copyDayInto, mondayOf, parseWeek } from "@/lib/weekly-schedule-storage";

describe("parseWeek", () => {
  it("loads saved weeks and fills in missing days", () => {
    const week = parseWeek({ mon: [{ id: "a", label: "Swim", icon: "🏊", done: true }] });
    expect(week.mon).toEqual([{ id: "a", label: "Swim", icon: "🏊", done: true }]);
    expect(week.sun).toEqual([]);
  });

  it("never throws on damaged data", () => {
    expect(parseWeek(null).mon).toEqual([]);
    expect(parseWeek({ tue: "x", wed: [null, { label: "" }] }).wed).toEqual([]);
  });
});

describe("mondayOf", () => {
  it("finds the Monday of the week", () => {
    expect(mondayOf(new Date(2026, 9, 2))).toBe("2026-09-28"); // Friday 2 Oct
    expect(mondayOf(new Date(2026, 9, 4))).toBe("2026-09-28"); // Sunday 4 Oct
    expect(mondayOf(new Date(2026, 9, 5))).toBe("2026-10-05"); // Monday 5 Oct
  });
});

describe("copyDayInto", () => {
  it("copies activities unticked with new ids, leaving the source alone", () => {
    const week = parseWeek({
      mon: [{ id: "a", label: "Swim", icon: "🏊", done: true }],
      tue: [{ id: "b", label: "Art", icon: "🎨", done: false }],
    });
    const next = copyDayInto(week, "mon", ["tue", "wed"]);
    expect(next.mon).toEqual(week.mon);
    expect(next.tue).toHaveLength(1);
    expect(next.tue[0].label).toBe("Swim");
    expect(next.tue[0].done).toBe(false);
    expect(next.tue[0].id).not.toBe("a");
    expect(next.wed[0].label).toBe("Swim");
  });
});

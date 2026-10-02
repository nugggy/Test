import { describe, expect, it } from "vitest";
import { countdownLabel, daysUntil, formatChangeDate } from "@/lib/change-preparation-data";
import { parseChangePrepEntries } from "@/lib/change-preparation-storage";

describe("daysUntil", () => {
  it("counts whole days, including across daylight saving", () => {
    expect(daysUntil("2026-10-05", "2026-10-02")).toBe(3);
    expect(daysUntil("2026-10-02", "2026-10-02")).toBe(0);
    expect(daysUntil("2026-09-30", "2026-10-02")).toBe(-2);
    // Sydney daylight saving starts 4 October 2026.
    expect(daysUntil("2026-10-06", "2026-10-03")).toBe(3);
    expect(daysUntil("", "2026-10-02")).toBeNull();
  });
});

describe("countdownLabel", () => {
  it("uses plain words", () => {
    expect(countdownLabel(0)).toBe("It's today");
    expect(countdownLabel(1)).toBe("Tomorrow. 1 sleep to go");
    expect(countdownLabel(5)).toBe("5 days to go (5 sleeps)");
    expect(countdownLabel(-3)).toBe("That was 3 days ago");
  });
});

describe("formatChangeDate", () => {
  it("writes the date the Australian way", () => {
    expect(formatChangeDate("2026-10-16")).toBe("Friday 16 October 2026");
  });
});

describe("parseChangePrepEntries", () => {
  it("loads saved plans and fills in missing lists", () => {
    const parsed = parseChangePrepEntries([{ id: "p", title: "Moving house", changeDate: "2026-11-01" }]);
    expect(parsed[0]).toMatchObject({
      id: "p",
      title: "Moving house",
      changeDate: "2026-11-01",
      whatsChanging: [],
      notes: "",
    });
    expect(parseChangePrepEntries("bad")).toEqual([]);
  });
});

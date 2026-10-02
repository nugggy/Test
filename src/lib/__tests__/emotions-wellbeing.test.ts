import { describe, expect, it } from "vitest";
import {
  countBy,
  dayKey,
  entriesInLastDays,
  formatDayKey,
  groupByRecentDays,
  recentDayKeys,
} from "../emotion-tracker-patterns";
import { normalisePlan, planHasContent, splitPhoneNumbers } from "../regulation-plan-data";
import {
  computeHoursSlept,
  formatSleepDate,
  normaliseSleepEntries,
  summariseRecentNights,
} from "../sleep-tracker-data";
import { normaliseSensoryNotes, sensoryNotesHaveContent } from "../sensory-needs-data";

const TZ = "Australia/Sydney";

describe("check-in patterns", () => {
  it("puts a timestamp on the local calendar day", () => {
    // 20:00 UTC on 1 Oct is 06:00 on 2 Oct in Sydney (AEST, before DST starts).
    expect(dayKey("2026-10-01T20:00:00.000Z", TZ)).toBe("2026-10-02");
  });

  it("lists recent days newest first without skipping across daylight saving", () => {
    // DST starts in Sydney on Sunday 4 October 2026.
    const now = new Date("2026-10-05T01:00:00.000Z");
    expect(recentDayKeys(3, TZ, now)).toEqual(["2026-10-05", "2026-10-04", "2026-10-03"]);
  });

  it("filters to the last N days and ignores bad timestamps", () => {
    const now = new Date("2026-10-02T02:00:00.000Z");
    const entries = [
      { id: "a", timestamp: "2026-10-01T23:00:00.000Z" },
      { id: "b", timestamp: "2026-09-01T23:00:00.000Z" },
      { id: "c", timestamp: "not a date" },
    ];
    expect(entriesInLastDays(entries, 7, TZ, now).map((e) => e.id)).toEqual(["a"]);
  });

  it("counts in a fixed order and leaves out zeros", () => {
    const entries = [{ k: "sad" }, { k: "happy" }, { k: "sad" }];
    expect(countBy(entries, (e) => e.k, ["happy", "sad", "angry"])).toEqual([
      { key: "happy", count: 1 },
      { key: "sad", count: 2 },
    ]);
  });

  it("groups by day including empty days", () => {
    const now = new Date("2026-10-02T02:00:00.000Z");
    const groups = groupByRecentDays(
      [
        { id: "late", timestamp: "2026-10-01T22:00:00.000Z" },
        { id: "early", timestamp: "2026-10-01T20:00:00.000Z" },
      ],
      2,
      TZ,
      now
    );
    expect(groups[0].day).toBe("2026-10-02");
    expect(groups[0].entries.map((e) => e.id)).toEqual(["early", "late"]);
    expect(groups[1].entries).toEqual([]);
  });

  it("formats day keys day-first", () => {
    expect(formatDayKey("2026-10-02")).toMatch(/^Fri,? 2 Oct$/);
  });
});

describe("regulation plan", () => {
  it("loads a version 1 plan and fills in the newer fields", () => {
    const v1 = {
      warningSigns: ["Pacing"],
      strategies: ["Deep breaths"],
      groundingTechniques: [],
      avoid: ["Loud noises"],
      supportPeople: ["Mum - 0412 345 678"],
      urgentHelpNotes: "Call 000",
    };
    const plan = normalisePlan(v1);
    expect(plan.warningSigns).toEqual(["Pacing"]);
    expect(plan.supportPeople).toEqual(["Mum - 0412 345 678"]);
    expect(plan.othersCanHelp).toEqual([]);
    expect(plan.name).toBe("");
    expect(planHasContent(plan)).toBe(true);
  });

  it("copes with missing or corrupted data", () => {
    expect(planHasContent(normalisePlan(null))).toBe(false);
    const plan = normalisePlan({ warningSigns: "oops", strategies: ["ok", 3] });
    expect(plan.warningSigns).toEqual([]);
    expect(plan.strategies).toEqual(["ok"]);
  });

  it("finds phone numbers in free text", () => {
    expect(splitPhoneNumbers("Mum - 0412 345 678")).toEqual([
      { text: "Mum - " },
      { text: "0412 345 678", tel: "0412345678" },
    ]);
    expect(splitPhoneNumbers("Lifeline 13 11 14 (24/7)")[1]).toEqual({
      text: "13 11 14",
      tel: "131114",
    });
    expect(splitPhoneNumbers("Office (02) 6555 1234")[1].tel).toBe("0265551234");
    expect(splitPhoneNumbers("+61 412 345 678")[0].tel).toBe("+61412345678");
  });

  it("leaves ordinary numbers alone", () => {
    expect(splitPhoneNumbers("Go outside for 5 minutes")).toEqual([
      { text: "Go outside for 5 minutes" },
    ]);
    expect(splitPhoneNumbers("Since 2026").every((s) => !s.tel)).toBe(true);
  });
});

describe("sleep tracker", () => {
  it("handles overnight sleep", () => {
    expect(computeHoursSlept("22:30", "06:30")).toBe(8);
  });

  it("formats entry dates day-first without timezone drift", () => {
    expect(formatSleepDate("2026-10-02")).toMatch(/^Fri,? 2 Oct 2026$/);
    expect(formatSleepDate("2026-10-02", { short: true })).toBe("2 Oct");
  });

  it("keeps old entries and adds no wake-up count", () => {
    const old = [
      { id: "1", date: "2026-10-01", bedTime: "22:00", wakeTime: "07:00", quality: 4, notes: "" },
      "junk",
      { date: "2026-09-30", bedTime: "23:00", wakeTime: "07:00" },
    ];
    const entries = normaliseSleepEntries(old);
    expect(entries).toHaveLength(2);
    expect(entries[0].wakeUps).toBeUndefined();
    expect(entries[1].quality).toBe(3);
    expect(entries[1].id).toBeTruthy();
    expect(normaliseSleepEntries("nope")).toEqual([]);
  });

  it("summarises recent nights", () => {
    const summary = summariseRecentNights([
      { id: "1", date: "2026-10-01", bedTime: "22:00", wakeTime: "06:00", quality: 4, notes: "", wakeUps: 2 },
      { id: "2", date: "2026-10-02", bedTime: "22:00", wakeTime: "07:00", quality: 2, notes: "" },
    ]);
    expect(summary).toEqual({ nights: 2, averageHours: 8.5, averageQuality: 3, averageWakeUps: 2 });
    expect(summariseRecentNights([])).toBeNull();
  });
});

describe("sensory needs", () => {
  it("loads a version 1 profile and adds an empty name", () => {
    const notes = normaliseSensoryNotes({ helps: { sound: ["Headphones"] }, overwhelms: {} });
    expect(notes.name).toBe("");
    expect(notes.helps.sound).toEqual(["Headphones"]);
    expect(sensoryNotesHaveContent(notes)).toBe(true);
    expect(sensoryNotesHaveContent(normaliseSensoryNotes(undefined))).toBe(false);
  });
});

import { describe, expect, it } from "vitest";
import {
  formatRecordDateTime,
  normalizeBehaviourEntries,
  partOfDay,
} from "../behaviour-tracking-storage";

describe("normalizeBehaviourEntries", () => {
  it("loads entries saved before the extra detail fields existed", () => {
    const [entry] = normalizeBehaviourEntries([
      {
        id: "abc-1",
        antecedent: "Loud noise",
        behaviour: "Shouting",
        consequence: "Given space/time",
        severity: 4,
        occurredAt: "2026-09-01T01:00:00.000Z",
      },
    ]);
    expect(entry).toEqual({
      id: "abc-1",
      antecedent: "Loud noise",
      behaviour: "Shouting",
      consequence: "Given space/time",
      severity: 4,
      occurredAt: "2026-09-01T01:00:00.000Z",
      durationMinutes: 0,
      setting: "",
      notes: "",
      recordedBy: "",
    });
  });

  it("keeps new fields when present", () => {
    const [entry] = normalizeBehaviourEntries([
      { id: "x", behaviour: "Crying", severity: 2, occurredAt: "2026-09-01T01:00:00.000Z", durationMinutes: 5, setting: "Home", notes: "n", recordedBy: "JS" },
    ]);
    expect(entry).toMatchObject({ durationMinutes: 5, setting: "Home", notes: "n", recordedBy: "JS" });
  });

  it("repairs an out-of-range severity rather than dropping the entry", () => {
    const [entry] = normalizeBehaviourEntries([{ id: "y", behaviour: "Refusal", severity: 9 }]);
    expect(entry.severity).toBe(3);
  });

  it("survives junk", () => {
    expect(normalizeBehaviourEntries(null)).toEqual([]);
    expect(normalizeBehaviourEntries([null, 4])).toEqual([]);
  });
});

describe("helpers", () => {
  it("groups hours into parts of the day", () => {
    expect(partOfDay(7)).toMatch(/^Morning/);
    expect(partOfDay(12)).toMatch(/^Afternoon/);
    expect(partOfDay(20)).toMatch(/^Evening/);
    expect(partOfDay(2)).toMatch(/^Night/);
  });

  it("formats dates in Australian order", () => {
    expect(formatRecordDateTime("2026-09-01T01:00:00.000Z", "Australia/Sydney")).toBe("01/09/2026 11:00");
  });
});

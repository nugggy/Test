import { describe, expect, it } from "vitest";
import {
  formatElapsed,
  formatRecordDateTime,
  normalizeEntry,
  normalizePlan,
  parseActiveTimer,
  planEmergencySeconds,
} from "../seizure-log-storage";

describe("normalizeEntry", () => {
  it("loads an early entry with only the original fields", () => {
    const entry = normalizeEntry({
      id: "1",
      occurredAt: "2026-05-01T02:00:00.000Z",
      seizureType: "Absence",
      durationSeconds: 20,
      trigger: "",
      whatHappened: "Stared",
      recovery: "",
      actionsTaken: ["None needed"],
      notes: "",
    });
    expect(entry).toMatchObject({
      id: "1",
      seizureType: "Absence",
      durationSeconds: 20,
      severity: "",
      consciousness: "",
      recoveryMinutes: 0,
      medicationDetail: "",
      actionsTaken: ["None needed"],
    });
  });

  it("copes with a non-array actionsTaken", () => {
    const entry = normalizeEntry({ id: "2", actionsTaken: "oops" as unknown as string[] });
    expect(entry.actionsTaken).toEqual([]);
  });
});

describe("parseActiveTimer", () => {
  it("accepts a saved timer", () => {
    expect(
      parseActiveTimer({ startedAt: "2026-10-02T00:00:00.000Z", events: [{ label: "x", at: "2026-10-02T00:01:00.000Z" }] })
    ).toEqual({ startedAt: "2026-10-02T00:00:00.000Z", events: [{ label: "x", at: "2026-10-02T00:01:00.000Z" }] });
  });

  it("rejects missing or broken data", () => {
    expect(parseActiveTimer(null)).toBeNull();
    expect(parseActiveTimer({ startedAt: "not a date" })).toBeNull();
  });

  it("drops malformed events but keeps the timer", () => {
    expect(parseActiveTimer({ startedAt: "2026-10-02T00:00:00.000Z", events: [5, { label: 1 }] })?.events).toEqual([]);
  });
});

describe("plan time", () => {
  it("is null until the person enters a number from their plan", () => {
    expect(planEmergencySeconds(normalizePlan(null))).toBeNull();
    expect(planEmergencySeconds({ emergencyMinutes: "", planSteps: "" })).toBeNull();
    expect(planEmergencySeconds({ emergencyMinutes: "abc", planSteps: "" })).toBeNull();
    expect(planEmergencySeconds({ emergencyMinutes: "0", planSteps: "" })).toBeNull();
  });

  it("converts entered minutes to seconds", () => {
    expect(planEmergencySeconds({ emergencyMinutes: "2.5", planSteps: "" })).toBe(150);
  });
});

describe("formatting", () => {
  it("formats elapsed time as m:ss", () => {
    expect(formatElapsed(0)).toBe("0:00");
    expect(formatElapsed(65)).toBe("1:05");
    expect(formatElapsed(-3)).toBe("0:00");
  });

  it("formats record times in Australian order, 24-hour", () => {
    expect(formatRecordDateTime("2026-08-31T05:07:00.000Z", "Australia/Sydney")).toBe("31/08/2026 15:07");
  });
});

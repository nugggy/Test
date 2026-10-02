import { describe, expect, it } from "vitest";
import {
  classifyReading,
  normalizeDiabetesPlan,
  planTargetRange,
} from "../diabetes-management-plan-storage";
import { formatRecordDateTime, normalizeGlucoseEntries } from "../diabetes-tracker-storage";

const plan = normalizeDiabetesPlan({
  targetLowMmol: "5",
  targetHighMmol: "9",
  emergencyLowMmol: "3",
  emergencyHighMmol: "15",
});

describe("classifyReading", () => {
  it("never classifies without a target range from the person's plan", () => {
    expect(classifyReading(2, normalizeDiabetesPlan({}))).toBeNull();
    expect(classifyReading(6, normalizeDiabetesPlan({ targetLowMmol: "5" }))).toBeNull();
  });

  it("ignores a range entered back to front", () => {
    expect(planTargetRange({ targetLowMmol: "9", targetHighMmol: "5" })).toBeNull();
  });

  it("uses only the numbers from the plan", () => {
    expect(classifyReading(2.9, plan)).toBe("emergency-low");
    expect(classifyReading(4.9, plan)).toBe("low");
    expect(classifyReading(5, plan)).toBe("in-range");
    expect(classifyReading(9, plan)).toBe("in-range");
    expect(classifyReading(9.1, plan)).toBe("high");
    expect(classifyReading(15.1, plan)).toBe("emergency-high");
  });

  it("works without emergency numbers", () => {
    const p = normalizeDiabetesPlan({ targetLowMmol: "5", targetHighMmol: "9" });
    expect(classifyReading(1, p)).toBe("low");
    expect(classifyReading(30, p)).toBe("high");
  });
});

describe("normalizeDiabetesPlan", () => {
  it("fills new fields for an old saved plan and keeps lists", () => {
    const p = normalizeDiabetesPlan({ targetLowMmol: "4", lowActionSteps: ["Step", 3] });
    expect(p.targetLowMmol).toBe("4");
    expect(p.lowActionSteps).toEqual(["Step"]);
    expect(p.sickDayRules).toEqual([]);
    expect(p.lastConfirmed).toBe("");
  });

  it("copes with junk", () => {
    expect(normalizeDiabetesPlan("x").targetHighMmol).toBe("");
  });
});

describe("normalizeGlucoseEntries", () => {
  it("keeps existing readings and fills gaps", () => {
    const [e] = normalizeGlucoseEntries([
      { id: "1", occurredAt: "2026-10-01T00:00:00.000Z", bglMmol: 6.5, insulinDose: 4 },
    ]);
    expect(e).toMatchObject({ id: "1", bglMmol: 6.5, insulinDose: "4", context: "", notes: "" });
  });

  it("skips rows without a usable reading", () => {
    expect(normalizeGlucoseEntries([{ id: "1" }, null])).toEqual([]);
    expect(normalizeGlucoseEntries({})).toEqual([]);
  });
});

describe("formatRecordDateTime", () => {
  it("uses Australian date order and 24-hour time", () => {
    expect(formatRecordDateTime("2026-01-15T09:30:00.000Z", "Australia/Sydney")).toBe("15/01/2026 20:30");
  });
});

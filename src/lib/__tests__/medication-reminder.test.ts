import { describe, expect, it } from "vitest";
import {
  addDaysToKey,
  applyRecordDose,
  computeAdherenceDays,
  dateKeyInTimezone,
  formatDateKey,
  normalizeLogEntries,
  normalizeMedications,
  type Medication,
} from "../medication-storage";

const SYD = "Australia/Sydney";

describe("normalizeMedications", () => {
  it("loads old medications and defaults asNeeded to false", () => {
    const meds = normalizeMedications([
      { id: "a", name: "Med A", dose: "1 tablet", times: ["20:00", "08:00"], notes: "" },
    ]);
    expect(meds).toEqual([
      { id: "a", name: "Med A", dose: "1 tablet", times: ["08:00", "20:00"], notes: "", asNeeded: false },
    ]);
  });

  it("ignores junk and bad times without dropping the medication", () => {
    const meds = normalizeMedications([null, 5, { id: "b", name: "B", times: ["8am", "09:30"] }]);
    expect(meds).toHaveLength(1);
    expect(meds[0].times).toEqual(["09:30"]);
    expect(meds[0].dose).toBe("");
  });

  it("returns an empty list for non-array data", () => {
    expect(normalizeMedications({})).toEqual([]);
  });
});

describe("normalizeLogEntries (migration of v1 entries)", () => {
  it("re-dates legacy entries to the local date of takenAt", () => {
    // 07:30 on 2 Oct in Sydney (AEST, UTC+10) is 21:30 UTC on 1 Oct, so the
    // old code filed it under 2026-10-01.
    const entries = normalizeLogEntries(
      [
        {
          id: "1",
          medicationId: "a",
          time: "08:00",
          date: "2026-10-01",
          takenAt: "2026-10-01T21:30:00.000Z",
        },
      ],
      SYD
    );
    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({
      id: "1",
      date: "2026-10-02",
      status: "taken",
      kind: "scheduled",
      reason: "",
      recordedBy: "",
      medicationName: "",
      doseText: "",
    });
  });

  it("keeps legacy afternoon entries on the same day", () => {
    const entries = normalizeLogEntries(
      [{ id: "1", medicationId: "a", time: "14:00", date: "2026-10-02", takenAt: "2026-10-02T04:05:00.000Z" }],
      SYD
    );
    expect(entries[0].date).toBe("2026-10-02");
  });

  it("keeps the earliest record when the repair creates a duplicate", () => {
    const entries = normalizeLogEntries(
      [
        { id: "late", medicationId: "a", time: "08:00", date: "2026-10-02", takenAt: "2026-10-02T03:00:00.000Z" },
        { id: "early", medicationId: "a", time: "08:00", date: "2026-10-01", takenAt: "2026-10-01T22:00:00.000Z" },
      ],
      SYD
    );
    expect(entries.map((e) => e.id)).toEqual(["early"]);
  });

  it("does not re-date entries saved by the new version", () => {
    const entries = normalizeLogEntries(
      [
        {
          id: "1",
          medicationId: "a",
          time: "08:00",
          date: "2026-09-30",
          takenAt: "2026-10-01T21:30:00.000Z",
          status: "not-taken",
          kind: "scheduled",
          reason: "Refused",
          recordedBy: "JS",
        },
      ],
      SYD
    );
    expect(entries[0]).toMatchObject({ date: "2026-09-30", status: "not-taken", reason: "Refused", recordedBy: "JS" });
  });

  it("keeps several as-needed doses on the same day", () => {
    const base = { medicationId: "p", time: "10:00", date: "2026-10-02", status: "taken", kind: "as-needed" };
    const entries = normalizeLogEntries(
      [
        { ...base, id: "1", takenAt: "2026-10-02T00:00:00.000Z" },
        { ...base, id: "2", takenAt: "2026-10-02T00:00:01.000Z" },
      ],
      SYD
    );
    expect(entries).toHaveLength(2);
  });

  it("skips unusable rows and survives non-array data", () => {
    expect(normalizeLogEntries("nope", SYD)).toEqual([]);
    expect(normalizeLogEntries([null, { id: "x" }], SYD)).toEqual([]);
  });
});

describe("applyRecordDose", () => {
  it("replaces an earlier record for the same scheduled dose", () => {
    const first = applyRecordDose([], { medicationId: "a", time: "08:00", date: "2026-10-02", status: "not-taken", reason: "Asleep" }, "1", "2026-10-01T22:00:00.000Z");
    const second = applyRecordDose(first, { medicationId: "a", time: "08:00", date: "2026-10-02", status: "taken" }, "2", "2026-10-01T23:00:00.000Z");
    expect(second).toHaveLength(1);
    expect(second[0]).toMatchObject({ id: "2", status: "taken", reason: "" });
  });

  it("adds as-needed doses without replacing", () => {
    const input = { medicationId: "p", time: "10:00", date: "2026-10-02", status: "taken" as const, kind: "as-needed" as const };
    const log = applyRecordDose(applyRecordDose([], input, "1", "x"), input, "2", "y");
    expect(log).toHaveLength(2);
  });
});

describe("computeAdherenceDays", () => {
  const meds: Medication[] = [
    { id: "a", name: "A", dose: "", times: ["08:00", "20:00"], notes: "", asNeeded: false },
    { id: "p", name: "PRN", dose: "", times: [], notes: "", asNeeded: true },
  ];

  it("only expects today's doses whose time has passed, and ignores as-needed", () => {
    const log = applyRecordDose([], { medicationId: "a", time: "08:00", date: "2026-10-02", status: "taken" }, "1", "x");
    const days = computeAdherenceDays(meds, log, "2026-10-02", "12:00", 2);
    expect(days[0]).toMatchObject({ key: "2026-10-01", expectedCount: 2, takenCount: 0, missedCount: 2 });
    expect(days[1]).toMatchObject({ key: "2026-10-02", expectedCount: 1, takenCount: 1, missedCount: 0 });
  });

  it("counts not-taken records as missed and reports them separately", () => {
    const log = applyRecordDose([], { medicationId: "a", time: "08:00", date: "2026-10-01", status: "not-taken" }, "1", "x");
    const [day] = computeAdherenceDays(meds, log, "2026-10-02", "00:00", 2);
    expect(day).toMatchObject({ takenCount: 0, notTakenCount: 1, missedCount: 2 });
  });
});

describe("date helpers", () => {
  it("adds days across month ends", () => {
    expect(addDaysToKey("2026-10-01", -1)).toBe("2026-09-30");
    expect(addDaysToKey("2026-12-31", 1)).toBe("2027-01-01");
  });

  it("formats keys in Australian order", () => {
    expect(formatDateKey("2026-08-31")).toBe("31/08/2026");
  });

  it("works out the local date in a timezone", () => {
    expect(dateKeyInTimezone(new Date("2026-10-01T21:30:00Z"), SYD)).toBe("2026-10-02");
  });
});

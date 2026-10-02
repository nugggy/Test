import { describe, expect, it } from "vitest";
import {
  daysBetween,
  EMPTY_PREP,
  formatDayAU,
  hasAnyContent,
  normaliseMeetingPrep,
} from "../ndis-meeting-prep-storage";
import { normaliseSupportPlan, planHasContent } from "../support-plan-storage";
import { normaliseComplianceNotes, sortNoticed } from "../ndis-compliance-storage";
import { telHref } from "../know-your-rights-data";

describe("NDIS meeting prep storage", () => {
  it("loads v1 data saved before name/priorities existed", () => {
    const old = {
      meetingDate: "2026-11-05",
      workingWell: ["My therapy helps"],
      documentsToBring: [{ id: "a", text: "My plan", done: true }],
    };
    const prep = normaliseMeetingPrep(old);
    expect(prep.participantName).toBe("");
    expect(prep.topPriorities).toEqual([]);
    expect(prep.meetingDate).toBe("2026-11-05");
    expect(prep.workingWell).toEqual(["My therapy helps"]);
    expect(prep.documentsToBring).toEqual([{ id: "a", text: "My plan", done: true }]);
  });

  it("survives broken or missing data", () => {
    expect(normaliseMeetingPrep(null)).toEqual(EMPTY_PREP);
    const prep = normaliseMeetingPrep({ workingWell: "oops", notWorking: [1, "ok"] });
    expect(prep.workingWell).toEqual([]);
    expect(prep.notWorking).toEqual(["ok"]);
  });

  it("formats dates the Australian way", () => {
    expect(formatDayAU("2026-08-31")).toBe("31 August 2026");
    expect(formatDayAU("")).toBe("");
    expect(formatDayAU("2026-02-30")).toBe("");
  });

  it("counts days to the meeting", () => {
    expect(daysBetween("2026-10-02", "2026-10-09")).toBe(7);
    expect(daysBetween("2026-10-02", "2026-10-01")).toBe(-1);
    expect(daysBetween("", "2026-10-01")).toBeNull();
  });

  it("knows when there is nothing to summarise", () => {
    expect(hasAnyContent(EMPTY_PREP)).toBe(false);
    expect(hasAnyContent({ ...EMPTY_PREP, topPriorities: ["x"] })).toBe(true);
  });
});

describe("Support plan storage", () => {
  it("loads v1 data and adds new fields with defaults", () => {
    const plan = normaliseSupportPlan({ aboutMe: "I love dogs", goals: ["Get a job"] });
    expect(plan.aboutMe).toBe("I love dogs");
    expect(plan.goals).toEqual(["Get a job"]);
    expect(plan.name).toBe("");
    expect(plan.importantToMe).toEqual([]);
    expect(plan.howToSupportMe).toEqual([]);
    expect(plan.updatedAt).toBe("");
    expect(planHasContent(plan)).toBe(true);
    expect(planHasContent(normaliseSupportPlan(undefined))).toBe(false);
  });
});

describe("NDIS compliance storage", () => {
  it("keeps old undated notes when loading", () => {
    const notes = normaliseComplianceNotes({
      thingsIveNoticed: ["Charged with no notice"],
      questionsForProvider: ["What is your policy?"],
    });
    expect(notes.thingsIveNoticed).toEqual([
      { id: "legacy-0", date: "", text: "Charged with no notice" },
    ]);
    expect(notes.questionsForProvider).toEqual(["What is your policy?"]);
    expect(notes.checklist).toEqual([]);
  });

  it("sorts newest first with undated notes last", () => {
    const sorted = sortNoticed([
      { id: "old", date: "", text: "a" },
      { id: "1", date: "2026-01-01", text: "b" },
      { id: "2", date: "2026-03-01", text: "c" },
    ]);
    expect(sorted.map((e) => e.id)).toEqual(["2", "1", "old"]);
  });
});

describe("Know your rights", () => {
  it("builds tel links without spaces", () => {
    expect(telHref("1800 035 544")).toBe("tel:1800035544");
    expect(telHref("000")).toBe("tel:000");
  });
});

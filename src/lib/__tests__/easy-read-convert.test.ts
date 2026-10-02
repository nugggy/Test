import { describe, expect, it } from "vitest";
import { convertToEasyRead, splitIntoSentences } from "../easy-read-convert";
import { parseDraft } from "../easy-read-storage";

describe("splitIntoSentences", () => {
  it("treats every line and bullet point as its own idea", () => {
    expect(splitIntoSentences("Bring these:\n- Your Medicare card\n- Your plan\n1. Arrive early")).toEqual([
      "Bring these:",
      "Your Medicare card",
      "Your plan",
      "Arrive early",
    ]);
  });

  it("does not break sentences at common abbreviations", () => {
    expect(splitIntoSentences("See Dr. Smith on Monday. Bring snacks, e.g. fruit.")).toEqual([
      "See Dr. Smith on Monday.",
      "Bring snacks, e.g. fruit.",
    ]);
  });
});

describe("convertToEasyRead", () => {
  it("swaps hard words for simple ones", () => {
    const [point] = convertToEasyRead("We require additional information.");
    expect(point.text).toBe("We need more information.");
  });

  it("does not chop short 'and' phrases out of a long sentence", () => {
    const result = convertToEasyRead(
      "On Friday we will have fish and chips at the park near the big lake with everyone."
    );
    expect(result.map((p) => p.text).some((t) => t === "Chips at the park near the big lake with everyone.")).toBe(false);
  });

  it("splits on 'and' when a new clause starts", () => {
    const result = convertToEasyRead(
      "Please bring your NDIS plan to the meeting on Tuesday and we will talk about your goals."
    );
    expect(result.map((p) => p.text)).toEqual([
      "Please bring your NDIS plan to the meeting on Tuesday.",
      "We will talk about your goals.",
    ]);
  });

  it("splits a long sentence where both halves make sense", () => {
    const result = convertToEasyRead(
      "Your support worker will arrive at nine in the morning because the appointment starts at ten."
    );
    expect(result.length).toBe(2);
    expect(result[1].text).toBe("The appointment starts at ten.");
  });

  it("adds a full stop and capital letter to each line", () => {
    expect(convertToEasyRead("- bring your hat")[0].text).toBe("Bring your hat.");
  });
});

describe("parseDraft", () => {
  it("returns an empty draft for missing or broken data", () => {
    expect(parseDraft(null)).toEqual({ input: "", lines: [] });
    expect(parseDraft("nope")).toEqual({ input: "", lines: [] });
  });

  it("keeps good lines and fills in missing fields", () => {
    const draft = parseDraft({ input: "hi", lines: [{ id: "a", text: "Hello.", emoji: "👋" }, { text: 5 }, null] });
    expect(draft.input).toBe("hi");
    expect(draft.lines).toHaveLength(2);
    expect(draft.lines[0]).toEqual({ id: "a", text: "Hello.", emoji: "👋" });
    expect(draft.lines[1].text).toBe("");
    expect(draft.lines[1].emoji).toBeNull();
  });
});

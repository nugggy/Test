import { describe, expect, it } from "vitest";
import { parseSequences } from "../task-sequencing-storage";

describe("parseSequences", () => {
  it("loads data saved by the earlier version unchanged", () => {
    const saved = [
      {
        id: "seq-1",
        name: "Brushing teeth",
        steps: [{ id: "s1", label: "Wet the brush", emoji: "💧", done: true }],
      },
    ];
    expect(parseSequences(saved)).toEqual(saved);
  });

  it("fills in missing fields instead of crashing", () => {
    const [seq] = parseSequences([{ steps: [{ label: "Step" }, null] }]);
    expect(seq.name).toBe("My task");
    expect(seq.steps).toHaveLength(1);
    expect(seq.steps[0]).toMatchObject({ label: "Step", emoji: "✨", done: false });
  });

  it("returns an empty list for non-array data", () => {
    expect(parseSequences({})).toEqual([]);
    expect(parseSequences(null)).toEqual([]);
  });
});

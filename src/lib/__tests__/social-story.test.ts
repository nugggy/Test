import { describe, expect, it } from "vitest";
import { parseStories } from "../social-story-storage";
import { STORY_TEMPLATES } from "../social-story-templates";

describe("parseStories", () => {
  it("loads data saved by the earlier version unchanged", () => {
    const saved = [
      {
        id: "story-1",
        title: "Going to the dentist",
        pages: [{ id: "p1", emoji: "🦷", text: "I am going to the dentist." }],
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-02T00:00:00.000Z",
      },
    ];
    expect(parseStories(saved)).toEqual(saved);
  });

  it("fills in missing fields instead of crashing", () => {
    const [story] = parseStories([{ title: "Hi", pages: [{ text: "Hello" }, 3] }]);
    expect(story.title).toBe("Hi");
    expect(story.pages).toHaveLength(1);
    expect(story.pages[0]).toMatchObject({ text: "Hello", emoji: "📖" });
    expect(typeof story.createdAt).toBe("string");
  });

  it("returns an empty list for broken data", () => {
    expect(parseStories("oops")).toEqual([]);
  });
});

describe("STORY_TEMPLATES", () => {
  it("every template has a title and pages with words", () => {
    for (const template of STORY_TEMPLATES) {
      expect(template.title).not.toBe("");
      expect(template.pages.length).toBeGreaterThan(2);
      for (const page of template.pages) expect(page.text.trim()).not.toBe("");
    }
  });
});

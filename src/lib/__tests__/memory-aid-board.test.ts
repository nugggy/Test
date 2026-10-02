import { describe, expect, it } from "vitest";
import { parseRemindersState, rollOverIfNewDay } from "@/lib/memory-aid-storage";
import { currentTimeOfDay } from "@/lib/memory-aid-data";

describe("parseRemindersState", () => {
  it("loads data saved by the earlier version unchanged", () => {
    const saved = {
      reminders: [
        { id: "a", label: "Take tablets", emoji: "💊", timeOfDay: "morning", done: true },
      ],
      lastResetDate: "2026-10-01",
    };
    expect(parseRemindersState(saved)).toEqual(saved);
  });

  it("never throws on damaged data and keeps what it can", () => {
    expect(parseRemindersState(null).reminders).toEqual([]);
    expect(parseRemindersState("oops").reminders).toEqual([]);
    const parsed = parseRemindersState({
      reminders: [null, { label: "Feed cat", timeOfDay: "lunch" }, { label: "" }],
    });
    expect(parsed.reminders).toHaveLength(1);
    expect(parsed.reminders[0].label).toBe("Feed cat");
    expect(parsed.reminders[0].timeOfDay).toBe("anytime");
    expect(parsed.reminders[0].done).toBe(false);
  });
});

describe("rollOverIfNewDay", () => {
  const state = {
    reminders: [{ id: "a", label: "Walk", emoji: "🚶", timeOfDay: "anytime" as const, done: true }],
    lastResetDate: "2026-10-01",
  };

  it("keeps ticks on the same day", () => {
    expect(rollOverIfNewDay(state, "2026-10-01")).toBe(state);
  });

  it("clears ticks but keeps reminders on a new day", () => {
    const next = rollOverIfNewDay(state, "2026-10-02");
    expect(next.lastResetDate).toBe("2026-10-02");
    expect(next.reminders).toHaveLength(1);
    expect(next.reminders[0].done).toBe(false);
  });
});

describe("currentTimeOfDay", () => {
  it("maps hours to groups", () => {
    expect(currentTimeOfDay(3)).toBeNull();
    expect(currentTimeOfDay(7)).toBe("morning");
    expect(currentTimeOfDay(13)).toBe("afternoon");
    expect(currentTimeOfDay(19)).toBe("evening");
  });
});

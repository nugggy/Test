"use client";

import { useState } from "react";
import { EMOTIONS, INTENSITY_LEVELS } from "@/lib/emotion-tracker-data";
import type { EmotionLogEntry } from "@/lib/emotion-tracker-storage";
import {
  countBy,
  entriesInLastDays,
  formatDayKey,
  groupByRecentDays,
} from "@/lib/emotion-tracker-patterns";
import { formatTime } from "@/lib/datetime";
import { useTimezone } from "@/lib/timezone-context";
import CategoryBreakdownChart from "@/components/CategoryBreakdownChart";

const RANGES = [
  { days: 7, label: "Last 7 days" },
  { days: 30, label: "Last 30 days" },
];

export default function EmotionPatterns({ entries }: { entries: EmotionLogEntry[] }) {
  const { timezone } = useTimezone();
  const [days, setDays] = useState(7);

  const inRange = entriesInLastDays(entries, days, timezone);
  const counts = countBy(
    inRange,
    (e) => e.emotionId,
    EMOTIONS.map((e) => e.id)
  );
  const week = groupByRecentDays(entries, 7, timezone);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <div role="group" aria-label="Time range" className="no-print mb-3 flex flex-wrap gap-2">
          {RANGES.map((range) => (
            <button
              key={range.days}
              type="button"
              onClick={() => setDays(range.days)}
              aria-pressed={days === range.days}
              className={`touch-target rounded-xl border-2 px-4 text-sm font-semibold ${
                days === range.days
                  ? "border-brand bg-brand text-brand-ink"
                  : "border-border bg-background"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
        <h3 className="mb-2 font-semibold">
          Feelings logged in the {days === 7 ? "last 7 days" : "last 30 days"}
          {inRange.length > 0 ? ` (${inRange.length} check-ins)` : ""}
        </h3>
        <CategoryBreakdownChart
          unit="time"
          emptyMessage="No check-ins in this time yet."
          data={counts.map(({ key, count }) => {
            const emotion = EMOTIONS.find((e) => e.id === key);
            return {
              label: `${emotion?.emoji ?? ""} ${emotion?.label ?? key}`,
              count,
              color: emotion ? `var(--${emotion.colorVar})` : undefined,
              ariaLabel: `${emotion?.label ?? key}: ${count} ${count === 1 ? "time" : "times"}`,
            };
          })}
        />
      </div>

      <div>
        <h3 className="mb-2 font-semibold">Day by day (last 7 days)</h3>
        <ul className="flex flex-col gap-2">
          {week.map(({ day, entries: dayEntries }) => (
            <li
              key={day}
              className="print-avoid-break flex flex-col gap-2 rounded-xl border-2 border-border bg-background p-3 sm:flex-row sm:items-center"
            >
              <span className="w-28 shrink-0 text-sm font-semibold">{formatDayKey(day)}</span>
              {dayEntries.length === 0 ? (
                <span className="text-sm text-muted">No check-ins</span>
              ) : (
                <ul className="flex flex-wrap gap-1.5">
                  {dayEntries.map((entry) => {
                    const emotion = EMOTIONS.find((e) => e.id === entry.emotionId);
                    const intensity = INTENSITY_LEVELS.find((l) => l.value === entry.intensity);
                    // Text stays on the normal surface colour for contrast;
                    // the emotion colour is used for the border only.
                    return (
                      <li
                        key={entry.id}
                        className="rounded-full border-2 border-border bg-surface px-2.5 py-0.5 text-sm font-semibold"
                        style={emotion ? { borderColor: `var(--${emotion.colorVar})` } : undefined}
                      >
                        <span aria-hidden="true">{emotion?.emoji ?? "🙂"} </span>
                        {emotion?.label ?? "Unknown"}
                        {intensity ? `, ${intensity.label.toLowerCase()}` : ""}
                        <span className="font-normal"> {formatTime(entry.timestamp, timezone)}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

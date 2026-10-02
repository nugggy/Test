"use client";

import { EMOTIONS, INTENSITY_LEVELS } from "@/lib/emotion-tracker-data";
import type { EmotionLogEntry } from "@/lib/emotion-tracker-storage";
import { formatDateTime } from "@/lib/datetime";
import { useTimezone } from "@/lib/timezone-context";

interface EmotionHistoryProps {
  entries: EmotionLogEntry[];
  onRemove: (id: string) => void;
}


export default function EmotionHistory({
  entries,
  onRemove,
}: EmotionHistoryProps) {
  const { timezone } = useTimezone();

  if (entries.length === 0) {
    return (
      <p className="rounded-xl border-2 border-dashed border-border p-6 text-center text-muted">
        No check-ins yet - choose an emotion above to log your first one.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {entries.map((entry) => {
        const emotion = EMOTIONS.find((e) => e.id === entry.emotionId);
        return (
          <li
            key={entry.id}
            className="flex items-start gap-3 rounded-xl border-2 border-border bg-background p-3"
          >
            <span aria-hidden="true" className="shrink-0 text-2xl">
              {emotion?.emoji ?? "🙂"}
            </span>
            <div className="flex-1">
              <p className="font-semibold">
                {emotion?.label ?? "Unknown"}{" "}
                <span className="font-normal text-muted">
                  · {INTENSITY_LEVELS.find((l) => l.value === entry.intensity)?.label ?? ""}
                </span>
              </p>
              {entry.note && (
                <p className="mt-0.5 text-sm text-muted">{entry.note}</p>
              )}
              <p className="mt-0.5 text-xs text-muted">
                {formatDateTime(entry.timestamp, timezone)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onRemove(entry.id)}
              aria-label={`Delete this ${emotion?.label ?? ""} check-in`}
              className="no-print touch-target grid shrink-0 place-items-center rounded-xl border-2 border-border bg-surface"
            >
              <span aria-hidden="true">🗑️</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

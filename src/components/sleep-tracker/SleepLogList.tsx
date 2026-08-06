"use client";

import type { SleepEntry } from "@/lib/sleep-tracker-storage";
import { QUALITY_LEVELS, computeHoursSlept } from "@/lib/sleep-tracker-data";

interface SleepLogListProps {
  entries: SleepEntry[];
  onRemove: (id: string) => void;
}

export default function SleepLogList({ entries, onRemove }: SleepLogListProps) {
  if (entries.length === 0) {
    return (
      <p className="rounded-xl border-2 border-dashed border-border p-6 text-center text-muted">
        No entries yet — use the form above to log last night&apos;s sleep.
      </p>
    );
  }

  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <ul className="flex flex-col gap-2">
      {sorted.map((entry) => {
        const level = QUALITY_LEVELS.find((l) => l.value === entry.quality);
        const hours = computeHoursSlept(entry.bedTime, entry.wakeTime);
        return (
          <li
            key={entry.id}
            className="print-avoid-break rounded-xl border-2 border-border bg-background p-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="font-semibold">{entry.date}</span>
                <span className="ml-2 text-sm text-muted">
                  {entry.bedTime} – {entry.wakeTime} ({hours}h) {level?.emoji}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onRemove(entry.id)}
                aria-label="Delete this entry"
                className="no-print grid h-9 w-9 shrink-0 place-items-center rounded-lg border-2 border-border bg-surface"
              >
                <span aria-hidden="true">🗑️</span>
              </button>
            </div>
            {entry.notes && <p className="mt-1 text-sm text-muted">{entry.notes}</p>}
          </li>
        );
      })}
    </ul>
  );
}

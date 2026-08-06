"use client";

import type { FitnessLogEntry } from "@/lib/fitness-log-storage";

interface FitnessLogListProps {
  entries: FitnessLogEntry[];
  onRemove: (id: string) => void;
}

export default function FitnessLogList({ entries, onRemove }: FitnessLogListProps) {
  if (entries.length === 0) {
    return (
      <p className="rounded-xl border-2 border-dashed border-border p-6 text-center text-muted">
        No sessions logged yet - use the form above to log the first one.
      </p>
    );
  }

  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <ul className="flex flex-col gap-2">
      {sorted.map((entry) => (
        <li
          key={entry.id}
          className="print-avoid-break flex items-start justify-between gap-2 rounded-xl border-2 border-border bg-background p-3"
        >
          <div>
            <span className="font-semibold">{entry.activity}</span>
            <span className="ml-2 text-sm text-muted">
              {entry.durationMinutes} min - {entry.date}
            </span>
            {entry.notes && <p className="mt-1 text-sm">{entry.notes}</p>}
          </div>
          <button
            type="button"
            onClick={() => onRemove(entry.id)}
            aria-label="Delete this entry"
            className="no-print grid h-9 w-9 shrink-0 place-items-center rounded-lg border-2 border-border bg-surface"
          >
            <span aria-hidden="true">🗑️</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

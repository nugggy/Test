"use client";

import type { SeizureLogEntry } from "@/lib/seizure-log-storage";
import { formatDateTime } from "@/lib/datetime";
import { useTimezone } from "@/lib/timezone-context";

interface SeizureLogListProps {
  entries: SeizureLogEntry[];
  onRemove: (id: string) => void;
}

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) return `${seconds}s`;
  return `${minutes}m ${seconds}s`;
}

export default function SeizureLogList({ entries, onRemove }: SeizureLogListProps) {
  const { timezone } = useTimezone();

  if (entries.length === 0) {
    return (
      <p className="rounded-xl border-2 border-dashed border-border p-6 text-center text-muted">
        No entries yet — use the form above to log the first one.
      </p>
    );
  }

  const sorted = [...entries].sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));

  return (
    <ul className="flex flex-col gap-2">
      {sorted.map((entry) => (
        <li
          key={entry.id}
          className="print-avoid-break rounded-xl border-2 border-border bg-background p-3"
        >
          <div className="mb-1 flex items-start justify-between gap-2">
            <div>
              <span className="font-semibold">{entry.seizureType}</span>
              {entry.durationSeconds > 0 && (
                <span className="ml-2 text-sm text-muted">
                  {formatDuration(entry.durationSeconds)}
                </span>
              )}
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
          {entry.trigger && (
            <p className="text-sm text-muted">
              Possible trigger: {entry.trigger}
              {entry.triggerReason && ` — ${entry.triggerReason}`}
            </p>
          )}
          {entry.whatHappened && <p className="mt-1 text-sm">{entry.whatHappened}</p>}
          {entry.recovery && (
            <p className="mt-1 text-sm text-muted">Recovery: {entry.recovery}</p>
          )}
          {entry.actionsTaken.length > 0 && (
            <p className="mt-1 text-xs text-muted">
              Actions: {entry.actionsTaken.join(", ")}
            </p>
          )}
          {entry.notes && <p className="mt-1 text-sm text-muted">{entry.notes}</p>}
          <p className="mt-1 text-xs text-muted">
            {formatDateTime(entry.occurredAt, timezone)}
          </p>
        </li>
      ))}
    </ul>
  );
}

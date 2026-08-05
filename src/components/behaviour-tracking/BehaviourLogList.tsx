"use client";

import { SEVERITY_LEVELS } from "@/lib/behaviour-tracking-data";
import type { BehaviourLogEntry } from "@/lib/behaviour-tracking-storage";
import { formatDateTime } from "@/lib/datetime";
import { useTimezone } from "@/lib/timezone-context";

interface BehaviourLogListProps {
  entries: BehaviourLogEntry[];
  onRemove: (id: string) => void;
}

export default function BehaviourLogList({
  entries,
  onRemove,
}: BehaviourLogListProps) {
  const { timezone } = useTimezone();

  if (entries.length === 0) {
    return (
      <p className="rounded-xl border-2 border-dashed border-border p-6 text-center text-muted">
        No entries yet — use the form above to log the first one.
      </p>
    );
  }

  const sorted = [...entries].sort((a, b) =>
    b.occurredAt.localeCompare(a.occurredAt)
  );

  return (
    <ul className="flex flex-col gap-2">
      {sorted.map((entry) => {
        const level = SEVERITY_LEVELS.find((l) => l.value === entry.severity);
        return (
          <li
            key={entry.id}
            className="rounded-xl border-2 border-border bg-background p-3"
          >
            <div className="mb-1 flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 border-black/10 text-sm font-bold"
                  style={{ background: `var(--${level?.colorVar ?? "sev-3"})` }}
                  aria-label={`Severity ${entry.severity}, ${level?.label ?? ""}`}
                >
                  {entry.severity}
                </span>
                <span className="font-semibold">
                  {entry.behaviour || "(behaviour not specified)"}
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
            {(entry.antecedent || entry.consequence) && (
              <p className="text-sm text-muted">
                {entry.antecedent && <>Before: {entry.antecedent}. </>}
                {entry.consequence && <>After: {entry.consequence}.</>}
              </p>
            )}
            <p className="mt-1 text-xs text-muted">
              {formatDateTime(entry.occurredAt, timezone)}
            </p>
          </li>
        );
      })}
    </ul>
  );
}

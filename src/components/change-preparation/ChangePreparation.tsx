"use client";

import { useState } from "react";
import { useChangePrepEntries } from "@/lib/change-preparation-storage";
import { countdownLabel, daysUntil, formatChangeDate } from "@/lib/change-preparation-data";
import { getTodayDateString } from "@/lib/datetime";
import { useTimezone } from "@/lib/timezone-context";
import ChangePrepEntryEditor from "./ChangePrepEntryEditor";

export default function ChangePreparation() {
  const { entries, addEntry, updateEntry, removeEntry } = useChangePrepEntries();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const { timezone } = useTimezone();
  const today = getTodayDateString(timezone);

  const selected = entries.find((entry) => entry.id === selectedId) ?? null;

  // Soonest upcoming change first, then plans with no date yet, then ones
  // that have already happened (most recent first).
  const sorted = [...entries].sort((a, b) => {
    const da = daysUntil(a.changeDate, today);
    const db = daysUntil(b.changeDate, today);
    const rank = (d: number | null) => (d === null ? 1 : d < 0 ? 2 : 0);
    if (rank(da) !== rank(db)) return rank(da) - rank(db);
    if (da === null || db === null) return 0;
    return rank(da) === 2 ? db - da : da - db;
  });

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const id = addEntry(newTitle);
    if (id) {
      setSelectedId(id);
      setNewTitle("");
    }
  }

  if (selected) {
    return (
      <ChangePrepEntryEditor
        entry={selected}
        onUpdate={(key, value) => updateEntry(selected.id, key, value)}
        onRemove={() => {
          removeEntry(selected.id);
          setSelectedId(null);
        }}
        onClose={() => setSelectedId(null)}
      />
    );
  }

  return (
    <div className="rounded-2xl border-2 border-border bg-surface p-4">
      <h2 className="font-display mb-3 text-lg font-bold">My plans</h2>
      {entries.length === 0 ? (
        <p className="mb-3 rounded-xl border-2 border-dashed border-border p-6 text-center text-muted">
          No plans yet. Add your first upcoming change below, e.g.
          &quot;Moving house&quot; or &quot;Starting a new school&quot;.
        </p>
      ) : (
        <ul className="mb-3 flex flex-col gap-2">
          {sorted.map((entry) => {
            const label = countdownLabel(daysUntil(entry.changeDate, today));
            return (
              <li key={entry.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(entry.id)}
                  className="touch-target flex w-full flex-wrap items-center justify-between gap-2 rounded-xl border-2 border-border bg-background px-4 py-2 text-left hover:border-brand"
                >
                  <span className="font-semibold">{entry.title}</span>
                  {entry.changeDate ? (
                    <span className="text-sm">
                      <span className="text-muted">{formatChangeDate(entry.changeDate)}</span>
                      {label && <span className="ml-2 font-bold">{label}</span>}
                    </span>
                  ) : (
                    <span className="text-sm text-muted">No date yet</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <form onSubmit={handleCreate} className="flex flex-wrap gap-2">
        <label htmlFor="new-change-title" className="sr-only">
          New plan name
        </label>
        <input
          id="new-change-title"
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="e.g. Moving house"
          maxLength={80}
          className="touch-target min-w-0 flex-1 rounded-xl border-2 border-border bg-background px-4"
        />
        <button
          type="submit"
          className="touch-target shrink-0 rounded-xl border-2 border-brand bg-brand px-4 font-semibold text-brand-ink"
        >
          + New plan
        </button>
      </form>
    </div>
  );
}

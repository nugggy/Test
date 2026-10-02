"use client";

import { useState } from "react";
import { sortNoticed, type NoticedEntry } from "@/lib/ndis-compliance-storage";
import { formatDayAU } from "@/lib/ndis-meeting-prep-storage";
import { getTodayDateString } from "@/lib/datetime";
import { useTimezone } from "@/lib/timezone-context";

interface NoticedLogProps {
  entries: NoticedEntry[];
  onChange: (entries: NoticedEntry[]) => void;
}

function makeId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/**
 * A private, dated record of concerns. Dates matter here: if someone later
 * raises a concern with a provider or the NDIS Commission, "what happened
 * and when" is the first thing they will be asked.
 */
export default function NoticedLog({ entries, onChange }: NoticedLogProps) {
  const { timezone } = useTimezone();
  const [date, setDate] = useState("");
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    const entryDate = date || getTodayDateString(timezone);
    onChange([...entries, { id: makeId(), date: entryDate, text: trimmed }]);
    setText("");
    setDate("");
    setStatus(`Saved a note for ${formatDayAU(entryDate)}.`);
  }

  function handleRemove(entry: NoticedEntry) {
    if (!window.confirm("Delete this note? This can't be undone.")) return;
    onChange(entries.filter((e) => e.id !== entry.id));
    setStatus("Note deleted.");
  }

  const sorted = sortNoticed(entries);

  return (
    <div className="print-avoid-break rounded-2xl border-2 border-border bg-surface p-4">
      <h2 className="font-display text-lg font-bold">Things I&apos;ve noticed</h2>
      <p className="mb-3 text-sm text-muted">
        A private, dated record for yourself of anything that concerned you.
        Write what happened, who was there, and what was said. This is useful
        if you decide to raise it later.
      </p>

      {sorted.length > 0 && (
        <ul className="mb-3 flex flex-col gap-2">
          {sorted.map((entry) => (
            <li
              key={entry.id}
              className="print-avoid-break flex items-start gap-2 rounded-xl border-2 border-border bg-background p-3"
            >
              <div className="flex-1">
                <p className="text-sm font-semibold">
                  {entry.date ? formatDayAU(entry.date) : "No date recorded"}
                </p>
                <p className="whitespace-pre-line text-sm">{entry.text}</p>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(entry)}
                className="no-print touch-target shrink-0 rounded-xl border-2 border-border bg-surface px-3 text-sm font-semibold"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="no-print flex flex-col gap-3">
        <label className="text-sm">
          <span className="mb-1 block font-semibold">When did it happen?</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="touch-target w-full rounded-xl border-2 border-border bg-background px-3 sm:w-auto"
          />
          <span className="mt-1 block text-muted">Leave blank to use today&apos;s date.</span>
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-semibold">What happened?</span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            maxLength={1000}
            placeholder="e.g. Charged a cancellation fee even though I gave 3 days' notice"
            className="w-full rounded-xl border-2 border-border bg-background px-4 py-3 text-base"
          />
        </label>
        <button
          type="submit"
          className="touch-target self-start rounded-xl border-2 border-brand bg-brand px-5 font-semibold text-brand-ink"
        >
          Save note
        </button>
      </form>
      <p aria-live="polite" className="sr-only">
        {status}
      </p>
    </div>
  );
}

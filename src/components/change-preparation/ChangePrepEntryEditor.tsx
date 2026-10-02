"use client";

import { useId } from "react";
import type { ChangePrepEntry } from "@/lib/change-preparation-storage";
import { getTodayDateString } from "@/lib/datetime";
import { useTimezone } from "@/lib/timezone-context";
import ChecklistSection, { type ChecklistItem } from "@/components/ChecklistSection";
import PrintButton from "@/components/PrintButton";
import {
  CHANGING_SUGGESTIONS,
  STAYING_SUGGESTIONS,
  HELP_SUGGESTIONS,
  countdownLabel,
  daysUntil,
  formatChangeDate,
} from "@/lib/change-preparation-data";

interface ChangePrepEntryEditorProps {
  entry: ChangePrepEntry;
  onUpdate: <K extends keyof ChangePrepEntry>(key: K, value: ChangePrepEntry[K]) => void;
  onRemove: () => void;
  onClose: () => void;
}

/** Hide suggestions that are already in the list. */
function remaining(suggestions: string[], items: ChecklistItem[]): string[] {
  const have = new Set(items.map((i) => i.text.trim().toLowerCase()));
  return suggestions.filter((s) => !have.has(s.toLowerCase()));
}

const MAX_SLEEP_DOTS = 14;

export default function ChangePrepEntryEditor({
  entry,
  onUpdate,
  onRemove,
  onClose,
}: ChangePrepEntryEditorProps) {
  const { timezone } = useTimezone();
  const formId = useId();
  const days = daysUntil(entry.changeDate, getTodayDateString(timezone));
  const label = countdownLabel(days);

  return (
    <div className="flex flex-col gap-4 rounded-2xl border-2 border-border bg-surface p-4">
      <div className="no-print flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={onClose}
          className="touch-target rounded-xl border-2 border-border bg-background px-3 text-sm font-semibold"
        >
          ← Back to my plans
        </button>
        <PrintButton label="Print this plan" />
      </div>

      <h2 className="font-display text-xl font-bold">{entry.title}</h2>

      <div>
        <label htmlFor={`${formId}-date`} className="no-print mb-1 block font-semibold">
          Date of the change (if known)
        </label>
        <input
          id={`${formId}-date`}
          type="date"
          value={entry.changeDate}
          onChange={(e) => onUpdate("changeDate", e.target.value)}
          className="no-print touch-target w-full max-w-xs rounded-xl border-2 border-border bg-background px-4 py-3"
        />
        {entry.changeDate && (
          <div className="mt-3 rounded-2xl border-2 border-brand bg-brand-soft p-4">
            <p className="font-display text-lg font-bold">{formatChangeDate(entry.changeDate)}</p>
            {label && (
              <p aria-live="polite" className="font-display mt-1 text-2xl font-bold">
                {label}
              </p>
            )}
            {days !== null && days >= 1 && days <= MAX_SLEEP_DOTS && (
              <div className="mt-3">
                <p className="mb-1 text-sm font-semibold">
                  One circle for each sleep. Cross one off each morning.
                </p>
                <div aria-hidden="true" className="flex flex-wrap gap-2">
                  {Array.from({ length: days }, (_, i) => (
                    <span
                      key={i}
                      className="font-display grid h-10 w-10 place-items-center rounded-full border-2 border-brand bg-surface text-sm font-bold"
                    >
                      {i + 1}
                    </span>
                  ))}
                  <span className="font-display grid h-10 place-items-center rounded-full bg-brand px-3 text-sm font-bold text-brand-ink">
                    The day
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <ChecklistSection
        title="What's changing"
        description="List the things that will be different. Tap an idea to add it."
        placeholder="e.g. New house, new bedroom"
        items={entry.whatsChanging}
        suggestions={remaining(CHANGING_SUGGESTIONS, entry.whatsChanging)}
        onChange={(items: ChecklistItem[]) => onUpdate("whatsChanging", items)}
      />

      <ChecklistSection
        title="What's staying the same"
        description="List the things that won't change. These are familiar and reassuring."
        placeholder="e.g. Same school, same pet"
        items={entry.whatsStaying}
        suggestions={remaining(STAYING_SUGGESTIONS, entry.whatsStaying)}
        onChange={(items: ChecklistItem[]) => onUpdate("whatsStaying", items)}
      />

      <ChecklistSection
        title="Things that might help"
        description="Comfort items, a visual schedule for the day, a social story, people to call. Tap an idea to add it."
        placeholder="e.g. Bring favourite blanket"
        items={entry.thingsThatMightHelp}
        suggestions={remaining(HELP_SUGGESTIONS, entry.thingsThatMightHelp)}
        onChange={(items: ChecklistItem[]) => onUpdate("thingsThatMightHelp", items)}
      />

      <div>
        <label htmlFor={`${formId}-notes`} className="mb-1 block font-semibold">
          Notes
        </label>
        <textarea
          id={`${formId}-notes`}
          value={entry.notes}
          onChange={(e) => onUpdate("notes", e.target.value)}
          rows={4}
          maxLength={1000}
          className="w-full rounded-xl border-2 border-border bg-background px-4 py-3"
        />
      </div>

      <div className="no-print flex justify-end">
        <button
          type="button"
          onClick={() => {
            if (window.confirm(`Delete "${entry.title}"? This can't be undone.`)) {
              onRemove();
            }
          }}
          className="touch-target rounded-xl border-2 border-border bg-background px-3 text-sm font-semibold"
        >
          Delete this plan
        </button>
      </div>
    </div>
  );
}

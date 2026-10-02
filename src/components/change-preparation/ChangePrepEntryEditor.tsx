"use client";

import { useId } from "react";
import type { ChangePrepEntry } from "@/lib/change-preparation-storage";
import { getTodayDateString } from "@/lib/datetime";
import { useTimezone } from "@/lib/timezone-context";
import ChecklistSection, { type ChecklistItem } from "@/components/ChecklistSection";
import PrintButton from "@/components/PrintButton";

interface ChangePrepEntryEditorProps {
  entry: ChangePrepEntry;
  onUpdate: <K extends keyof ChangePrepEntry>(key: K, value: ChangePrepEntry[K]) => void;
  onRemove: () => void;
  onClose: () => void;
}

function daysUntil(dateStr: string, today: string): number | null {
  if (!dateStr) return null;
  const diffMs = new Date(`${dateStr}T00:00:00`).getTime() - new Date(`${today}T00:00:00`).getTime();
  return Math.round(diffMs / 86_400_000);
}

function countdownLabel(days: number | null): string | null {
  if (days === null) return null;
  if (days === 0) return "That's today";
  if (days === 1) return "1 day to go";
  if (days > 1) return `${days} days to go`;
  if (days === -1) return "1 day ago";
  return `${Math.abs(days)} days ago`;
}

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
        <label htmlFor={`${formId}-date`} className="mb-1 block font-semibold">
          Date of the change (if known)
        </label>
        <input
          id={`${formId}-date`}
          type="date"
          value={entry.changeDate}
          onChange={(e) => onUpdate("changeDate", e.target.value)}
          className="touch-target w-full max-w-xs rounded-xl border-2 border-border bg-background px-4 py-3"
        />
        {label && (
          <p className="mt-2 inline-block rounded-full border-2 border-brand bg-brand/10 px-4 py-1 font-display font-bold text-brand">
            {label}
          </p>
        )}
      </div>

      <ChecklistSection
        title="What's changing"
        description="List the things that will be different."
        placeholder="e.g. New house, new bedroom"
        items={entry.whatsChanging}
        onChange={(items: ChecklistItem[]) => onUpdate("whatsChanging", items)}
      />

      <ChecklistSection
        title="What's staying the same"
        description="List the things that won't change - familiar and reassuring."
        placeholder="e.g. Same school, same pet"
        items={entry.whatsStaying}
        onChange={(items: ChecklistItem[]) => onUpdate("whatsStaying", items)}
      />

      <ChecklistSection
        title="Things that might help"
        description="Comfort items, a visual schedule for the day, a social story, people to call."
        placeholder="e.g. Bring favourite blanket"
        items={entry.thingsThatMightHelp}
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
          className="text-sm font-semibold text-muted hover:text-foreground"
        >
          Delete this plan
        </button>
      </div>
    </div>
  );
}

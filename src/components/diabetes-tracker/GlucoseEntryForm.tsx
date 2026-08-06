"use client";

import { useId, useState } from "react";
import {
  READING_CONTEXT_SUGGESTIONS,
  INSULIN_TYPE_SUGGESTIONS,
} from "@/lib/diabetes-tracker-data";
import type { GlucoseEntry } from "@/lib/diabetes-tracker-storage";
import SuggestField from "@/components/SuggestField";

interface GlucoseEntryFormProps {
  onSave: (data: Omit<GlucoseEntry, "id">) => void;
}

function toLocalDatetimeInputValue(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function GlucoseEntryForm({ onSave }: GlucoseEntryFormProps) {
  const [bglMmol, setBglMmol] = useState("");
  const [context, setContext] = useState("");
  const [insulinType, setInsulinType] = useState("");
  const [insulinDose, setInsulinDose] = useState("");
  const [notes, setNotes] = useState("");
  const [occurredAtLocal, setOccurredAtLocal] = useState(() =>
    toLocalDatetimeInputValue(new Date())
  );
  const occurredAtId = useId();
  const doseId = useId();
  const notesId = useId();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const bgl = Number(bglMmol);
    if (!bglMmol || Number.isNaN(bgl) || bgl <= 0) return;
    onSave({
      occurredAt: new Date(occurredAtLocal).toISOString(),
      bglMmol: bgl,
      context: context.trim(),
      insulinType: insulinType.trim(),
      insulinDose: insulinDose.trim(),
      notes: notes.trim(),
    });
    setBglMmol("");
    setContext("");
    setInsulinType("");
    setInsulinDose("");
    setNotes("");
    setOccurredAtLocal(toLocalDatetimeInputValue(new Date()));
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-2xl border-2 border-border bg-surface p-4"
    >
      <h2 className="font-display text-lg font-bold">Log a reading</h2>

      <div>
        <label htmlFor={occurredAtId} className="block font-semibold mb-1">
          When?
        </label>
        <input
          id={occurredAtId}
          type="datetime-local"
          value={occurredAtLocal}
          onChange={(e) => setOccurredAtLocal(e.target.value)}
          required
          className="w-full rounded-xl border-2 border-border bg-background px-4 py-3 touch-target"
        />
      </div>

      <div>
        <label className="block font-semibold mb-1" htmlFor="bgl-mmol">
          Blood glucose level (mmol/L)
        </label>
        <input
          id="bgl-mmol"
          type="number"
          inputMode="decimal"
          min={0}
          max={40}
          step={0.1}
          value={bglMmol}
          onChange={(e) => setBglMmol(e.target.value)}
          required
          placeholder="e.g. 6.5"
          className="w-full rounded-xl border-2 border-border bg-background px-4 py-3 text-lg font-bold touch-target"
        />
      </div>

      <SuggestField
        label="When was this reading taken?"
        value={context}
        onChange={setContext}
        suggestions={READING_CONTEXT_SUGGESTIONS}
        placeholder="e.g. Before breakfast"
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <span className="block font-semibold mb-1">Insulin type (if any)</span>
          <div className="flex flex-wrap gap-1.5">
            {INSULIN_TYPE_SUGGESTIONS.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setInsulinType(type)}
                aria-pressed={insulinType === type}
                className={`touch-target rounded-full border-2 px-3 text-xs font-semibold ${
                  insulinType === type
                    ? "border-brand bg-brand text-brand-ink"
                    : "border-border bg-background"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={insulinType}
            onChange={(e) => setInsulinType(e.target.value)}
            maxLength={80}
            placeholder="Or type your own"
            className="mt-2 w-full rounded-xl border-2 border-border bg-background px-4 py-3 touch-target"
          />
        </div>
        <label className="text-sm" htmlFor={doseId}>
          <span className="mb-1 block font-semibold">Insulin dose (units)</span>
          <input
            id={doseId}
            type="text"
            inputMode="decimal"
            value={insulinDose}
            onChange={(e) => setInsulinDose(e.target.value)}
            maxLength={20}
            placeholder="e.g. 6"
            className="w-full rounded-xl border-2 border-border bg-background px-4 py-3 touch-target"
          />
        </label>
      </div>

      <div>
        <label className="block font-semibold mb-1" htmlFor={notesId}>
          Notes — how are you feeling, food, activity, anything unusual
        </label>
        <textarea
          id={notesId}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          maxLength={500}
          className="w-full rounded-xl border-2 border-border bg-background px-4 py-3 touch-target"
        />
      </div>

      <button
        type="submit"
        className="touch-target rounded-xl border-2 border-brand bg-brand font-semibold text-brand-ink"
      >
        Save reading
      </button>
    </form>
  );
}

"use client";

import { useId, useState } from "react";
import { QUALITY_LEVELS, computeHoursSlept } from "@/lib/sleep-tracker-data";
import type { SleepEntry } from "@/lib/sleep-tracker-storage";

interface SleepEntryFormProps {
  onSave: (data: Omit<SleepEntry, "id">) => void;
}

function todayDateInputValue() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export default function SleepEntryForm({ onSave }: SleepEntryFormProps) {
  const [date, setDate] = useState(todayDateInputValue());
  const [bedTime, setBedTime] = useState("22:00");
  const [wakeTime, setWakeTime] = useState("07:00");
  const [quality, setQuality] = useState(3);
  const [notes, setNotes] = useState("");
  const dateId = useId();
  const notesId = useId();

  const hoursSlept = computeHoursSlept(bedTime, wakeTime);
  const activeLevel = QUALITY_LEVELS.find((l) => l.value === quality);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({ date, bedTime, wakeTime, quality, notes: notes.trim() });
    setNotes("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-2xl border-2 border-border bg-surface p-4"
    >
      <h2 className="font-display text-lg font-bold">Log last night&apos;s sleep</h2>

      <div>
        <label htmlFor={dateId} className="block font-semibold mb-1">
          Date
        </label>
        <input
          id={dateId}
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full rounded-xl border-2 border-border bg-background px-4 py-3 touch-target"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm">
          <span className="mb-1 block font-semibold">Bedtime</span>
          <input
            type="time"
            value={bedTime}
            onChange={(e) => setBedTime(e.target.value)}
            required
            className="touch-target w-full rounded-xl border-2 border-border bg-background px-3"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-semibold">Wake time</span>
          <input
            type="time"
            value={wakeTime}
            onChange={(e) => setWakeTime(e.target.value)}
            required
            className="touch-target w-full rounded-xl border-2 border-border bg-background px-3"
          />
        </label>
      </div>

      <p className="text-sm text-muted">
        That&apos;s about <strong>{hoursSlept} hours</strong> of sleep.
      </p>

      <div>
        <span className="block font-semibold mb-2">How was your sleep?</span>
        <div role="group" aria-label="Sleep quality" className="flex gap-1.5">
          {QUALITY_LEVELS.map((level) => (
            <button
              key={level.value}
              type="button"
              onClick={() => setQuality(level.value)}
              aria-pressed={quality === level.value}
              aria-label={level.label}
              className={`touch-target flex-1 rounded-xl border-2 text-2xl ${
                quality === level.value
                  ? "border-brand bg-brand/10"
                  : "border-border opacity-60"
              }`}
            >
              {level.emoji}
            </button>
          ))}
        </div>
        <p className="mt-1 text-sm text-muted">{activeLevel?.label}</p>
      </div>

      <div>
        <label className="block font-semibold mb-1" htmlFor={notesId}>
          Notes
        </label>
        <textarea
          id={notesId}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          maxLength={300}
          placeholder="e.g. Woke up twice during the night"
          className="w-full rounded-xl border-2 border-border bg-background px-4 py-3 touch-target"
        />
      </div>

      <button
        type="submit"
        className="touch-target rounded-xl border-2 border-brand bg-brand font-semibold text-brand-ink"
      >
        Save entry
      </button>
    </form>
  );
}

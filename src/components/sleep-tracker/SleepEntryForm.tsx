"use client";

import { useId, useState } from "react";
import { QUALITY_LEVELS, computeHoursSlept } from "@/lib/sleep-tracker-data";
import type { SleepEntry } from "@/lib/sleep-tracker-storage";
import { getTodayDateString } from "@/lib/datetime";
import { useTimezone } from "@/lib/timezone-context";

interface SleepEntryFormProps {
  /** Returns a short confirmation message, or null if saving was cancelled. */
  onSave: (data: Omit<SleepEntry, "id">) => string | null;
}

const MAX_WAKE_UPS = 20;

export default function SleepEntryForm({ onSave }: SleepEntryFormProps) {
  const { timezone } = useTimezone();
  const [date, setDate] = useState(() => getTodayDateString(timezone));
  const [bedTime, setBedTime] = useState("22:00");
  const [wakeTime, setWakeTime] = useState("07:00");
  const [quality, setQuality] = useState(3);
  // null = not recorded, so it isn't confused with "didn't wake up at all".
  const [wakeUps, setWakeUps] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const dateId = useId();
  const notesId = useId();
  const bedId = useId();
  const wakeId = useId();

  const hoursSlept = computeHoursSlept(bedTime, wakeTime);
  const activeLevel = QUALITY_LEVELS.find((l) => l.value === quality);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const message = onSave({
      date,
      bedTime,
      wakeTime,
      quality,
      notes: notes.trim(),
      ...(wakeUps !== null ? { wakeUps } : {}),
    });
    if (message === null) return;
    setConfirmation(message);
    setNotes("");
    setWakeUps(null);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-2xl border-2 border-border bg-surface p-4"
    >
      <h2 className="font-display text-lg font-bold">Log last night&apos;s sleep</h2>

      <div>
        <label htmlFor={dateId} className="block font-semibold">
          Date you woke up
        </label>
        <p className="mb-1 text-sm text-muted">Usually today. Change it to fill in a night you missed.</p>
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
        <div>
          <label htmlFor={bedId} className="mb-1 block font-semibold">
            Went to sleep at
          </label>
          <input
            id={bedId}
            type="time"
            value={bedTime}
            onChange={(e) => setBedTime(e.target.value)}
            required
            className="touch-target w-full rounded-xl border-2 border-border bg-background px-3"
          />
        </div>
        <div>
          <label htmlFor={wakeId} className="mb-1 block font-semibold">
            Woke up at
          </label>
          <input
            id={wakeId}
            type="time"
            value={wakeTime}
            onChange={(e) => setWakeTime(e.target.value)}
            required
            className="touch-target w-full rounded-xl border-2 border-border bg-background px-3"
          />
        </div>
      </div>

      <p className="text-sm text-muted">
        That&apos;s about <strong>{hoursSlept} hours</strong> of sleep.
      </p>

      <div>
        <span className="block font-semibold mb-2">How was your sleep?</span>
        <div role="group" aria-label="Sleep quality" className="flex flex-wrap gap-1.5">
          {QUALITY_LEVELS.map((level) => (
            <button
              key={level.value}
              type="button"
              onClick={() => setQuality(level.value)}
              aria-pressed={quality === level.value}
              className={`touch-target flex flex-1 flex-col items-center justify-center rounded-xl border-2 ${
                quality === level.value
                  ? "border-brand bg-brand-soft font-bold"
                  : "border-border bg-background"
              }`}
            >
              <span aria-hidden="true" className="text-2xl">
                {level.emoji}
              </span>
              <span className="text-xs">{level.label}</span>
            </button>
          ))}
        </div>
        <p className="mt-1 text-sm text-muted">Chosen: {activeLevel?.label}</p>
      </div>

      <div>
        <span className="block font-semibold">Times woken up in the night (optional)</span>
        <p className="mb-2 text-sm text-muted">Leave it as &quot;Not recorded&quot; if you&apos;re not sure.</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setWakeUps((n) => (n === null || n <= 0 ? null : n - 1))}
            disabled={wakeUps === null}
            aria-label="One less time woken up"
            className="touch-target rounded-xl border-2 border-border bg-background text-2xl font-bold disabled:cursor-not-allowed disabled:opacity-50"
          >
            −
          </button>
          <span aria-live="polite" className="min-w-32 text-center text-lg font-bold">
            {wakeUps === null ? "Not recorded" : `${wakeUps} ${wakeUps === 1 ? "time" : "times"}`}
          </span>
          <button
            type="button"
            onClick={() => setWakeUps((n) => Math.min(MAX_WAKE_UPS, n === null ? 0 : n + 1))}
            aria-label={wakeUps === null ? "Record times woken up, starting at 0" : "One more time woken up"}
            className="touch-target rounded-xl border-2 border-border bg-background text-2xl font-bold"
          >
            +
          </button>
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-1" htmlFor={notesId}>
          Notes (optional)
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

      <div aria-live="polite">
        {confirmation && (
          <p className="rounded-xl border-2 border-brand bg-brand-soft px-4 py-3 font-semibold">
            <span aria-hidden="true">✅ </span>
            {confirmation}
          </p>
        )}
      </div>
    </form>
  );
}

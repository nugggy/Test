"use client";

import { useState } from "react";
import type { FitnessLogEntry } from "@/lib/fitness-log-storage";

interface FitnessLogFormProps {
  onSave: (data: Omit<FitnessLogEntry, "id">) => void;
}

const ACTIVITY_SUGGESTIONS = ["Walking", "Swimming", "Gym", "Stretching", "Cycling", "Dancing"];

function todayKey() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export default function FitnessLogForm({ onSave }: FitnessLogFormProps) {
  const [date, setDate] = useState(todayKey());
  const [activity, setActivity] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("30");
  const [savedMessage, setSavedMessage] = useState("");
  const [notes, setNotes] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const minutes = Number(durationMinutes);
    if (!activity.trim() || !date || !Number.isFinite(minutes) || minutes <= 0) return;
    onSave({ date, activity: activity.trim(), durationMinutes: minutes, notes: notes.trim() });
    setActivity("");
    setDurationMinutes("30");
    setNotes("");
    setSavedMessage("Session saved.");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-2xl border-2 border-border bg-surface p-4"
    >
      <h2 className="font-display text-lg font-bold">Log a session</h2>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm">
          <span className="mb-1 block font-semibold">Date</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full rounded-xl border-2 border-border bg-background px-4 py-3 touch-target"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-semibold">Duration (minutes)</span>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            max={600}
            required
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(e.target.value)}
            className="w-full rounded-xl border-2 border-border bg-background px-4 py-3 touch-target"
          />
        </label>
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold" htmlFor="fitness-activity">
          Activity
        </label>
        <input
          id="fitness-activity"
          type="text"
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
          maxLength={80}
          required
          placeholder="e.g. Walking"
          className="w-full rounded-xl border-2 border-border bg-background px-4 py-3 touch-target"
        />
        <div className="mt-2 flex flex-wrap gap-1.5">
          {ACTIVITY_SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setActivity(s)}
              aria-pressed={activity === s}
              className={`touch-target rounded-full border-2 px-4 text-sm font-semibold hover:border-brand ${
                activity === s ? "border-brand bg-brand text-brand-ink" : "border-border bg-background"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <label className="text-sm">
        <span className="mb-1 block font-semibold">Notes (optional)</span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          maxLength={500}
          placeholder="How it went, how you felt"
          className="w-full rounded-xl border-2 border-border bg-background px-4 py-3 touch-target"
        />
      </label>

      <button
        type="submit"
        className="touch-target rounded-xl border-2 border-brand bg-brand font-semibold text-brand-ink"
      >
        Save session
      </button>
      <p aria-live="polite" className="text-sm font-semibold">
        {savedMessage}
      </p>
    </form>
  );
}

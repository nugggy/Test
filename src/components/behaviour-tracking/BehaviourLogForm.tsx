"use client";

import { useEffect, useId, useState } from "react";
import {
  ANTECEDENT_SUGGESTIONS,
  BEHAVIOUR_SUGGESTIONS,
  CONSEQUENCE_SUGGESTIONS,
  SEVERITY_LEVELS,
} from "@/lib/behaviour-tracking-data";
import SuggestField from "@/components/SuggestField";
import type { BehaviourLogInput } from "@/lib/behaviour-tracking-storage";

interface BehaviourLogFormProps {
  onSave: (data: BehaviourLogInput) => void;
}

const SETTING_SUGGESTIONS = [
  "Home",
  "Day program",
  "School",
  "Work",
  "In the community",
  "Transport",
];

const RECORDED_BY_KEY = "dt:behaviour-tracking:recorded-by:v1";

function readRecordedBy(): string {
  try {
    return window.localStorage.getItem(RECORDED_BY_KEY) ?? "";
  } catch {
    return "";
  }
}

function saveRecordedBy(value: string) {
  try {
    window.localStorage.setItem(RECORDED_BY_KEY, value);
  } catch {
    // Storage unavailable - just won't be remembered next time.
  }
}

function toLocalDatetimeInputValue(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function BehaviourLogForm({ onSave }: BehaviourLogFormProps) {
  const [antecedent, setAntecedent] = useState("");
  const [behaviour, setBehaviour] = useState("");
  const [consequence, setConsequence] = useState("");
  const [severity, setSeverity] = useState(3);
  const [occurredAtLocal, setOccurredAtLocal] = useState(() =>
    toLocalDatetimeInputValue(new Date())
  );
  const [durationMinutes, setDurationMinutes] = useState("");
  const [setting, setSetting] = useState("");
  const [notes, setNotes] = useState("");
  const [recordedBy, setRecordedBy] = useState("");
  const [savedMessage, setSavedMessage] = useState("");
  const occurredAtId = useId();
  const durationId = useId();
  const notesId = useId();
  const recordedById = useId();

  useEffect(() => {
    // Remembered on this device so staff on a shared tablet don't retype it.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRecordedBy(readRecordedBy());
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!behaviour.trim()) return;
    const occurred = new Date(occurredAtLocal);
    if (Number.isNaN(occurred.getTime())) return;
    const minutes = Number(durationMinutes);
    onSave({
      antecedent: antecedent.trim(),
      behaviour: behaviour.trim(),
      consequence: consequence.trim(),
      severity,
      occurredAt: occurred.toISOString(),
      durationMinutes: Number.isFinite(minutes) && minutes > 0 ? minutes : 0,
      setting: setting.trim(),
      notes: notes.trim(),
      recordedBy: recordedBy.trim(),
    });
    saveRecordedBy(recordedBy.trim());
    setAntecedent("");
    setBehaviour("");
    setConsequence("");
    setSeverity(3);
    setDurationMinutes("");
    setSetting("");
    setNotes("");
    setOccurredAtLocal(toLocalDatetimeInputValue(new Date()));
    setSavedMessage("Entry saved. It is now in the log below.");
  }

  const activeLevel = SEVERITY_LEVELS.find((l) => l.value === severity);

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-2xl border-2 border-border bg-surface p-4"
    >
      <h2 className="font-display text-lg font-bold">Log an entry</h2>

      <SuggestField
        label="What happened before? (antecedent)"
        value={antecedent}
        onChange={setAntecedent}
        suggestions={ANTECEDENT_SUGGESTIONS}
        placeholder="e.g. Asked to stop screen time"
      />
      <SuggestField
        label="What was the behaviour?"
        value={behaviour}
        onChange={setBehaviour}
        suggestions={BEHAVIOUR_SUGGESTIONS}
        placeholder="e.g. Shouting"
        required
      />
      <SuggestField
        label="What happened after? (consequence)"
        value={consequence}
        onChange={setConsequence}
        suggestions={CONSEQUENCE_SUGGESTIONS}
        placeholder="e.g. Given a 5 minute break"
      />

      <div>
        <span className="block font-semibold mb-2">Severity</span>
        <div role="group" aria-label="Severity" className="flex gap-1.5">
          {SEVERITY_LEVELS.map((level) => (
            <button
              key={level.value}
              type="button"
              onClick={() => setSeverity(level.value)}
              aria-pressed={severity === level.value}
              aria-label={`Severity ${level.value}, ${level.label}`}
              className={`touch-target flex-1 rounded-xl font-display text-lg font-bold text-black ${
                severity === level.value
                  ? "border-4 border-foreground"
                  : "border-2 border-border opacity-50"
              }`}
              style={{
                background: `var(--${level.colorVar})`,
              }}
            >
              {level.value}
            </button>
          ))}
        </div>
        <p className="mt-1 text-sm font-semibold">
          Selected: {severity}, {activeLevel?.label}
        </p>
      </div>

      <div>
        <label htmlFor={occurredAtId} className="block font-semibold mb-1">
          When did this happen?
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

      <details className="rounded-xl border-2 border-border bg-background p-3">
        <summary className="touch-target flex cursor-pointer items-center font-semibold">
          More detail (optional): how long, where, notes, who recorded it
        </summary>
        <div className="mt-3 flex flex-col gap-4">
          <div>
            <label htmlFor={durationId} className="mb-1 block font-semibold">
              How long did it last? (minutes)
            </label>
            <input
              id={durationId}
              type="number"
              inputMode="decimal"
              min={0}
              step={0.5}
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              className="touch-target w-32 rounded-xl border-2 border-border bg-surface px-3"
            />
          </div>
          <SuggestField
            label="Where did it happen?"
            value={setting}
            onChange={setSetting}
            suggestions={SETTING_SUGGESTIONS}
            placeholder="e.g. Home"
          />
          <div>
            <label htmlFor={notesId} className="mb-1 block font-semibold">
              Notes
            </label>
            <textarea
              id={notesId}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              maxLength={1000}
              placeholder="Anything else that helps explain what happened"
              className="touch-target w-full rounded-xl border-2 border-border bg-surface px-3 py-2"
            />
          </div>
          <div>
            <label htmlFor={recordedById} className="mb-1 block font-semibold">
              Recorded by
            </label>
            <input
              id={recordedById}
              type="text"
              value={recordedBy}
              onChange={(e) => setRecordedBy(e.target.value)}
              maxLength={60}
              placeholder="Your name or initials"
              className="touch-target w-full rounded-xl border-2 border-border bg-surface px-3"
            />
          </div>
        </div>
      </details>

      <button
        type="submit"
        className="touch-target rounded-xl border-2 border-brand bg-brand font-semibold text-brand-ink"
      >
        Save entry
      </button>
      <p aria-live="polite" className="text-sm font-semibold">
        {savedMessage}
      </p>
    </form>
  );
}

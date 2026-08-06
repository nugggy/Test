"use client";

import { useId, useState } from "react";
import {
  ANTECEDENT_SUGGESTIONS,
  BEHAVIOUR_SUGGESTIONS,
  CONSEQUENCE_SUGGESTIONS,
  SEVERITY_LEVELS,
} from "@/lib/behaviour-tracking-data";
import SuggestField from "@/components/SuggestField";

interface BehaviourLogFormProps {
  onSave: (data: {
    antecedent: string;
    behaviour: string;
    consequence: string;
    severity: number;
    occurredAt: string;
  }) => void;
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
  const occurredAtId = useId();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!behaviour.trim()) return;
    onSave({
      antecedent: antecedent.trim(),
      behaviour: behaviour.trim(),
      consequence: consequence.trim(),
      severity,
      occurredAt: new Date(occurredAtLocal).toISOString(),
    });
    setAntecedent("");
    setBehaviour("");
    setConsequence("");
    setSeverity(3);
    setOccurredAtLocal(toLocalDatetimeInputValue(new Date()));
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
              className={`touch-target flex-1 rounded-xl border-2 font-display text-lg font-bold ${
                severity === level.value
                  ? "border-black/20"
                  : "border-border opacity-50"
              }`}
              style={{
                background: `var(--${level.colorVar})`,
              }}
            >
              {level.value}
            </button>
          ))}
        </div>
        <p className="mt-1 text-sm text-muted">{activeLevel?.label}</p>
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

      <button
        type="submit"
        className="touch-target rounded-xl border-2 border-brand bg-brand font-semibold text-brand-ink"
      >
        Save entry
      </button>
    </form>
  );
}

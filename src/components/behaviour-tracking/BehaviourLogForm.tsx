"use client";

import { useId, useState } from "react";
import {
  ANTECEDENT_SUGGESTIONS,
  BEHAVIOUR_SUGGESTIONS,
  CONSEQUENCE_SUGGESTIONS,
  SEVERITY_LEVELS,
} from "@/lib/behaviour-tracking-data";
import { useSpeechToText } from "@/lib/use-speech";

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

interface SuggestFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
  placeholder: string;
  required?: boolean;
}

function SuggestField({
  label,
  value,
  onChange,
  suggestions,
  placeholder,
  required,
}: SuggestFieldProps) {
  const id = useId();
  const { supported: sttSupported, listening, start, stop } = useSpeechToText();

  function handleMicClick() {
    if (listening) {
      stop();
    } else {
      start((text) => onChange(text));
    }
  }

  return (
    <div>
      <label htmlFor={id} className="block font-semibold mb-1">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          maxLength={200}
          placeholder={placeholder}
          className="flex-1 rounded-xl border-2 border-border bg-background px-4 py-3 touch-target"
        />
        {sttSupported && (
          <button
            type="button"
            onClick={handleMicClick}
            aria-pressed={listening}
            aria-label={listening ? "Stop recording" : `Use microphone for ${label.toLowerCase()}`}
            className={`touch-target shrink-0 rounded-xl border-2 px-4 font-semibold ${
              listening
                ? "border-accent bg-accent text-accent-ink"
                : "border-border bg-background"
            }`}
          >
            <span aria-hidden="true">{listening ? "⏹️" : "🎤"}</span>
          </button>
        )}
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => onChange(suggestion)}
            className="rounded-full border-2 border-border bg-background px-3 py-1 text-xs font-semibold hover:border-brand"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
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

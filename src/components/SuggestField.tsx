"use client";

import { useId } from "react";
import { useSpeechToText } from "@/lib/use-speech";

interface SuggestFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
  placeholder: string;
  required?: boolean;
}

export default function SuggestField({
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

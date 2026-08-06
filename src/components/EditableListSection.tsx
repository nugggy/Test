"use client";

import { useId, useRef, useState } from "react";
import { useSpeechToText } from "@/lib/use-speech";

interface EditableListSectionProps {
  title: string;
  description?: string;
  placeholder: string;
  items: string[];
  suggestions?: string[];
  onChange: (items: string[]) => void;
  /** "alert" renders as a highlighted banner, for critical info that needs
   * to stand out (e.g. allergies, S8 medications) rather than blend in
   * with regular sections. */
  variant?: "default" | "alert";
}

export default function EditableListSection({
  title,
  description,
  placeholder,
  items,
  suggestions,
  onChange,
  variant = "default",
}: EditableListSectionProps) {
  const [draft, setDraft] = useState("");
  const { supported: sttSupported, listening, start, stop } = useSpeechToText();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleAdd(value?: string) {
    const text = (value ?? draft).trim();
    if (!text) return;
    onChange([...items, text]);
    setDraft("");
  }

  function handleRemove(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function handleSuggestionClick(suggestion: string) {
    // Suggestions ending in "..." are templates that need the person to
    // fill in details (e.g. "Allergic to...") - prefill and focus the
    // input instead of adding the raw template text as-is.
    if (suggestion.endsWith("...")) {
      const prefix = suggestion.slice(0, -3).trimEnd();
      setDraft(`${prefix} `);
      inputRef.current?.focus();
      return;
    }
    handleAdd(suggestion);
  }

  function handleMicClick() {
    if (listening) {
      stop();
    } else {
      start((text) => setDraft(text));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleAdd();
  }

  const isAlert = variant === "alert";

  return (
    <div
      className={`print-avoid-break rounded-2xl border-2 p-4 ${
        isAlert
          ? "border-accent bg-accent/10"
          : "border-border bg-surface"
      }`}
    >
      <h2 className="font-display flex items-center gap-2 text-lg font-bold">
        {isAlert && <span aria-hidden="true">⚠️</span>}
        {title}
      </h2>
      {description && <p className="mb-3 text-sm text-muted">{description}</p>}

      {items.length > 0 && (
        <ul className="mb-3 flex flex-col gap-2">
          {items.map((item, i) => (
            <li
              key={i}
              className={`print-avoid-break flex items-center gap-2 rounded-xl border-2 p-3 ${
                isAlert
                  ? "border-accent/40 bg-background font-semibold"
                  : "border-border bg-background"
              }`}
            >
              <span className="flex-1 text-sm">{item}</span>
              <button
                type="button"
                onClick={() => handleRemove(i)}
                aria-label={`Remove "${item}"`}
                className="no-print grid h-9 w-9 shrink-0 place-items-center rounded-lg border-2 border-border bg-surface"
              >
                <span aria-hidden="true">🗑️</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="no-print flex gap-2">
        <label htmlFor={inputId} className="sr-only">
          {title}
        </label>
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={placeholder}
          maxLength={200}
          className="flex-1 rounded-xl border-2 border-border bg-background px-4 py-3 touch-target"
        />
        {sttSupported && (
          <button
            type="button"
            onClick={handleMicClick}
            aria-pressed={listening}
            aria-label={listening ? "Stop recording" : "Use microphone"}
            className={`touch-target shrink-0 rounded-xl border-2 px-4 font-semibold ${
              listening
                ? "border-accent bg-accent text-accent-ink"
                : "border-border bg-background"
            }`}
          >
            <span aria-hidden="true">{listening ? "⏹️" : "🎤"}</span>
          </button>
        )}
        <button
          type="submit"
          className="touch-target shrink-0 rounded-xl border-2 border-brand bg-brand px-4 font-semibold text-brand-ink"
        >
          Add
        </button>
      </form>

      {suggestions && suggestions.length > 0 && (
        <div className="no-print mt-2 flex flex-wrap gap-1.5">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleSuggestionClick(s)}
              className="rounded-full border-2 border-border bg-background px-3 py-1 text-xs font-semibold hover:border-brand"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useId, useState } from "react";
import { useSpeechToText } from "@/lib/use-speech";

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

interface ChecklistSectionProps {
  title: string;
  description?: string;
  placeholder: string;
  items: ChecklistItem[];
  suggestions?: string[];
  onChange: (items: ChecklistItem[]) => void;
}

function makeId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function ChecklistSection({
  title,
  description,
  placeholder,
  items,
  suggestions,
  onChange,
}: ChecklistSectionProps) {
  const [draft, setDraft] = useState("");
  const { supported: sttSupported, listening, start, stop } = useSpeechToText();
  const inputId = useId();

  function handleAdd(value?: string) {
    const text = (value ?? draft).trim();
    if (!text) return;
    onChange([...items, { id: makeId(), text, done: false }]);
    setDraft("");
  }

  function handleToggle(id: string) {
    onChange(items.map((item) => (item.id === id ? { ...item, done: !item.done } : item)));
  }

  function handleRemove(id: string) {
    onChange(items.filter((item) => item.id !== id));
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

  return (
    <div className="rounded-2xl border-2 border-border bg-surface p-4">
      <h2 className="font-display text-lg font-bold">{title}</h2>
      {description && <p className="mb-3 text-sm text-muted">{description}</p>}

      {items.length > 0 && (
        <ul className="mb-3 flex flex-col gap-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-2 rounded-xl border-2 border-border bg-background p-3"
            >
              <label className="flex flex-1 items-center gap-3">
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={() => handleToggle(item.id)}
                  className="h-6 w-6 shrink-0 accent-brand"
                />
                <span className={`text-sm ${item.done ? "text-muted line-through" : ""}`}>
                  {item.text}
                </span>
              </label>
              <button
                type="button"
                onClick={() => handleRemove(item.id)}
                aria-label={`Remove "${item.text}"`}
                className="no-print touch-target group -my-6 -mr-6 grid shrink-0 place-items-center rounded-xl"
              >
                {/* 40px visible button inside the full 88px tap area. */}
                <span
                  aria-hidden="true"
                  className="grid h-10 w-10 place-items-center rounded-lg border-2 border-border bg-surface group-hover:border-brand"
                >
                  🗑️
                </span>
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
        <div className="no-print mt-3 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleAdd(s)}
              className="inline-flex min-h-11 items-center rounded-full border-2 border-border bg-surface px-4 text-sm font-semibold hover:border-brand"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useId } from "react";
import { EMOJI_CHOICES } from "@/lib/emoji-choices";

interface EmojiPickerProps {
  value: string;
  onChange: (emoji: string) => void;
  label?: string;
}

/**
 * A big curated emoji grid, plus a plain text input so someone can type or
 * paste literally any emoji from their own device's keyboard — the curated
 * grid alone will never cover everyone's needs, but every phone/tablet/
 * computer already has a full emoji keyboard built in.
 */
export default function EmojiPicker({ value, onChange, label = "Picture" }: EmojiPickerProps) {
  const inputId = useId();

  return (
    <div>
      <span className="mb-1 block text-sm font-semibold">{label}</span>
      <div className="mb-2 grid max-h-56 grid-cols-8 gap-1.5 overflow-y-auto rounded-xl border-2 border-border bg-background p-2 sm:grid-cols-10">
        {EMOJI_CHOICES.map((choice) => (
          <button
            key={choice}
            type="button"
            onClick={() => onChange(choice)}
            aria-pressed={value === choice}
            aria-label={`Use picture ${choice}`}
            className={`grid aspect-square place-items-center rounded-lg border-2 text-xl ${
              value === choice ? "border-brand bg-brand/10" : "border-border bg-surface"
            }`}
          >
            {choice}
          </button>
        ))}
      </div>
      <label htmlFor={inputId} className="mb-1 block text-xs font-semibold text-muted">
        Or type/paste any emoji
      </label>
      <input
        id={inputId}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, 4))}
        maxLength={4}
        className="touch-target w-20 rounded-lg border-2 border-border bg-background px-2 text-center text-xl"
      />
    </div>
  );
}

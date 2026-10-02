"use client";

import { useState } from "react";
import { EMOJI_CHOICES } from "@/lib/emoji-choices";
import {
  LABEL_SIZES,
  useLabelSize,
  useVisualLabels,
  type LabelSize,
} from "@/lib/visual-labels-storage";
import EmojiPicker from "@/components/EmojiPicker";
import PrintButton from "@/components/PrintButton";

// Each suggestion comes with a matching picture, so one tap makes a
// complete label.
const SUGGESTIONS: { text: string; emoji: string }[] = [
  { text: "Bathroom", emoji: "🛁" },
  { text: "Toilet", emoji: "🚽" },
  { text: "Bedroom", emoji: "🛏️" },
  { text: "Kitchen", emoji: "🍳" },
  { text: "Laundry", emoji: "🧺" },
  { text: "Fridge", emoji: "🧊" },
  { text: "Cups", emoji: "🥤" },
  { text: "Plates", emoji: "🍽️" },
  { text: "Clothes", emoji: "👕" },
  { text: "Shoes", emoji: "👟" },
  { text: "Towels", emoji: "🧻" },
  { text: "Rubbish bin", emoji: "🗑️" },
  { text: "Wash your hands", emoji: "🧼" },
  { text: "Turn off the lights", emoji: "💡" },
  { text: "Close the door", emoji: "🚪" },
  { text: "Shoes off", emoji: "🥾" },
  { text: "Quiet please", emoji: "🤫" },
  { text: "Medication", emoji: "💊" },
  { text: "Emergency exit", emoji: "🚨" },
];

// Grid columns on screen and in print for each size. Print columns are set
// explicitly so the printed size doesn't depend on the paper width.
const SIZE_CLASSES: Record<LabelSize, { grid: string; emoji: string; text: string }> = {
  small: {
    grid: "grid-cols-2 sm:grid-cols-4 print:grid-cols-4",
    emoji: "text-5xl",
    text: "text-lg",
  },
  medium: {
    grid: "grid-cols-2 sm:grid-cols-3 print:grid-cols-3",
    emoji: "text-6xl",
    text: "text-xl",
  },
  large: {
    grid: "grid-cols-1 sm:grid-cols-2 print:grid-cols-2",
    emoji: "text-8xl",
    text: "text-3xl",
  },
  sign: {
    grid: "grid-cols-1 print:grid-cols-1",
    emoji: "text-9xl",
    text: "text-5xl",
  },
};

export default function VisualLabelsMaker() {
  const { labels, addLabel, removeLabel, clearAll } = useVisualLabels();
  const { size, setSize } = useLabelSize();
  const [text, setText] = useState("");
  const [emoji, setEmoji] = useState(EMOJI_CHOICES[0]);
  const [status, setStatus] = useState("");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    addLabel(trimmed, emoji);
    setText("");
    setStatus(`Label "${trimmed}" added.`);
  }

  function handleSuggestion(s: { text: string; emoji: string }) {
    setText(s.text);
    setEmoji(s.emoji);
    setStatus(`Filled in "${s.text}" with a picture. Change it if you like, then tap Add label.`);
  }

  const sizeClasses = SIZE_CLASSES[size];

  return (
    <div className="flex flex-col gap-4">
      <div className="no-print rounded-2xl border-2 border-border bg-surface p-4">
        <h2 className="font-display mb-3 text-lg font-bold">Create a label</h2>
        <form onSubmit={handleAdd}>
          <label htmlFor="label-text" className="mb-1 block text-sm font-semibold">
            Word or phrase
          </label>
          <input
            id="label-text"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={40}
            placeholder="e.g. Bathroom"
            className="mb-3 w-full touch-target rounded-xl border-2 border-border bg-background px-4 py-3 text-base"
          />
          <span id="label-suggestions-heading" className="mb-1 block text-sm font-semibold">
            Ideas (tap one to fill in the word and picture)
          </span>
          <div
            role="group"
            aria-labelledby="label-suggestions-heading"
            className="mb-4 flex flex-wrap gap-2"
          >
            {SUGGESTIONS.map((s) => (
              <button
                key={s.text}
                type="button"
                onClick={() => handleSuggestion(s)}
                className="touch-target rounded-full border-2 border-border bg-background px-4 text-sm font-semibold hover:border-brand"
              >
                <span aria-hidden="true">{s.emoji}</span> {s.text}
              </button>
            ))}
          </div>

          <div className="mb-4">
            <EmojiPicker value={emoji} onChange={setEmoji} />
          </div>

          <button
            type="submit"
            disabled={!text.trim()}
            className="touch-target w-full rounded-xl border-2 border-brand bg-brand font-semibold text-brand-ink disabled:opacity-40 sm:w-auto sm:px-8"
          >
            Add label
          </button>
        </form>
        <p aria-live="polite" className="mt-2 min-h-[1.25rem] text-sm text-muted">
          {status}
        </p>
      </div>

      {labels.length > 0 && (
        <div className="rounded-2xl border-2 border-border bg-surface p-4 print:border-0 print:p-0">
          <div className="no-print mb-4 flex flex-col gap-3">
            <h2 className="font-display text-lg font-bold">
              Your labels. Print, cut out and stick up around the house.
            </h2>
            <div>
              <span id="label-size-heading" className="mb-1 block text-sm font-semibold">
                Label size
              </span>
              <div role="group" aria-labelledby="label-size-heading" className="flex flex-wrap gap-2">
                {LABEL_SIZES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSize(s.id)}
                    aria-pressed={size === s.id}
                    className={`touch-target rounded-xl border-2 px-4 font-semibold ${
                      size === s.id ? "border-brand bg-brand text-brand-ink" : "border-border bg-background"
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
              <p className="mt-1 text-sm text-muted">
                {LABEL_SIZES.find((s) => s.id === size)?.hint}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <PrintButton />
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Clear all labels? This can't be undone.")) {
                    clearAll();
                    setStatus("All labels cleared.");
                  }
                }}
                className="touch-target rounded-xl border-2 border-border bg-background px-4 font-semibold"
              >
                Clear all
              </button>
            </div>
          </div>

          <div className={`grid gap-4 ${sizeClasses.grid}`}>
            {labels.map((label) => (
              <div
                key={label.id}
                className={`print-avoid-break flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-border bg-background p-4 text-center print:border-dashed ${
                  size === "sign"
                    ? "min-h-[50vh] print:min-h-[85vh] print:break-after-page"
                    : "min-h-[10rem] print:aspect-square"
                }`}
              >
                <span aria-hidden="true" className={`${sizeClasses.emoji} leading-none`}>
                  {label.emoji}
                </span>
                <span className={`font-display font-bold break-words ${sizeClasses.text}`}>
                  {label.text}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    removeLabel(label.id);
                    setStatus(`Label "${label.text}" removed.`);
                  }}
                  aria-label={`Remove "${label.text}"`}
                  className="no-print touch-target mt-1 rounded-xl border-2 border-border bg-surface px-3 text-sm font-semibold"
                >
                  <span aria-hidden="true">🗑️</span> Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

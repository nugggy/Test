"use client";

import { useState } from "react";
import { EMOJI_CHOICES } from "@/lib/emoji-choices";
import { useVisualLabels } from "@/lib/visual-labels-storage";
import EmojiPicker from "@/components/EmojiPicker";
import PrintButton from "@/components/PrintButton";

const SUGGESTIONS = [
  "Bathroom",
  "Bedroom",
  "Kitchen",
  "Wash your hands",
  "Turn off the lights",
  "Close the door",
  "Shoes off",
  "Quiet please",
  "Medication",
  "Emergency exit",
];

export default function VisualLabelsMaker() {
  const { labels, addLabel, removeLabel, clearAll } = useVisualLabels();
  const [text, setText] = useState("");
  const [emoji, setEmoji] = useState(EMOJI_CHOICES[0]);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    addLabel(text, emoji);
    setText("");
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border-2 border-border bg-surface p-4">
        <h2 className="font-display mb-3 text-lg font-bold">Create a label</h2>
        <form onSubmit={handleAdd} className="no-print">
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
            className="mb-2 w-full touch-target rounded-xl border-2 border-border bg-background px-4 py-3 text-base"
          />
          <div className="mb-3 flex flex-wrap gap-1.5">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setText(s)}
                className="rounded-full border-2 border-border bg-background px-3 py-1 text-xs font-semibold hover:border-brand"
              >
                {s}
              </button>
            ))}
          </div>

          <div className="mb-4">
            <EmojiPicker value={emoji} onChange={setEmoji} />
          </div>

          <button
            type="submit"
            className="touch-target w-full rounded-xl border-2 border-brand bg-brand font-semibold text-brand-ink sm:w-auto sm:px-8"
          >
            Add label
          </button>
        </form>
      </div>

      {labels.length > 0 && (
        <div className="rounded-2xl border-2 border-border bg-surface p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-lg font-bold">
              Your labels - cut out and stick up around the house
            </h2>
            <div className="no-print flex items-center gap-2">
              <PrintButton />
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Clear all labels? This can't be undone.")) {
                    clearAll();
                  }
                }}
                className="text-sm font-semibold text-muted hover:text-foreground"
              >
                Clear all
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {labels.map((label) => (
              <div
                key={label.id}
                className="print-avoid-break relative flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border-2 border-border bg-background p-4 text-center"
              >
                <button
                  type="button"
                  onClick={() => removeLabel(label.id)}
                  aria-label={`Remove "${label.text}"`}
                  className="no-print absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-lg border-2 border-border bg-surface"
                >
                  <span aria-hidden="true">🗑️</span>
                </button>
                <span aria-hidden="true" className="text-6xl leading-none">
                  {label.emoji}
                </span>
                <span className="font-display text-xl font-bold">{label.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

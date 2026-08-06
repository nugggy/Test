"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CATEGORIES, type CategoryId } from "@/lib/communication-board-data";
import { EMOJI_CHOICES } from "@/lib/emoji-choices";
import { useSpeechToText } from "@/lib/use-speech";
import EmojiPicker from "@/components/EmojiPicker";

interface AddItemDialogProps {
  open: boolean;
  defaultCategoryId: CategoryId;
  onClose: () => void;
  onSave: (data: { label: string; emoji: string; categoryId: CategoryId }) => void;
}

export default function AddItemDialog({
  open,
  defaultCategoryId,
  onClose,
  onSave,
}: AddItemDialogProps) {
  const [label, setLabel] = useState("");
  const [emoji, setEmoji] = useState(EMOJI_CHOICES[0]);
  const [categoryId, setCategoryId] = useState<CategoryId>(defaultCategoryId);
  const labelInputRef = useRef<HTMLInputElement>(null);
  const headingId = useId();
  const { supported: sttSupported, listening, start, stop } = useSpeechToText();

  useEffect(() => {
    if (open) {
      // Resetting form fields when the dialog opens (an external trigger)
      // and moving focus for keyboard/screen reader users are both
      // legitimate synchronization-with-the-DOM effects.
      /* eslint-disable react-hooks/set-state-in-effect */
      setLabel("");
      setEmoji(EMOJI_CHOICES[0]);
      setCategoryId(defaultCategoryId);
      /* eslint-enable react-hooks/set-state-in-effect */
      const t = setTimeout(() => labelInputRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
    stop();
  }, [open, defaultCategoryId, stop]);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = label.trim();
    if (!trimmed) return;
    onSave({ label: trimmed, emoji, categoryId });
  }

  function handleMicClick() {
    if (listening) {
      stop();
    } else {
      start((text) => setLabel(text));
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        className="w-full max-w-md rounded-2xl border-2 border-border bg-surface p-6 shadow-xl"
      >
        <h2 id={headingId} className="font-display text-xl font-bold mb-4">
          Add your own picture
        </h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="item-label" className="block font-semibold mb-1">
            Word or phrase
          </label>
          <div className="mb-1 flex gap-2">
            <input
              ref={labelInputRef}
              id="item-label"
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              required
              maxLength={40}
              placeholder="e.g. Grandma's house"
              className="flex-1 rounded-xl border-2 border-border bg-background px-4 py-3 text-lg touch-target"
            />
            {sttSupported && (
              <button
                type="button"
                onClick={handleMicClick}
                aria-pressed={listening}
                aria-label={
                  listening
                    ? "Stop recording"
                    : "Use microphone to say the word or phrase"
                }
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
          <p aria-live="polite" className="mb-4 min-h-[1.25rem] text-sm text-muted">
            {listening ? "Listening… say the word or phrase." : ""}
          </p>

          <div className="mb-4">
            <EmojiPicker value={emoji} onChange={setEmoji} />
          </div>

          <label htmlFor="item-category" className="block font-semibold mb-1">
            Category
          </label>
          <select
            id="item-category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value as CategoryId)}
            className="mb-6 w-full rounded-xl border-2 border-border bg-background px-4 py-3 text-lg touch-target"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="touch-target flex-1 rounded-xl border-2 border-border bg-background font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="touch-target flex-1 rounded-xl border-2 border-brand bg-brand font-semibold text-brand-ink"
            >
              Add picture
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useId, useState } from "react";
import { DEFAULT_PICTURES } from "@/lib/first-then-data";
import { useCustomPictures, type PictureItem } from "@/lib/first-then-storage";
import { EMOJI_CHOICES } from "@/lib/emoji-choices";
import EmojiPicker from "@/components/EmojiPicker";

interface PicturePickerDialogProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onPick: (item: PictureItem) => void;
}

export default function PicturePickerDialog({
  open,
  title,
  onClose,
  onPick,
}: PicturePickerDialogProps) {
  const { customPictures, addCustomPicture, removeCustomPicture } = useCustomPictures();
  const [adding, setAdding] = useState(false);
  const [label, setLabel] = useState("");
  const [emoji, setEmoji] = useState(EMOJI_CHOICES[0]);
  const headingId = useId();

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      // Resetting the "add new" mini-form when the dialog closes (an
      // external trigger) is a legitimate synchronization-with-the-DOM
      // effect, not derived render state.
      /* eslint-disable react-hooks/set-state-in-effect */
      setAdding(false);
      setLabel("");
      setEmoji(EMOJI_CHOICES[0]);
      /* eslint-enable react-hooks/set-state-in-effect */
    }
  }, [open]);

  if (!open) return null;

  function handleAddSubmit(e: React.FormEvent) {
    e.preventDefault();
    const item = addCustomPicture(label, emoji);
    if (item) {
      onPick(item);
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
        className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-2xl border-2 border-border bg-surface p-6 shadow-xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 id={headingId} className="font-display text-xl font-bold">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="touch-target grid h-11 w-11 place-items-center rounded-full border-2 border-border bg-background"
          >
            ✕
          </button>
        </div>

        {!adding ? (
          <>
            <div className="mb-4 flex-1 overflow-y-auto">
              {customPictures.length > 0 && (
                <>
                  <p className="mb-1.5 text-sm font-semibold text-muted">Your pictures</p>
                  <div className="mb-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {customPictures.map((item) => (
                      <PictureButton
                        key={item.id}
                        item={item}
                        onPick={() => onPick(item)}
                        onRemove={() => removeCustomPicture(item.id)}
                      />
                    ))}
                  </div>
                </>
              )}
              <p className="mb-1.5 text-sm font-semibold text-muted">Pictures</p>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {DEFAULT_PICTURES.map((item) => (
                  <PictureButton key={item.id} item={item} onPick={() => onPick(item)} />
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="touch-target rounded-xl border-2 border-dashed border-border bg-background font-semibold text-muted hover:border-brand hover:text-foreground"
            >
              ➕ Add your own picture
            </button>
          </>
        ) : (
          <form onSubmit={handleAddSubmit} className="flex flex-1 flex-col overflow-y-auto">
            <label htmlFor="picture-label" className="mb-1 block font-semibold">
              Word or phrase
            </label>
            <input
              id="picture-label"
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              required
              maxLength={40}
              placeholder="e.g. Grandma's house"
              className="mb-4 w-full rounded-xl border-2 border-border bg-background px-4 py-3 text-lg touch-target"
            />
            <EmojiPicker value={emoji} onChange={setEmoji} />
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={() => setAdding(false)}
                className="touch-target flex-1 rounded-xl border-2 border-border bg-background font-semibold"
              >
                Back
              </button>
              <button
                type="submit"
                className="touch-target flex-1 rounded-xl border-2 border-brand bg-brand font-semibold text-brand-ink"
              >
                Add &amp; use
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function PictureButton({
  item,
  onPick,
  onRemove,
}: {
  item: PictureItem;
  onPick: () => void;
  onRemove?: () => void;
}) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onPick}
        className="touch-target flex w-full flex-col items-center justify-center gap-1 rounded-xl border-2 border-border bg-background p-2 text-center hover:border-brand"
      >
        <span aria-hidden="true" className="text-2xl leading-none">
          {item.emoji}
        </span>
        <span className="line-clamp-2 text-xs font-semibold leading-tight break-words">
          {item.label}
        </span>
      </button>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label={`Delete ${item.label}`}
          className="absolute -top-1.5 -right-1.5 grid h-6 w-6 place-items-center rounded-full border-2 border-border bg-surface text-xs shadow"
        >
          🗑️
        </button>
      )}
    </div>
  );
}

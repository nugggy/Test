"use client";

import { useEffect, useId, useRef, useState } from "react";
import { EMOJI_CHOICES } from "@/lib/emoji-choices";
import { useSpeechToText } from "@/lib/use-speech";

interface AddActivityDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { label: string; icon: string }) => void;
}

export default function AddActivityDialog({
  open,
  onClose,
  onSave,
}: AddActivityDialogProps) {
  const [label, setLabel] = useState("");
  const [icon, setIcon] = useState(EMOJI_CHOICES[0]);
  const labelInputRef = useRef<HTMLInputElement>(null);
  const headingId = useId();
  const { supported: sttSupported, listening, start, stop } = useSpeechToText();

  useEffect(() => {
    if (open) {
      /* eslint-disable react-hooks/set-state-in-effect */
      setLabel("");
      setIcon(EMOJI_CHOICES[0]);
      /* eslint-enable react-hooks/set-state-in-effect */
      const t = setTimeout(() => labelInputRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
    stop();
  }, [open, stop]);

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
    onSave({ label: trimmed, icon });
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
          Add your own activity
        </h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="activity-label" className="block font-semibold mb-1">
            Activity name
          </label>
          <div className="mb-1 flex gap-2">
            <input
              ref={labelInputRef}
              id="activity-label"
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              required
              maxLength={40}
              placeholder="e.g. Speech therapy"
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
                    : "Use microphone to say the activity name"
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
            {listening ? "Listening… say the activity name." : ""}
          </p>

          <span className="block font-semibold mb-1">Picture</span>
          <div className="mb-6 grid grid-cols-8 gap-1.5">
            {EMOJI_CHOICES.map((choice) => (
              <button
                key={choice}
                type="button"
                onClick={() => setIcon(choice)}
                aria-pressed={icon === choice}
                aria-label={`Use picture ${choice}`}
                className={`grid aspect-square place-items-center rounded-lg border-2 text-xl ${
                  icon === choice
                    ? "border-brand bg-brand/10"
                    : "border-border bg-background"
                }`}
              >
                {choice}
              </button>
            ))}
          </div>

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
              Add activity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

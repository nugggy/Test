"use client";

import { useEffect, useId, useState } from "react";
import { ACTIVITY_LIBRARY } from "@/lib/visual-schedule-data";
import { EMOJI_CHOICES } from "@/lib/emoji-choices";
import { useSpeechToText } from "@/lib/use-speech";

interface ActivityPickerDialogProps {
  open: boolean;
  dayLabel: string;
  onClose: () => void;
  onSave: (data: { label: string; icon: string }) => void;
}

export default function ActivityPickerDialog({
  open,
  dayLabel,
  onClose,
  onSave,
}: ActivityPickerDialogProps) {
  const [customOpen, setCustomOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [icon, setIcon] = useState(EMOJI_CHOICES[0]);
  const headingId = useId();
  const labelInputId = useId();
  const { supported: sttSupported, listening, start, stop } = useSpeechToText();

  useEffect(() => {
    if (open) {
      /* eslint-disable react-hooks/set-state-in-effect */
      setCustomOpen(false);
      setLabel("");
      setIcon(EMOJI_CHOICES[0]);
      /* eslint-enable react-hooks/set-state-in-effect */
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

  function handleMicClick() {
    if (listening) {
      stop();
    } else {
      start((text) => setLabel(text));
    }
  }

  function handleCustomSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = label.trim();
    if (!trimmed) return;
    onSave({ label: trimmed, icon });
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
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border-2 border-border bg-surface p-6 shadow-xl"
      >
        <h2 id={headingId} className="font-display text-xl font-bold mb-4">
          Add to {dayLabel}
        </h2>

        <div className="mb-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {ACTIVITY_LIBRARY.map((activity) => (
            <button
              key={activity.id}
              type="button"
              onClick={() => onSave({ label: activity.label, icon: activity.icon })}
              className="touch-target flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-border bg-background p-2 text-center hover:border-brand"
            >
              <span aria-hidden="true" className="text-2xl">
                {activity.icon}
              </span>
              <span className="text-xs font-semibold leading-tight">
                {activity.label}
              </span>
            </button>
          ))}
        </div>

        {!customOpen ? (
          <button
            type="button"
            onClick={() => setCustomOpen(true)}
            className="touch-target flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-background font-semibold hover:border-brand"
          >
            <span aria-hidden="true">➕</span> Add your own
          </button>
        ) : (
          <form onSubmit={handleCustomSubmit} className="border-t-2 border-border pt-4">
            <label htmlFor={labelInputId} className="block font-semibold mb-1">
              Activity name
            </label>
            <div className="mb-1 flex gap-2">
              <input
                id={labelInputId}
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                required
                maxLength={40}
                placeholder="e.g. Speech therapy"
                className="flex-1 rounded-xl border-2 border-border bg-background px-4 py-3 touch-target"
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
            {listening && (
              <p aria-live="polite" className="mb-2 text-sm text-muted">
                Listening…
              </p>
            )}

            <span className="block font-semibold mb-1 mt-3">Picture</span>
            <div className="mb-4 grid grid-cols-8 gap-1.5">
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

            <button
              type="submit"
              className="touch-target w-full rounded-xl border-2 border-brand bg-brand font-semibold text-brand-ink"
            >
              Add
            </button>
          </form>
        )}

        <button
          type="button"
          onClick={onClose}
          className="touch-target mt-4 w-full rounded-xl border-2 border-border bg-background font-semibold"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

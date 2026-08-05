"use client";

import { useState } from "react";
import { EMOTIONS, INTENSITY_LEVELS } from "@/lib/emotion-tracker-data";
import { useEmotionLog } from "@/lib/emotion-tracker-storage";
import EmotionHistory from "@/components/emotion-tracker/EmotionHistory";

export default function EmotionTracker() {
  const { entries, addEntry, removeEntry, clearAll } = useEmotionLog();
  const [selectedEmotionId, setSelectedEmotionId] = useState<string | null>(
    null
  );
  const [intensity, setIntensity] = useState(2);
  const [note, setNote] = useState("");
  const [confirmation, setConfirmation] = useState("");

  const selectedEmotion = EMOTIONS.find((e) => e.id === selectedEmotionId);

  function handleSave() {
    if (!selectedEmotion) return;
    addEntry({
      emotionId: selectedEmotion.id,
      intensity,
      note: note.trim() || undefined,
    });
    setConfirmation(`Logged: ${selectedEmotion.label}`);
    setSelectedEmotionId(null);
    setIntensity(2);
    setNote("");
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border-2 border-border bg-surface p-4">
        <h2 className="font-display mb-3 text-lg font-bold">
          How are you feeling right now?
        </h2>
        <div
          role="group"
          aria-label="Choose an emotion"
          className="grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {EMOTIONS.map((emotion) => (
            <button
              key={emotion.id}
              type="button"
              onClick={() => setSelectedEmotionId(emotion.id)}
              aria-pressed={selectedEmotionId === emotion.id}
              className="touch-target flex flex-col items-center justify-center gap-1 rounded-2xl border-2 p-3 text-center shadow-sm transition-transform active:scale-95"
              style={{
                background: `var(--${emotion.colorVar})`,
                color: `var(--${emotion.colorVar}-ink)`,
                borderColor:
                  selectedEmotionId === emotion.id
                    ? "var(--foreground)"
                    : "transparent",
              }}
            >
              <span aria-hidden="true" className="text-4xl leading-none">
                {emotion.emoji}
              </span>
              <span className="font-display text-sm font-bold sm:text-base">
                {emotion.label}
              </span>
            </button>
          ))}
        </div>

        {selectedEmotion && (
          <div className="mt-5 border-t-2 border-border pt-5">
            <span className="block font-semibold mb-2">
              How much {selectedEmotion.label.toLowerCase()}?
            </span>
            <div role="group" aria-label="Intensity" className="mb-4 flex gap-2">
              {INTENSITY_LEVELS.map((level) => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => setIntensity(level.value)}
                  aria-pressed={intensity === level.value}
                  className={`touch-target flex-1 rounded-xl border-2 font-semibold ${
                    intensity === level.value
                      ? "border-brand bg-brand text-brand-ink"
                      : "border-border bg-background"
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>

            <label htmlFor="emotion-note" className="block font-semibold mb-1">
              Anything you want to add? (optional)
            </label>
            <textarea
              id="emotion-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              maxLength={200}
              placeholder="e.g. Loud noises at lunch"
              className="mb-4 w-full rounded-xl border-2 border-border bg-background px-4 py-3 text-base"
            />

            <button
              type="button"
              onClick={handleSave}
              className="touch-target w-full rounded-xl border-2 border-brand bg-brand font-semibold text-brand-ink sm:w-auto sm:px-8"
            >
              Save check-in
            </button>
          </div>
        )}

        <p aria-live="polite" className="sr-only">
          {confirmation}
        </p>
      </div>

      <div className="rounded-2xl border-2 border-border bg-surface p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">History</h2>
          {entries.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="no-print text-sm font-semibold text-muted hover:text-foreground"
            >
              Clear history
            </button>
          )}
        </div>
        <EmotionHistory entries={entries} onRemove={removeEntry} />
      </div>
    </div>
  );
}

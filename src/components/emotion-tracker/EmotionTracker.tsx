"use client";

import { useState } from "react";
import { EMOTIONS, INTENSITY_LEVELS } from "@/lib/emotion-tracker-data";
import { useEmotionLog } from "@/lib/emotion-tracker-storage";
import { downloadCsv } from "@/lib/csv-export";
import Link from "next/link";
import EmotionHistory from "@/components/emotion-tracker/EmotionHistory";
import EmotionPatterns from "@/components/emotion-tracker/EmotionPatterns";
import CrisisContacts from "@/components/who-can-help-me/CrisisContacts";
import PrintButton from "@/components/PrintButton";
import { useTimezone } from "@/lib/timezone-context";

// Feelings where, if someone says they feel it "a lot", we gently show
// where to get support. This is signposting only, not an assessment.
const SUPPORT_PROMPT_EMOTIONS = ["sad", "angry", "scared"];

export default function EmotionTracker() {
  const { entries, addEntry, removeEntry, clearAll } = useEmotionLog();
  const [selectedEmotionId, setSelectedEmotionId] = useState<string | null>(
    null
  );
  const [intensity, setIntensity] = useState(2);
  const [note, setNote] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [showSupport, setShowSupport] = useState(false);
  const { timezone } = useTimezone();

  const selectedEmotion = EMOTIONS.find((e) => e.id === selectedEmotionId);

  function handleSave() {
    if (!selectedEmotion) return;
    addEntry({
      emotionId: selectedEmotion.id,
      intensity,
      note: note.trim() || undefined,
    });
    setConfirmation(
      `Saved: ${selectedEmotion.label}, ${
        INTENSITY_LEVELS.find((l) => l.value === intensity)?.label.toLowerCase() ?? ""
      }.`
    );
    setShowSupport(intensity === 3 && SUPPORT_PROMPT_EMOTIONS.includes(selectedEmotion.id));
    setSelectedEmotionId(null);
    setIntensity(2);
    setNote("");
  }

  function handleExportCsv() {
    downloadCsv(
      "emotion-history",
      ["Date", "Emotion", "Intensity", "Note"],
      entries.map((e) => [
        new Date(e.timestamp).toLocaleString("en-AU", { timeZone: timezone }),
        EMOTIONS.find((emo) => emo.id === e.emotionId)?.label ?? e.emotionId,
        INTENSITY_LEVELS.find((l) => l.value === e.intensity)?.label ?? e.intensity,
        e.note ?? "",
      ])
    );
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
              onClick={() => {
                setSelectedEmotionId(emotion.id);
                setConfirmation("");
                setShowSupport(false);
              }}
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

        <div aria-live="polite">
          {confirmation && (
            <p className="mt-4 rounded-xl border-2 border-brand bg-brand-soft px-4 py-3 font-semibold">
              <span aria-hidden="true">✅ </span>
              {confirmation}
            </p>
          )}
        </div>

        {showSupport && (
          <div className="mt-4 flex flex-col gap-3">
            <p className="rounded-xl border-2 border-border bg-background px-4 py-3">
              That sounds like a lot to feel. You don&apos;t have to handle it
              on your own. You could try something from your{" "}
              <Link
                href="/tools/emotional-regulation-plan"
                className="font-semibold text-brand underline hover:no-underline"
              >
                calm-down plan
              </Link>
              , or talk to someone you trust.
            </p>
            <CrisisContacts ids={["lifeline", "kids-helpline", "13yarn", "beyond-blue"]} />
          </div>
        )}
      </div>

      {entries.length > 0 && (
        <div className="rounded-2xl border-2 border-border bg-surface p-4">
          <h2 className="font-display mb-3 text-lg font-bold">Patterns</h2>
          <EmotionPatterns entries={entries} />
        </div>
      )}

      <div className="rounded-2xl border-2 border-border bg-surface p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-lg font-bold">History</h2>
          {entries.length > 0 && (
            <div className="no-print flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleExportCsv}
                className="touch-target rounded-xl border-2 border-border bg-background px-3 text-sm font-semibold hover:border-brand"
              >
                ⬇️ Download CSV
              </button>
              <PrintButton label="Print" />
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Clear all check-ins? This can't be undone.")) {
                    clearAll();
                  }
                }}
                className="touch-target rounded-xl border-2 border-border bg-background px-3 text-sm font-semibold text-muted hover:text-foreground"
              >
                Clear history
              </button>
            </div>
          )}
        </div>
        <EmotionHistory
          entries={entries}
          onRemove={(id) => {
            if (window.confirm("Delete this check-in?")) removeEntry(id);
          }}
        />
      </div>
    </div>
  );
}

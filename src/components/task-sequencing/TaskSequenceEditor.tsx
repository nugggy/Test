"use client";

import { useState } from "react";
import type { TaskSequence } from "@/lib/task-sequencing-storage";
import EmojiPicker from "@/components/EmojiPicker";
import { useSpeech } from "@/lib/use-speech";

interface TaskSequenceEditorProps {
  sequence: TaskSequence;
  onAddStep: (label: string, emoji: string) => void;
  onRemoveStep: (stepId: string) => void;
  onMoveStep: (stepId: string, direction: "up" | "down") => void;
  onToggleStepDone: (stepId: string) => void;
  onResetSequence: () => void;
  onRemoveSequence: () => void;
  onClose: () => void;
}

export default function TaskSequenceEditor({
  sequence,
  onAddStep,
  onRemoveStep,
  onMoveStep,
  onToggleStepDone,
  onResetSequence,
  onRemoveSequence,
  onClose,
}: TaskSequenceEditorProps) {
  const [mode, setMode] = useState<"edit" | "run">("edit");
  const [label, setLabel] = useState("");
  const [emoji, setEmoji] = useState("✨");
  const { speak, supported: speechSupported } = useSpeech();

  function handleAddStep(e: React.FormEvent) {
    e.preventDefault();
    if (!label.trim()) return;
    onAddStep(label, emoji);
    setLabel("");
    setEmoji("✨");
  }

  const nextStep = sequence.steps.find((step) => !step.done);
  const doneCount = sequence.steps.filter((step) => step.done).length;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border-2 border-border bg-surface p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-lg font-bold">{sequence.name}</h2>
        <button
          type="button"
          onClick={onClose}
          className="touch-target rounded-xl border-2 border-border bg-background px-3 text-sm font-semibold"
        >
          ← Back to my sequences
        </button>
      </div>

      {sequence.steps.length > 0 && (
        <div role="group" aria-label="View" className="no-print flex gap-2">
          <button
            type="button"
            onClick={() => setMode("edit")}
            aria-pressed={mode === "edit"}
            className={`touch-target flex-1 rounded-xl border-2 font-semibold ${
              mode === "edit" ? "border-brand bg-brand text-brand-ink" : "border-border bg-background"
            }`}
          >
            Edit steps
          </button>
          <button
            type="button"
            onClick={() => setMode("run")}
            aria-pressed={mode === "run"}
            className={`touch-target flex-1 rounded-xl border-2 font-semibold ${
              mode === "run" ? "border-brand bg-brand text-brand-ink" : "border-border bg-background"
            }`}
          >
            ▶️ Run this task
          </button>
        </div>
      )}

      {mode === "run" ? (
        sequence.steps.length === 0 ? (
          <p className="rounded-xl border-2 border-dashed border-border p-6 text-center text-muted">
            Add some steps first.
          </p>
        ) : !nextStep ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border-2 border-brand bg-brand/10 p-8 text-center">
            <span aria-hidden="true" className="text-5xl">
              🎉
            </span>
            <p className="font-display text-xl font-bold">All done!</p>
            <button
              type="button"
              onClick={onResetSequence}
              className="touch-target rounded-xl border-2 border-brand bg-brand px-4 font-semibold text-brand-ink"
            >
              ↺ Start again
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 rounded-2xl border-2 border-brand bg-brand/10 p-8 text-center">
            <p className="text-sm font-semibold text-muted">
              Step {doneCount + 1} of {sequence.steps.length}
            </p>
            <span aria-hidden="true" className="text-6xl">
              {nextStep.emoji}
            </span>
            <p className="font-display text-2xl font-bold">{nextStep.label}</p>
            {speechSupported && (
              <button
                type="button"
                onClick={() => speak(nextStep.label)}
                aria-label={`Hear "${nextStep.label}"`}
                className="touch-target rounded-xl border-2 border-border bg-surface px-4 text-sm font-semibold"
              >
                🔊 Hear this step
              </button>
            )}
            <button
              type="button"
              onClick={() => onToggleStepDone(nextStep.id)}
              className="touch-target rounded-xl border-2 border-brand bg-brand px-6 text-lg font-bold text-brand-ink"
            >
              ✅ Done - next step
            </button>
          </div>
        )
      ) : (
        <>
          {sequence.steps.length > 0 && (
            <ul className="flex flex-col gap-2">
              {sequence.steps.map((step, index) => (
                <li
                  key={step.id}
                  className={`flex items-center gap-3 rounded-xl border-2 p-3 ${
                    step.done ? "border-brand/40 bg-brand/5 opacity-70" : "border-border bg-background"
                  }`}
                >
                  <span className="font-display w-6 shrink-0 text-center text-sm font-bold text-muted">
                    {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => onToggleStepDone(step.id)}
                    aria-pressed={step.done}
                    aria-label={step.done ? `Mark ${step.label} as not done` : `Mark ${step.label} as done`}
                    className="touch-target flex flex-1 items-center gap-3 rounded-lg text-left"
                  >
                    <span aria-hidden="true" className="shrink-0 text-2xl">
                      {step.emoji}
                    </span>
                    <span className={`font-semibold ${step.done ? "line-through" : ""}`}>
                      {step.label}
                    </span>
                  </button>
                  <div className="no-print flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => onMoveStep(step.id, "up")}
                      disabled={index === 0}
                      aria-label={`Move ${step.label} earlier`}
                      className="grid h-8 w-8 place-items-center rounded-lg border-2 border-border bg-surface disabled:opacity-30"
                    >
                      <span aria-hidden="true">▲</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onMoveStep(step.id, "down")}
                      disabled={index === sequence.steps.length - 1}
                      aria-label={`Move ${step.label} later`}
                      className="grid h-8 w-8 place-items-center rounded-lg border-2 border-border bg-surface disabled:opacity-30"
                    >
                      <span aria-hidden="true">▼</span>
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveStep(step.id)}
                    aria-label={`Remove ${step.label}`}
                    className="no-print grid h-9 w-9 shrink-0 place-items-center rounded-lg border-2 border-border bg-surface"
                  >
                    <span aria-hidden="true">🗑️</span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          <form onSubmit={handleAddStep} className="flex flex-col gap-3 rounded-xl border-2 border-dashed border-border p-3">
            <EmojiPicker value={emoji} onChange={setEmoji} label="Step picture" />
            <div className="flex gap-2">
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. Wet the toothbrush"
                maxLength={80}
                className="touch-target flex-1 rounded-xl border-2 border-border bg-background px-4"
              />
              <button
                type="submit"
                className="touch-target shrink-0 rounded-xl border-2 border-brand bg-brand px-4 font-semibold text-brand-ink"
              >
                + Add step
              </button>
            </div>
          </form>
        </>
      )}

      <div className="no-print flex justify-end">
        <button
          type="button"
          onClick={() => {
            if (window.confirm(`Delete "${sequence.name}"? This can't be undone.`)) {
              onRemoveSequence();
            }
          }}
          className="text-sm font-semibold text-muted hover:text-foreground"
        >
          Delete this sequence
        </button>
      </div>
    </div>
  );
}

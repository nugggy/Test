"use client";

import { useState } from "react";
import type { TaskSequence } from "@/lib/task-sequencing-storage";
import EmojiPicker from "@/components/EmojiPicker";
import PrintButton from "@/components/PrintButton";
import { useSpeech } from "@/lib/use-speech";

interface TaskSequenceEditorProps {
  sequence: TaskSequence;
  onRename: (name: string) => void;
  onAddStep: (label: string, emoji: string) => void;
  onRemoveStep: (stepId: string) => void;
  onMoveStep: (stepId: string, direction: "up" | "down") => void;
  onUpdateStep: (stepId: string, changes: { label?: string; emoji?: string }) => void;
  onToggleStepDone: (stepId: string) => void;
  onResetSequence: () => void;
  onRemoveSequence: () => void;
  onClose: () => void;
}

export default function TaskSequenceEditor({
  sequence,
  onRename,
  onAddStep,
  onRemoveStep,
  onMoveStep,
  onUpdateStep,
  onToggleStepDone,
  onResetSequence,
  onRemoveSequence,
  onClose,
}: TaskSequenceEditorProps) {
  // Someone opening a sequence that already has steps most likely wants to
  // do the task, so start in run mode. Empty sequences start in edit mode.
  const [mode, setMode] = useState<"edit" | "run">(sequence.steps.length > 0 ? "run" : "edit");
  const [label, setLabel] = useState("");
  const [emoji, setEmoji] = useState("✨");
  const [readAloud, setReadAloud] = useState(false);
  const [pickerFor, setPickerFor] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const { speak, supported: speechSupported } = useSpeech();

  function handleAddStep(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = label.trim();
    if (!trimmed) return;
    onAddStep(trimmed, emoji);
    setLabel("");
    setEmoji("✨");
    setStatus(`Step "${trimmed}" added.`);
  }

  const steps = sequence.steps;
  const nextIndex = steps.findIndex((step) => !step.done);
  const nextStep = nextIndex === -1 ? undefined : steps[nextIndex];
  const comingUp = nextIndex === -1 ? undefined : steps.slice(nextIndex + 1).find((s) => !s.done);
  const doneCount = steps.filter((step) => step.done).length;
  // The step to un-tick for "Go back": the last done step before the
  // current one (or the very last done step once everything is finished).
  const searchUpTo = nextIndex === -1 ? steps.length : nextIndex;
  const previousDone = [...steps.slice(0, searchUpTo)].reverse().find((s) => s.done);

  function handleDone() {
    if (!nextStep) return;
    onToggleStepDone(nextStep.id);
    if (readAloud) {
      speak(comingUp ? comingUp.label : "All done. Well done!");
    }
  }

  function handleGoBack() {
    if (!previousDone) return;
    onToggleStepDone(previousDone.id);
    if (readAloud) speak(previousDone.label);
  }

  function handleToggleReadAloud() {
    const turningOn = !readAloud;
    setReadAloud(turningOn);
    if (turningOn && nextStep) speak(nextStep.label);
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border-2 border-border bg-surface p-4">
      <div className="no-print flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-lg font-bold">{sequence.name}</h2>
        <button
          type="button"
          onClick={onClose}
          className="touch-target rounded-xl border-2 border-border bg-background px-3 text-sm font-semibold"
        >
          ← Back to my sequences
        </button>
      </div>

      {steps.length > 0 && (
        <div role="group" aria-label="View" className="no-print flex gap-2">
          <button
            type="button"
            onClick={() => setMode("run")}
            aria-pressed={mode === "run"}
            className={`touch-target flex-1 rounded-xl border-2 font-semibold ${
              mode === "run" ? "border-brand bg-brand text-brand-ink" : "border-border bg-background"
            }`}
          >
            ▶️ Do this task
          </button>
          <button
            type="button"
            onClick={() => setMode("edit")}
            aria-pressed={mode === "edit"}
            className={`touch-target flex-1 rounded-xl border-2 font-semibold ${
              mode === "edit" ? "border-brand bg-brand text-brand-ink" : "border-border bg-background"
            }`}
          >
            ✏️ Edit steps
          </button>
        </div>
      )}

      {mode === "run" && steps.length > 0 ? (
        <div className="no-print flex flex-col gap-3">
          {/* Progress: one dot per step, so progress is visible without reading */}
          <div className="flex flex-wrap justify-center gap-2" aria-hidden="true">
            {steps.map((step) => (
              <span
                key={step.id}
                className={`h-4 w-4 rounded-full border-2 ${
                  step.done
                    ? "border-brand bg-brand"
                    : step.id === nextStep?.id
                      ? "border-brand bg-surface"
                      : "border-border bg-background"
                }`}
              />
            ))}
          </div>

          {!nextStep ? (
            <div
              aria-live="polite"
              className="flex flex-col items-center gap-4 rounded-2xl border-2 border-brand bg-brand-soft p-8 text-center"
            >
              <span aria-hidden="true" className="text-6xl">
                🎉
              </span>
              <p className="font-display text-2xl font-bold">All done!</p>
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={handleGoBack}
                  disabled={!previousDone}
                  className="touch-target rounded-xl border-2 border-border bg-surface px-4 font-semibold disabled:opacity-40"
                >
                  ← Go back a step
                </button>
                <button
                  type="button"
                  onClick={onResetSequence}
                  className="touch-target rounded-xl border-2 border-brand bg-brand px-4 font-semibold text-brand-ink"
                >
                  ↺ Start again
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 rounded-2xl border-2 border-brand bg-brand-soft p-6 text-center sm:p-8">
              <div aria-live="polite" className="flex flex-col items-center gap-3">
                <p className="font-semibold text-muted">
                  Step {nextIndex + 1} of {steps.length}
                </p>
                <span aria-hidden="true" className="text-8xl leading-none">
                  {nextStep.emoji}
                </span>
                <p className="font-display text-2xl font-bold sm:text-3xl">{nextStep.label}</p>
              </div>
              <button
                type="button"
                onClick={handleDone}
                className="touch-target w-full max-w-sm rounded-xl border-2 border-brand bg-brand px-6 text-xl font-bold text-brand-ink"
              >
                ✅ Done
              </button>
              <div className="flex flex-wrap justify-center gap-2">
                {speechSupported && (
                  <button
                    type="button"
                    onClick={() => speak(nextStep.label)}
                    className="touch-target rounded-xl border-2 border-border bg-surface px-4 font-semibold"
                  >
                    🔊 Hear this step
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleGoBack}
                  disabled={!previousDone}
                  className="touch-target rounded-xl border-2 border-border bg-surface px-4 font-semibold disabled:opacity-40"
                >
                  ← Go back a step
                </button>
              </div>
              {comingUp && (
                <p className="text-muted">
                  Next: <span aria-hidden="true">{comingUp.emoji}</span> {comingUp.label}
                </p>
              )}
            </div>
          )}

          {speechSupported && (
            <button
              type="button"
              onClick={handleToggleReadAloud}
              aria-pressed={readAloud}
              className={`touch-target self-center rounded-xl border-2 px-4 font-semibold ${
                readAloud ? "border-brand bg-brand text-brand-ink" : "border-border bg-background"
              }`}
            >
              {readAloud ? "🔊 Read each step aloud: on" : "🔈 Read each step aloud: off"}
            </button>
          )}
        </div>
      ) : (
        <div className="no-print flex flex-col gap-3">
          <div>
            <label htmlFor="sequence-name" className="mb-1 block text-sm font-semibold">
              Task name
            </label>
            <input
              id="sequence-name"
              type="text"
              value={sequence.name}
              onChange={(e) => onRename(e.target.value)}
              onBlur={(e) => {
                if (!e.target.value.trim()) onRename("My task");
              }}
              maxLength={60}
              className="touch-target w-full rounded-xl border-2 border-border bg-background px-4 font-semibold"
            />
          </div>

          {doneCount > 0 && (
            <button
              type="button"
              onClick={onResetSequence}
              className="touch-target self-start rounded-xl border-2 border-border bg-background px-4 font-semibold"
            >
              ↺ Untick all steps
            </button>
          )}

          {steps.length > 0 && (
            <ol className="flex flex-col gap-3">
              {steps.map((step, index) => (
                <li
                  key={step.id}
                  className="flex flex-col gap-2 rounded-xl border-2 border-border bg-background p-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-display w-6 shrink-0 text-center font-bold text-muted">
                      {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPickerFor(pickerFor === step.id ? null : step.id)}
                      aria-expanded={pickerFor === step.id}
                      aria-label={`Change picture for step ${index + 1}`}
                      className="touch-target grid shrink-0 place-items-center rounded-xl border-2 border-border bg-surface text-3xl"
                    >
                      <span aria-hidden="true">{step.emoji}</span>
                    </button>
                    <label htmlFor={`step-label-${step.id}`} className="sr-only">
                      Words for step {index + 1}
                    </label>
                    <input
                      id={`step-label-${step.id}`}
                      type="text"
                      value={step.label}
                      onChange={(e) => onUpdateStep(step.id, { label: e.target.value })}
                      maxLength={80}
                      className={`touch-target min-w-0 flex-1 rounded-xl border-2 border-border bg-surface px-3 font-semibold ${
                        step.done ? "line-through" : ""
                      }`}
                    />
                  </div>
                  {pickerFor === step.id && (
                    <div className="rounded-xl border-2 border-border bg-surface p-3">
                      <EmojiPicker
                        value={step.emoji}
                        onChange={(value) => onUpdateStep(step.id, { emoji: value })}
                        label={`Picture for step ${index + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => setPickerFor(null)}
                        className="touch-target mt-2 rounded-xl border-2 border-brand bg-brand px-4 font-semibold text-brand-ink"
                      >
                        Done
                      </button>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onMoveStep(step.id, "up")}
                      disabled={index === 0}
                      aria-label={`Move step ${index + 1} earlier`}
                      className="touch-target rounded-xl border-2 border-border bg-surface px-3 text-sm font-semibold disabled:opacity-40"
                    >
                      ▲ Earlier
                    </button>
                    <button
                      type="button"
                      onClick={() => onMoveStep(step.id, "down")}
                      disabled={index === steps.length - 1}
                      aria-label={`Move step ${index + 1} later`}
                      className="touch-target rounded-xl border-2 border-border bg-surface px-3 text-sm font-semibold disabled:opacity-40"
                    >
                      ▼ Later
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onRemoveStep(step.id);
                        setStatus(`Step "${step.label}" removed.`);
                      }}
                      aria-label={`Remove step ${index + 1}: ${step.label}`}
                      className="touch-target rounded-xl border-2 border-border bg-surface px-3 text-sm font-semibold"
                    >
                      🗑️ Remove
                    </button>
                  </div>
                </li>
              ))}
            </ol>
          )}

          <form
            onSubmit={handleAddStep}
            className="flex flex-col gap-3 rounded-xl border-2 border-dashed border-border p-3"
          >
            <h3 className="font-display font-bold">Add a step</h3>
            <EmojiPicker value={emoji} onChange={setEmoji} label="Step picture" />
            <label htmlFor="new-step-label" className="text-sm font-semibold">
              What to do (keep it short)
            </label>
            <div className="flex flex-wrap gap-2">
              <input
                id="new-step-label"
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. Wet the toothbrush"
                maxLength={80}
                className="touch-target min-w-0 flex-1 rounded-xl border-2 border-border bg-background px-4"
              />
              <button
                type="submit"
                disabled={!label.trim()}
                className="touch-target shrink-0 rounded-xl border-2 border-brand bg-brand px-4 font-semibold text-brand-ink disabled:opacity-40"
              >
                + Add step
              </button>
            </div>
          </form>
          <p aria-live="polite" className="min-h-[1.25rem] text-sm text-muted">
            {status}
          </p>
        </div>
      )}

      {/* Printed: the whole sequence as a numbered picture strip */}
      <div className="hidden print:block">
        <h2 className="font-display mb-4 text-2xl font-bold">{sequence.name}</h2>
        <ol className="grid grid-cols-3 gap-4">
          {steps.map((step, index) => (
            <li
              key={step.id}
              className="print-avoid-break flex flex-col items-center gap-2 rounded-2xl border-2 border-border p-4 text-center"
            >
              <span className="font-display text-lg font-bold">{index + 1}</span>
              <span aria-hidden="true" className="text-6xl">
                {step.emoji}
              </span>
              <span className="font-display text-lg font-bold">{step.label}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="no-print flex flex-wrap items-center justify-between gap-2">
        <PrintButton label="Print steps" disabled={steps.length === 0} />
        <button
          type="button"
          onClick={() => {
            if (window.confirm(`Delete "${sequence.name}"? This can't be undone.`)) {
              onRemoveSequence();
            }
          }}
          className="touch-target rounded-xl border-2 border-border bg-background px-4 text-sm font-semibold"
        >
          🗑️ Delete this sequence
        </button>
      </div>
    </div>
  );
}

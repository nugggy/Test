"use client";

import { useEffect, useRef, useState } from "react";
import type { DailyTask } from "@/lib/daily-life-storage";
import type { ChecklistItem } from "@/components/ChecklistSection";
import { useSpeech } from "@/lib/use-speech";

interface StepByStepViewProps {
  task: DailyTask;
  onStepsChange: (steps: ChecklistItem[]) => void;
  onClose: () => void;
}

/**
 * Shows one step at a time, big and clear, with a read-aloud button - for
 * people who find a long list hard to follow (e.g. with an intellectual
 * disability or brain injury). Ticking "Done" marks the step and moves on.
 */
export default function StepByStepView({ task, onStepsChange, onClose }: StepByStepViewProps) {
  const { speak, stop, supported } = useSpeech();
  const firstUndone = task.steps.findIndex((s) => !s.done);
  const [index, setIndex] = useState(firstUndone === -1 ? 0 : firstUndone);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const total = task.steps.length;
  const step = task.steps[Math.min(index, total - 1)];
  const allDone = total > 0 && task.steps.every((s) => s.done);

  useEffect(() => {
    headingRef.current?.focus();
  }, [index]);

  useEffect(() => stop, [stop]);

  if (!step) return null;

  function markDoneAndNext() {
    onStepsChange(task.steps.map((s) => (s.id === step.id ? { ...s, done: true } : s)));
    if (index < total - 1) setIndex(index + 1);
  }

  return (
    <div className="rounded-2xl border-2 border-brand bg-brand-soft p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="font-semibold">
          <span aria-hidden="true">{task.emoji} </span>
          {task.title}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="touch-target rounded-xl border-2 border-border bg-surface px-4 font-semibold"
        >
          Show all steps
        </button>
      </div>

      <div aria-live="polite" className="rounded-2xl border-2 border-border bg-surface p-5 text-center">
        <p className="text-sm font-semibold text-muted">
          Step {index + 1} of {total}
        </p>
        <h3
          ref={headingRef}
          tabIndex={-1}
          className={`font-display mt-2 text-3xl font-bold leading-snug ${step.done ? "text-muted line-through" : ""}`}
        >
          {step.text}
        </h3>
        {step.done && (
          <p className="mt-2 font-semibold">
            <span aria-hidden="true">✅ </span>Done
          </p>
        )}
        {allDone && (
          <p className="mt-3 font-display text-xl font-bold">
            <span aria-hidden="true">🎉 </span>All steps done. Well done!
          </p>
        )}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <button
          type="button"
          onClick={() => setIndex(Math.max(0, index - 1))}
          disabled={index === 0}
          className="touch-target rounded-xl border-2 border-border bg-surface px-3 font-semibold disabled:opacity-40"
        >
          <span aria-hidden="true">⬅️ </span>Back
        </button>
        {supported ? (
          <button
            type="button"
            onClick={() => speak(step.text)}
            className="touch-target rounded-xl border-2 border-border bg-surface px-3 font-semibold"
          >
            <span aria-hidden="true">🔊 </span>Read it to me
          </button>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={markDoneAndNext}
          disabled={step.done && index === total - 1}
          className="touch-target col-span-2 rounded-xl border-2 border-brand bg-brand px-3 text-lg font-bold text-brand-ink disabled:opacity-40 sm:col-span-1"
        >
          <span aria-hidden="true">✔️ </span>
          {step.done ? "Next" : index === total - 1 ? "Done" : "Done, next step"}
        </button>
        <button
          type="button"
          onClick={() => setIndex(Math.min(total - 1, index + 1))}
          disabled={index >= total - 1}
          className="touch-target rounded-xl border-2 border-border bg-surface px-3 font-semibold disabled:opacity-40"
        >
          Skip<span aria-hidden="true"> ➡️</span>
        </button>
      </div>
    </div>
  );
}

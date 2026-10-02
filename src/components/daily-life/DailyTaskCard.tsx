"use client";

import { useState } from "react";
import type { DailyTask } from "@/lib/daily-life-storage";
import ChecklistSection from "@/components/ChecklistSection";
import EmojiPicker from "@/components/EmojiPicker";
import StepByStepView from "./StepByStepView";

interface DailyTaskCardProps {
  task: DailyTask;
  onChange: (patch: Partial<Omit<DailyTask, "id">>) => void;
  onReset: () => void;
  onRemove: () => void;
}

export default function DailyTaskCard({
  task,
  onChange,
  onReset,
  onRemove,
}: DailyTaskCardProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [stepMode, setStepMode] = useState(false);
  const doneCount = task.steps.filter((s) => s.done).length;
  const allDone = task.steps.length > 0 && doneCount === task.steps.length;

  return (
    <div className="print-avoid-break rounded-2xl border-2 border-border bg-surface p-4">
      <div className="mb-2 flex items-start gap-2">
        <button
          type="button"
          onClick={() => setPickerOpen((v) => !v)}
          aria-expanded={pickerOpen}
          aria-label="Change picture"
          className="no-print touch-target w-16 shrink-0 rounded-xl border-2 border-border bg-background text-2xl"
        >
          {task.emoji}
        </button>
        <span aria-hidden="true" className="hidden print:block text-2xl">
          {task.emoji}
        </span>
        <input
          type="text"
          value={task.title}
          onChange={(e) => onChange({ title: e.target.value })}
          maxLength={140}
          placeholder="Task"
          aria-label="Task name"
          className="touch-target flex-1 rounded-xl border-2 border-border bg-background px-3 text-base font-bold"
        />
        <button
          type="button"
          onClick={() => {
            if (window.confirm(`Delete the task "${task.title || "task"}" and all its steps?`)) {
              onRemove();
            }
          }}
          aria-label={`Delete task "${task.title}"`}
          className="no-print touch-target shrink-0 rounded-xl border-2 border-border bg-background px-3"
        >
          <span aria-hidden="true">🗑️</span>
        </button>
      </div>

      {pickerOpen && (
        <div className="no-print mb-3">
          <EmojiPicker
            value={task.emoji}
            onChange={(emoji) => {
              onChange({ emoji });
              setPickerOpen(false);
            }}
          />
        </div>
      )}

      {task.steps.length > 0 && (
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold" aria-live="polite">
            {allDone ? (
              <>
                <span aria-hidden="true">🎉 </span>All done!
              </>
            ) : (
              `${doneCount} of ${task.steps.length} steps done`
            )}
          </p>
          <div className="no-print flex flex-wrap gap-2">
            {!stepMode && (
              <button
                type="button"
                onClick={() => setStepMode(true)}
                className="touch-target rounded-xl border-2 border-brand bg-brand px-4 font-semibold text-brand-ink"
              >
                <span aria-hidden="true">▶️ </span>Do it one step at a time
              </button>
            )}
            {doneCount > 0 && (
              <button
                type="button"
                onClick={onReset}
                className="touch-target rounded-xl border-2 border-border bg-background px-3 text-sm font-semibold hover:border-brand"
              >
                Reset for next time
              </button>
            )}
          </div>
        </div>
      )}

      {stepMode && task.steps.length > 0 ? (
        <div className="no-print">
          <StepByStepView
            task={task}
            onStepsChange={(steps) => onChange({ steps })}
            onClose={() => setStepMode(false)}
          />
        </div>
      ) : null}

      <div className={stepMode ? "hidden print:block" : undefined}>
        <ChecklistSection
          title="Steps"
          description="Break the task into small steps, in order"
          placeholder="e.g. Put clothes in the machine"
          items={task.steps}
          onChange={(steps) => onChange({ steps })}
        />
      </div>
    </div>
  );
}

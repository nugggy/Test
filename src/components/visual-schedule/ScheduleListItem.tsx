"use client";

import { useId, useState } from "react";
import type { ScheduleItem } from "@/lib/visual-schedule-storage";
import { useCountdown } from "@/lib/use-countdown";
import { playAlertBeep, vibrateAlert } from "@/lib/alert-sound";
import TimerFace from "@/components/TimerFace";

export type StepStatus = "now" | "next" | "later" | "done";

interface ScheduleListItemProps {
  item: ScheduleItem;
  index: number;
  isLast: boolean;
  status: StepStatus;
  editing: boolean;
  draggedId: string | null;
  onToggleDone: (id: string) => void;
  onRemove: (id: string) => void;
  onMove: (id: string, direction: "up" | "down") => void;
  onSetDuration: (id: string, minutes: number) => void;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  onDropBefore: (id: string) => void;
}

const DURATION_PRESETS = [0, 1, 2, 5, 10, 15, 20, 30, 45, 60];

const STATUS_BADGE: Record<StepStatus, { text: string; className: string } | null> = {
  now: { text: "Now", className: "bg-brand text-brand-ink border-brand" },
  next: { text: "Next", className: "bg-surface border-border" },
  done: { text: "Done", className: "bg-surface border-border text-muted" },
  later: null,
};

const BUTTON = "touch-target rounded-xl border-2 border-border bg-surface px-3 text-sm font-semibold";

export default function ScheduleListItem({
  item,
  index,
  isLast,
  status,
  editing,
  draggedId,
  onToggleDone,
  onRemove,
  onMove,
  onSetDuration,
  onDragStart,
  onDragEnd,
  onDropBefore,
}: ScheduleListItemProps) {
  const [timerOpen, setTimerOpen] = useState(false);
  const durationId = useId();
  const { remainingSeconds, running, finished, start, pause, reset } = useCountdown(
    item.durationMinutes * 60,
    () => {
      playAlertBeep();
      vibrateAlert();
    }
  );

  const isDragging = draggedId === item.id;
  const badge = STATUS_BADGE[status];

  const rowClass =
    status === "now"
      ? "border-brand bg-brand-soft"
      : status === "done"
        ? "border-border bg-surface-2 opacity-75"
        : "border-border bg-background";

  return (
    <li
      draggable={editing}
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        onDragStart(item.id);
      }}
      onDragEnd={onDragEnd}
      onDragOver={(e) => {
        if (draggedId && draggedId !== item.id) e.preventDefault();
      }}
      onDrop={(e) => {
        e.preventDefault();
        if (draggedId && draggedId !== item.id) onDropBefore(item.id);
      }}
      aria-current={status === "now" ? "step" : undefined}
      className={`print-avoid-break flex flex-col gap-2 rounded-xl border-2 p-3 ${rowClass} ${
        isDragging ? "opacity-40" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        {editing && (
          <span
            aria-hidden="true"
            title="Drag to reorder"
            className="no-print hidden shrink-0 cursor-grab text-muted sm:block"
          >
            ⠿
          </span>
        )}
        <span className="font-display w-6 shrink-0 text-center text-sm font-bold text-muted">
          {index + 1}
        </span>
        <button
          type="button"
          onClick={() => onToggleDone(item.id)}
          aria-pressed={item.done}
          aria-label={
            item.done
              ? `${item.label}, done. Tap to mark as not done`
              : `${item.label}${status === "now" ? ", now" : status === "next" ? ", next" : ""}. Tap to mark as done`
          }
          className="touch-target flex flex-1 items-center gap-3 rounded-lg text-left"
        >
          <span aria-hidden="true" className="shrink-0 text-4xl">
            {item.icon}
          </span>
          <span
            className={`font-display text-base font-bold sm:text-lg ${
              item.done ? "line-through" : ""
            }`}
          >
            {item.label}
          </span>
          <span className="ml-auto flex shrink-0 items-center gap-2">
            {item.durationMinutes > 0 && (
              <span className="text-xs font-semibold text-muted">
                {item.durationMinutes} min
              </span>
            )}
            {badge && (
              <span
                className={`font-display rounded-full border-2 px-3 py-0.5 text-xs font-bold uppercase ${badge.className}`}
              >
                {badge.text}
              </span>
            )}
            {item.done && (
              <span aria-hidden="true" className="text-2xl">
                ✅
              </span>
            )}
          </span>
        </button>
      </div>

      {editing && (
        <div className="no-print flex flex-wrap items-center gap-2 pl-9">
          <button
            type="button"
            onClick={() => onMove(item.id, "up")}
            disabled={index === 0}
            aria-label={`Move ${item.label} earlier`}
            className={`${BUTTON} disabled:opacity-30`}
          >
            <span aria-hidden="true">▲</span> Earlier
          </button>
          <button
            type="button"
            onClick={() => onMove(item.id, "down")}
            disabled={isLast}
            aria-label={`Move ${item.label} later`}
            className={`${BUTTON} disabled:opacity-30`}
          >
            <span aria-hidden="true">▼</span> Later
          </button>
          <label htmlFor={durationId} className="flex items-center gap-2 text-sm font-semibold">
            Timer
            <select
              id={durationId}
              value={item.durationMinutes}
              onChange={(e) => onSetDuration(item.id, Number(e.target.value))}
              className="touch-target rounded-xl border-2 border-border bg-surface px-3"
            >
              {(DURATION_PRESETS.includes(item.durationMinutes)
                ? DURATION_PRESETS
                : [...DURATION_PRESETS, item.durationMinutes].sort((a, b) => a - b)
              ).map((minutes) => (
                <option key={minutes} value={minutes}>
                  {minutes === 0 ? "No timer" : `${minutes} min`}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Remove "${item.label}" from the schedule?`)) onRemove(item.id);
            }}
            aria-label={`Remove ${item.label} from schedule`}
            className={BUTTON}
          >
            <span aria-hidden="true">🗑️</span> Remove
          </button>
        </div>
      )}

      {!editing && item.durationMinutes > 0 && !item.done && (
        <div className="no-print flex flex-wrap items-center gap-2 pl-9">
          {!timerOpen ? (
            <button type="button" onClick={() => setTimerOpen(true)} className={BUTTON}>
              <span aria-hidden="true">⏳</span> Timer ({item.durationMinutes} min)
            </button>
          ) : (
            <div className="flex flex-1 flex-wrap items-center gap-2">
              <TimerFace
                remainingSeconds={remainingSeconds}
                totalSeconds={item.durationMinutes * 60}
                style="bar"
                color="var(--accent)"
                size={180}
                compact
              />
              {!running ? (
                <button
                  type="button"
                  onClick={start}
                  className="touch-target rounded-xl border-2 border-brand bg-brand px-3 text-sm font-bold text-brand-ink"
                >
                  <span aria-hidden="true">▶️</span> Start
                </button>
              ) : (
                <button type="button" onClick={pause} className={BUTTON}>
                  <span aria-hidden="true">⏸️</span> Pause
                </button>
              )}
              <button type="button" onClick={reset} className={BUTTON}>
                <span aria-hidden="true">↺</span> Reset
              </button>
              <button
                type="button"
                onClick={() => {
                  reset();
                  setTimerOpen(false);
                }}
                className={BUTTON}
              >
                Close
              </button>
              <span aria-live="assertive" className="text-sm font-bold">
                {finished ? `⏰ Time's up for ${item.label}` : ""}
              </span>
              {finished && (
                <button
                  type="button"
                  onClick={() => {
                    setTimerOpen(false);
                    onToggleDone(item.id);
                  }}
                  className="touch-target rounded-xl border-2 border-brand bg-brand px-3 text-sm font-bold text-brand-ink"
                >
                  <span aria-hidden="true">✅</span> Mark as done
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </li>
  );
}

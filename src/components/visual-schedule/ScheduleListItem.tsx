"use client";

import { useState } from "react";
import type { ScheduleItem } from "@/lib/visual-schedule-storage";
import { useCountdown } from "@/lib/use-countdown";
import { playAlertBeep, vibrateAlert } from "@/lib/alert-sound";
import TimerFace from "@/components/TimerFace";

interface ScheduleListItemProps {
  item: ScheduleItem;
  index: number;
  isLast: boolean;
  draggedId: string | null;
  onToggleDone: (id: string) => void;
  onRemove: (id: string) => void;
  onMove: (id: string, direction: "up" | "down") => void;
  onSetDuration: (id: string, minutes: number) => void;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  onDropBefore: (id: string) => void;
}

const DURATION_PRESETS = [0, 2, 5, 10, 15, 20];

export default function ScheduleListItem({
  item,
  index,
  isLast,
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
  const { remainingSeconds, running, finished, start, pause, reset } = useCountdown(
    item.durationMinutes * 60,
    () => {
      playAlertBeep();
      vibrateAlert();
    }
  );

  const isDragging = draggedId === item.id;

  return (
    <li
      draggable
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
      className={`print-avoid-break flex flex-col gap-2 rounded-xl border-2 p-3 ${
        item.done ? "border-brand/40 bg-brand/5 opacity-70" : "border-border bg-background"
      } ${isDragging ? "opacity-40" : ""}`}
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          title="Drag to reorder"
          className="no-print hidden shrink-0 cursor-grab text-muted sm:block"
        >
          ⠿
        </span>
        <span className="no-print font-display w-6 shrink-0 text-center text-sm font-bold text-muted">
          {index + 1}
        </span>
        <button
          type="button"
          onClick={() => onToggleDone(item.id)}
          aria-pressed={item.done}
          aria-label={item.done ? `Mark ${item.label} as not done` : `Mark ${item.label} as done`}
          className="touch-target flex flex-1 items-center gap-3 rounded-lg text-left"
        >
          <span aria-hidden="true" className="text-3xl shrink-0">
            {item.icon}
          </span>
          <span
            className={`font-display text-base font-bold sm:text-lg ${
              item.done ? "line-through" : ""
            }`}
          >
            {item.label}
          </span>
          {item.done && (
            <span aria-hidden="true" className="ml-auto text-2xl">
              ✅
            </span>
          )}
        </button>
        <div className="no-print flex flex-col gap-1">
          <button
            type="button"
            onClick={() => onMove(item.id, "up")}
            disabled={index === 0}
            aria-label={`Move ${item.label} earlier`}
            className="grid h-9 w-9 place-items-center rounded-lg border-2 border-border bg-surface disabled:opacity-30"
          >
            <span aria-hidden="true">▲</span>
          </button>
          <button
            type="button"
            onClick={() => onMove(item.id, "down")}
            disabled={isLast}
            aria-label={`Move ${item.label} later`}
            className="grid h-9 w-9 place-items-center rounded-lg border-2 border-border bg-surface disabled:opacity-30"
          >
            <span aria-hidden="true">▼</span>
          </button>
        </div>
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          aria-label={`Remove ${item.label} from schedule`}
          className="no-print grid h-9 w-9 shrink-0 place-items-center rounded-lg border-2 border-border bg-surface"
        >
          <span aria-hidden="true">🗑️</span>
        </button>
      </div>

      <div className="no-print flex flex-wrap items-center gap-2 pl-9">
        {!timerOpen ? (
          <>
            <span className="text-xs font-semibold text-muted">
              {item.durationMinutes > 0 ? `${item.durationMinutes} min` : "No timer set"}
            </span>
            <div className="flex flex-wrap gap-1">
              {DURATION_PRESETS.map((minutes) => (
                <button
                  key={minutes}
                  type="button"
                  onClick={() => onSetDuration(item.id, minutes)}
                  aria-pressed={item.durationMinutes === minutes}
                  className={`rounded-full border-2 px-2.5 py-0.5 text-xs font-semibold ${
                    item.durationMinutes === minutes
                      ? "border-brand bg-brand text-brand-ink"
                      : "border-border bg-surface"
                  }`}
                >
                  {minutes === 0 ? "None" : `${minutes}m`}
                </button>
              ))}
            </div>
            {item.durationMinutes > 0 && (
              <button
                type="button"
                onClick={() => setTimerOpen(true)}
                className="touch-target rounded-lg border-2 border-border bg-surface px-3 text-xs font-semibold"
              >
                ⏳ Start timer
              </button>
            )}
          </>
        ) : (
          <div className="flex flex-1 flex-wrap items-center gap-3">
            <TimerFace
              remainingSeconds={remainingSeconds}
              totalSeconds={item.durationMinutes * 60}
              style="bar"
              color="var(--accent)"
              size={160}
              compact
            />
            {!running ? (
              <button
                type="button"
                onClick={start}
                className="touch-target rounded-lg border-2 border-brand bg-brand px-3 text-xs font-bold text-brand-ink"
              >
                ▶️ Start
              </button>
            ) : (
              <button
                type="button"
                onClick={pause}
                className="touch-target rounded-lg border-2 border-border bg-surface px-3 text-xs font-bold"
              >
                ⏸️ Pause
              </button>
            )}
            <button
              type="button"
              onClick={reset}
              className="touch-target rounded-lg border-2 border-border bg-surface px-3 text-xs font-bold"
            >
              ↺ Reset
            </button>
            <button
              type="button"
              onClick={() => setTimerOpen(false)}
              className="touch-target rounded-lg border-2 border-border bg-surface px-3 text-xs font-bold"
            >
              Close
            </button>
            {finished && (
              <span aria-live="assertive" className="text-xs font-bold text-[var(--sev-5)]">
                ⏰ Time&apos;s up!
              </span>
            )}
          </div>
        )}
      </div>
    </li>
  );
}

"use client";

import type { ScheduleItem } from "@/lib/visual-schedule-storage";

interface ScheduleListProps {
  items: ScheduleItem[];
  onToggleDone: (id: string) => void;
  onRemove: (id: string) => void;
  onMove: (id: string, direction: "up" | "down") => void;
}

export default function ScheduleList({
  items,
  onToggleDone,
  onRemove,
  onMove,
}: ScheduleListProps) {
  if (items.length === 0) {
    return (
      <p className="rounded-xl border-2 border-dashed border-border p-6 text-center text-muted">
        No activities yet - tap a picture above to add it to today&apos;s
        schedule.
      </p>
    );
  }

  return (
    <ol className="flex flex-col gap-2">
      {items.map((item, index) => (
        <li
          key={item.id}
          className={`flex items-center gap-3 rounded-xl border-2 p-3 ${
            item.done
              ? "border-brand/40 bg-brand/5 opacity-70"
              : "border-border bg-background"
          }`}
        >
          <span className="no-print font-display w-6 shrink-0 text-center text-sm font-bold text-muted">
            {index + 1}
          </span>
          <button
            type="button"
            onClick={() => onToggleDone(item.id)}
            aria-pressed={item.done}
            aria-label={
              item.done
                ? `Mark ${item.label} as not done`
                : `Mark ${item.label} as done`
            }
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
              disabled={index === items.length - 1}
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
        </li>
      ))}
    </ol>
  );
}

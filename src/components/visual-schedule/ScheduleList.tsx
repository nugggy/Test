"use client";

import { useState } from "react";
import type { ScheduleItem } from "@/lib/visual-schedule-storage";
import ScheduleListItem, { type StepStatus } from "./ScheduleListItem";

interface ScheduleListProps {
  items: ScheduleItem[];
  nowIndex: number;
  nextIndex: number;
  editing: boolean;
  onToggleDone: (id: string) => void;
  onRemove: (id: string) => void;
  onMove: (id: string, direction: "up" | "down") => void;
  onSetDuration: (id: string, minutes: number) => void;
  onReorder: (id: string, beforeId: string | null) => void;
}

export default function ScheduleList({
  items,
  nowIndex,
  nextIndex,
  editing,
  onToggleDone,
  onRemove,
  onMove,
  onSetDuration,
  onReorder,
}: ScheduleListProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <p className="rounded-xl border-2 border-dashed border-border p-6 text-center text-muted">
        No activities yet. Tap a picture under &quot;Add an activity&quot; to put it in
        today&apos;s schedule.
      </p>
    );
  }

  function statusFor(index: number, done: boolean): StepStatus {
    if (done) return "done";
    if (index === nowIndex) return "now";
    if (index === nextIndex) return "next";
    return "later";
  }

  return (
    <>
      {editing && (
        <p className="no-print mb-2 text-sm text-muted">
          Use &quot;Earlier&quot; and &quot;Later&quot; to change the order. With a mouse you
          can also drag the ⠿ handle.
        </p>
      )}
      <ol className="flex flex-col gap-2">
        {items.map((item, index) => (
          <ScheduleListItem
            key={item.id}
            item={item}
            index={index}
            isLast={index === items.length - 1}
            status={statusFor(index, item.done)}
            editing={editing}
            draggedId={draggedId}
            onToggleDone={onToggleDone}
            onRemove={onRemove}
            onMove={onMove}
            onSetDuration={onSetDuration}
            onDragStart={setDraggedId}
            onDragEnd={() => setDraggedId(null)}
            onDropBefore={(beforeId) => {
              if (draggedId) onReorder(draggedId, beforeId);
              setDraggedId(null);
            }}
          />
        ))}
        {draggedId && (
          <li
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              onReorder(draggedId, null);
              setDraggedId(null);
            }}
            className="no-print rounded-xl border-2 border-dashed border-brand p-3 text-center text-sm text-muted"
          >
            Drop here to move to the end
          </li>
        )}
      </ol>
    </>
  );
}

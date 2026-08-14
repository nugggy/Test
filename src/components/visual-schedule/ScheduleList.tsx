"use client";

import { useState } from "react";
import type { ScheduleItem } from "@/lib/visual-schedule-storage";
import ScheduleListItem from "./ScheduleListItem";

interface ScheduleListProps {
  items: ScheduleItem[];
  onToggleDone: (id: string) => void;
  onRemove: (id: string) => void;
  onMove: (id: string, direction: "up" | "down") => void;
  onSetDuration: (id: string, minutes: number) => void;
  onReorder: (id: string, beforeId: string | null) => void;
}

export default function ScheduleList({
  items,
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
        No activities yet - tap a picture above to add it to today&apos;s
        schedule.
      </p>
    );
  }

  return (
    <>
      <p className="no-print mb-2 text-xs text-muted sm:hidden">
        Use the ▲▼ buttons to reorder on a touchscreen, or drag the ⠿ handle with a mouse.
      </p>
      <ol className="flex flex-col gap-2">
        {items.map((item, index) => (
          <ScheduleListItem
            key={item.id}
            item={item}
            index={index}
            isLast={index === items.length - 1}
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
            className="no-print rounded-xl border-2 border-dashed border-brand/40 p-2 text-center text-xs text-muted"
          >
            Drop here to move to the end
          </li>
        )}
      </ol>
    </>
  );
}

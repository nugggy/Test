"use client";

import type { BoardItem } from "@/lib/communication-board-data";

interface BoardTileProps {
  item: BoardItem;
  colorVar: string;
  isFavourite: boolean;
  onSpeak: (item: BoardItem) => void;
  onToggleFavourite: (itemId: string) => void;
  onRemove?: (itemId: string) => void;
}

export default function BoardTile({
  item,
  colorVar,
  isFavourite,
  onSpeak,
  onToggleFavourite,
  onRemove,
}: BoardTileProps) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => onSpeak(item)}
        className="touch-target flex w-full flex-col items-center justify-center gap-1 rounded-2xl border-2 border-black/10 p-3 text-center shadow-sm active:scale-95 transition-transform"
        style={{
          background: `var(--${colorVar})`,
          color: `var(--${colorVar}-ink)`,
        }}
      >
        <span aria-hidden="true" className="text-4xl leading-none">
          {item.emoji}
        </span>
        <span className="font-display text-sm sm:text-base font-bold leading-tight break-words">
          {item.label}
        </span>
      </button>

      <button
        type="button"
        onClick={() => onToggleFavourite(item.id)}
        aria-pressed={isFavourite}
        aria-label={
          isFavourite
            ? `Remove ${item.label} from favourites`
            : `Add ${item.label} to favourites`
        }
        className="absolute -top-2 -right-2 grid h-9 w-9 place-items-center rounded-full border-2 border-border bg-surface text-lg shadow"
      >
        <span aria-hidden="true">{isFavourite ? "⭐" : "☆"}</span>
      </button>

      {onRemove && (
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          aria-label={`Delete ${item.label}`}
          className="absolute -top-2 -left-2 grid h-9 w-9 place-items-center rounded-full border-2 border-border bg-surface text-sm shadow"
        >
          <span aria-hidden="true">🗑️</span>
        </button>
      )}
    </div>
  );
}

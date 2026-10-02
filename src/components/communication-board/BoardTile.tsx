"use client";

import type { BoardItem } from "@/lib/communication-board-data";

interface BoardTileProps {
  item: BoardItem;
  colorVar: string;
  isFavourite: boolean;
  /** When true, show the (large) favourite/delete controls under the tile. */
  editing: boolean;
  onSpeak: (item: BoardItem) => void;
  onToggleFavourite: (itemId: string) => void;
  onRemove?: (itemId: string) => void;
}

export default function BoardTile({
  item,
  colorVar,
  isFavourite,
  editing,
  onSpeak,
  onToggleFavourite,
  onRemove,
}: BoardTileProps) {
  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => onSpeak(item)}
        className="touch-target relative flex w-full flex-col items-center justify-center gap-1 rounded-2xl border-2 border-black/10 p-3 text-center shadow-sm active:scale-95 transition-transform motion-reduce:transition-none motion-reduce:active:scale-100"
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
        {isFavourite && !editing && (
          <span aria-hidden="true" className="absolute right-1.5 top-1 text-sm">
            ⭐
          </span>
        )}
      </button>

      {editing && (
        <div className="no-print flex flex-col gap-2">
          <button
            type="button"
            onClick={() => onToggleFavourite(item.id)}
            aria-pressed={isFavourite}
            aria-label={
              isFavourite
                ? `Remove ${item.label} from favourites`
                : `Add ${item.label} to favourites`
            }
            className="touch-target rounded-xl border-2 border-border bg-surface px-2 text-sm font-semibold"
          >
            <span aria-hidden="true">{isFavourite ? "⭐" : "☆"}</span>{" "}
            {isFavourite ? "Favourite" : "Add to favourites"}
          </button>
          {onRemove && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm(`Delete "${item.label}"? This can't be undone.`)) {
                  onRemove(item.id);
                }
              }}
              aria-label={`Delete ${item.label}`}
              className="touch-target rounded-xl border-2 border-border bg-surface px-2 text-sm font-semibold"
            >
              <span aria-hidden="true">🗑️</span> Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}

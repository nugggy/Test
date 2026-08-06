"use client";

import { COINS, NOTES, formatCents, type MoneyPieceDef } from "@/lib/money-data";
import { useMoneyCounter } from "@/lib/money-counter-storage";
import MoneyPieceIcon from "./MoneyPieceIcon";

function PieceButton({
  piece,
  count,
  onAdd,
}: {
  piece: MoneyPieceDef;
  count: number;
  onAdd: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onAdd}
      aria-label={`Add a ${piece.label}${count > 0 ? `, ${count} in your pile` : ""}`}
      className="touch-target relative flex flex-col items-center gap-2 rounded-2xl border-2 border-border bg-surface p-3 shadow-sm transition-transform active:scale-95 hover:border-brand"
    >
      {count > 0 && (
        <span
          aria-hidden="true"
          className="absolute -right-2 -top-2 grid h-7 min-w-7 place-items-center rounded-full border-2 border-surface bg-brand px-1.5 text-xs font-bold text-brand-ink"
        >
          {count}
        </span>
      )}
      <MoneyPieceIcon piece={piece} width={piece.kind === "coin" ? 56 : 96} />
      <span className="text-sm font-semibold">{piece.label}</span>
    </button>
  );
}

export default function MoneyCounter() {
  const { counts, addPiece, removePiece, clearAll } = useMoneyCounter();

  const totalCents = [...COINS, ...NOTES].reduce(
    (sum, piece) => sum + piece.valueCents * (counts[piece.id] ?? 0),
    0
  );
  const totalItems = Object.values(counts).reduce((sum, n) => sum + n, 0);
  const piecesInPile = [...COINS, ...NOTES].filter((p) => (counts[p.id] ?? 0) > 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="print-avoid-break rounded-2xl border-2 border-brand bg-brand/10 p-4 text-center">
        <p className="text-sm font-semibold text-muted">Your total</p>
        <p aria-live="polite" className="font-display text-5xl font-bold text-foreground">
          {formatCents(totalCents)}
        </p>
        {totalItems > 0 && (
          <p className="mt-1 text-sm text-muted">
            {totalItems} {totalItems === 1 ? "coin or note" : "coins and notes"}
          </p>
        )}
      </div>

      <div className="no-print flex justify-end">
        <button
          type="button"
          onClick={() => {
            if (totalItems === 0) return;
            if (window.confirm("Clear everything from your pile?")) clearAll();
          }}
          disabled={totalItems === 0}
          className="touch-target rounded-xl border-2 border-border bg-surface px-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
        >
          Clear pile
        </button>
      </div>

      <div className="rounded-2xl border-2 border-border bg-surface p-4">
        <h2 className="font-display mb-1 text-lg font-bold">Coins</h2>
        <p className="mb-3 text-sm text-muted">
          Tap a coin to add it to your pile. Notice the $2 coin is smaller
          than the $1 coin, even though it&apos;s worth more.
        </p>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {COINS.map((coin) => (
            <PieceButton
              key={coin.id}
              piece={coin}
              count={counts[coin.id] ?? 0}
              onAdd={() => addPiece(coin.id)}
            />
          ))}
        </div>
      </div>

      <div className="rounded-2xl border-2 border-border bg-surface p-4">
        <h2 className="font-display mb-1 text-lg font-bold">Notes</h2>
        <p className="mb-3 text-sm text-muted">
          Tap a note to add it to your pile. Real Australian notes get a
          little longer for every step up in value - a $100 note is
          physically bigger than a $5 note, which helps people with low
          vision tell them apart by feel.
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {NOTES.map((note) => (
            <PieceButton
              key={note.id}
              piece={note}
              count={counts[note.id] ?? 0}
              onAdd={() => addPiece(note.id)}
            />
          ))}
        </div>
      </div>

      {piecesInPile.length > 0 && (
        <div className="print-avoid-break rounded-2xl border-2 border-border bg-surface p-4">
          <h2 className="font-display mb-3 text-lg font-bold">Your pile</h2>
          <ul className="flex flex-col gap-2">
            {piecesInPile.map((piece) => {
              const count = counts[piece.id] ?? 0;
              return (
                <li
                  key={piece.id}
                  className="flex items-center gap-3 rounded-xl border-2 border-border bg-background p-3"
                >
                  <MoneyPieceIcon piece={piece} width={piece.kind === "coin" ? 36 : 64} />
                  <span className="flex-1 text-sm font-semibold">
                    {piece.label} × {count} = {formatCents(piece.valueCents * count)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removePiece(piece.id)}
                    aria-label={`Remove one ${piece.label}`}
                    className="no-print grid h-9 w-9 shrink-0 place-items-center rounded-lg border-2 border-border bg-surface"
                  >
                    <span aria-hidden="true">➖</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

"use client";

import { useId, useState } from "react";
import { ALL_MONEY_PIECES, COINS, NOTES, formatCents, type MoneyPieceDef } from "@/lib/money-data";
import { useMoneyCounter } from "@/lib/money-counter-storage";
import {
  TARGET_LEVELS,
  checkCashPayment,
  compareToTarget,
  fewestPieces,
  pileTotalCents,
  practiceTarget,
  type MoneyCounts,
  type TargetLevel,
} from "@/lib/money-counter-calc";
import { parseDollars, toCents } from "@/lib/budget-calc";
import { useSpeech } from "@/lib/use-speech";
import Tabs from "@/components/Tabs";
import MoneyPieceIcon from "./MoneyPieceIcon";

type Mode = "count" | "make" | "pay";

const MODES: { id: Mode; label: string; icon: string }[] = [
  { id: "count", label: "Count my money", icon: "🪙" },
  { id: "make", label: "Make an amount", icon: "🎯" },
  { id: "pay", label: "Can I pay for it?", icon: "🛒" },
];

// Only ever called from click handlers, never during render.
function randomPracticeTarget(level: TargetLevel): number {
  return practiceTarget(level, Math.random());
}

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
      className="touch-target relative flex flex-col items-center justify-end gap-2 rounded-2xl border-2 border-border bg-surface p-3 shadow-sm transition-transform hover:border-brand active:scale-95 motion-reduce:transition-none"
    >
      {count > 0 && (
        <span
          aria-hidden="true"
          className="absolute -right-2 -top-2 grid h-7 min-w-7 place-items-center rounded-full border-2 border-surface bg-brand px-1.5 text-xs font-bold text-brand-ink"
        >
          {count}
        </span>
      )}
      {/* Coins and notes are drawn at their real relative sizes. */}
      <MoneyPieceIcon
        piece={piece}
        width={piece.kind === "coin" ? piece.size : Math.round(piece.size * 0.75)}
      />
      <span className="text-sm font-semibold">{piece.label}</span>
    </button>
  );
}

/** A row of small coin/note pictures, e.g. for "this is how to make it". */
function PiecesPicture({ counts, label }: { counts: MoneyCounts; label: string }) {
  const pieces = ALL_MONEY_PIECES.filter((p) => (counts[p.id] ?? 0) > 0).sort(
    (a, b) => b.valueCents - a.valueCents
  );
  if (pieces.length === 0) return null;
  const words = pieces
    .map((p) => `${counts[p.id]} × ${p.label}`)
    .join(", ");
  return (
    <div className="mt-3">
      <p className="mb-2 text-sm font-semibold">{label}</p>
      <ul className="flex flex-wrap items-end gap-2" aria-label={`${label}: ${words}`}>
        {pieces.map((p) => (
          <li
            key={p.id}
            className="flex flex-col items-center gap-1 rounded-xl border-2 border-border bg-background p-2"
          >
            <MoneyPieceIcon
              piece={p}
              width={p.kind === "coin" ? Math.round(p.size * 0.7) : Math.round(p.size * 0.5)}
            />
            <span className="text-sm font-bold" aria-hidden="true">
              × {counts[p.id]}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function MoneyCounter() {
  const { counts, addPiece, removePiece, clearAll } = useMoneyCounter();
  const { speak, supported: speechSupported } = useSpeech();
  const [mode, setMode] = useState<Mode>("count");
  const [level, setLevel] = useState<TargetLevel>("dollars");
  const [targetCents, setTargetCents] = useState<number | null>(null);
  const [makeFeedback, setMakeFeedback] = useState("");
  const [showHow, setShowHow] = useState(false);
  const [priceInput, setPriceInput] = useState("");
  const priceId = useId();

  const totalCents = pileTotalCents(counts);
  const totalItems = Object.values(counts).reduce((sum, n) => sum + n, 0);
  const piecesInPile = [...COINS, ...NOTES].filter((p) => (counts[p.id] ?? 0) > 0);

  function newTarget(nextLevel: TargetLevel = level) {
    setTargetCents(randomPracticeTarget(nextLevel));
    setMakeFeedback("");
    setShowHow(false);
  }

  function checkTarget() {
    if (targetCents === null) return;
    const result = compareToTarget(totalCents, targetCents);
    const text =
      result.status === "exact"
        ? `Well done! You made exactly ${formatCents(targetCents)}.`
        : result.status === "short"
          ? `Not yet. You need ${formatCents(result.byCents)} more.`
          : `That is ${formatCents(result.byCents)} too much. Take some away.`;
    setMakeFeedback(text);
  }

  const price = parseDollars(priceInput);
  const payment = price !== null && price > 0 ? checkCashPayment(totalCents, toCents(price)) : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="print-avoid-break rounded-2xl border-2 border-brand bg-brand-soft p-4 text-center">
        <p className="text-sm font-semibold text-muted">Your money</p>
        <p aria-live="polite" className="font-display text-5xl font-bold text-foreground">
          {formatCents(totalCents)}
        </p>
        {totalItems > 0 && (
          <p className="mt-1 text-sm text-muted">
            {totalItems} {totalItems === 1 ? "coin or note" : "coins and notes"}
          </p>
        )}
        {speechSupported && (
          <button
            type="button"
            onClick={() => speak(`You have ${formatCents(totalCents)}`)}
            className="no-print touch-target mt-2 rounded-xl border-2 border-border bg-surface px-4 text-sm font-semibold"
          >
            <span aria-hidden="true">🔊 </span>Say it out loud
          </button>
        )}
      </div>

      <Tabs tabs={MODES} active={mode} onChange={setMode} label="What do you want to do?" />

      {mode === "make" && (
        <div className="no-print rounded-2xl border-2 border-border bg-surface p-4" role="tabpanel">
          <h2 className="font-display mb-1 text-lg font-bold">Make an amount</h2>
          <p className="mb-3 text-sm text-muted">
            Tap coins and notes below to make the amount. Then tap Check.
          </p>
          <div role="group" aria-label="How hard" className="mb-3 flex flex-wrap gap-2">
            {TARGET_LEVELS.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => {
                  setLevel(l.id);
                  newTarget(l.id);
                }}
                aria-pressed={level === l.id}
                className={`touch-target flex-1 rounded-xl border-2 px-3 text-sm font-semibold ${
                  level === l.id
                    ? "border-brand bg-brand text-brand-ink"
                    : "border-border bg-background"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          {targetCents === null ? (
            <button
              type="button"
              onClick={() => newTarget()}
              className="touch-target w-full rounded-xl border-2 border-brand bg-brand px-4 font-semibold text-brand-ink"
            >
              Give me an amount to make
            </button>
          ) : (
            <>
              <div className="rounded-xl border-2 border-border bg-background p-4 text-center">
                <p className="text-sm font-semibold text-muted">Make this amount</p>
                <p className="font-display text-4xl font-bold">{formatCents(targetCents)}</p>
                {speechSupported && (
                  <button
                    type="button"
                    onClick={() => speak(`Make ${formatCents(targetCents)}`)}
                    className="touch-target mt-2 rounded-xl border-2 border-border bg-surface px-4 text-sm font-semibold"
                  >
                    <span aria-hidden="true">🔊 </span>Say it
                  </button>
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={checkTarget}
                  className="touch-target flex-1 rounded-xl border-2 border-brand bg-brand px-4 font-semibold text-brand-ink"
                >
                  <span aria-hidden="true">✔️ </span>Check
                </button>
                <button
                  type="button"
                  onClick={() => setShowHow((v) => !v)}
                  aria-expanded={showHow}
                  className="touch-target flex-1 rounded-xl border-2 border-border bg-background px-4 font-semibold"
                >
                  <span aria-hidden="true">💡 </span>Show me how
                </button>
                <button
                  type="button"
                  onClick={() => newTarget()}
                  className="touch-target flex-1 rounded-xl border-2 border-border bg-background px-4 font-semibold"
                >
                  <span aria-hidden="true">🔄 </span>New amount
                </button>
              </div>
              <p aria-live="polite" className="mt-3 text-lg font-bold">
                {makeFeedback}
              </p>
              {showHow && (
                <PiecesPicture
                  counts={fewestPieces(targetCents)}
                  label="One way to make it, with the fewest coins and notes"
                />
              )}
            </>
          )}
        </div>
      )}

      {mode === "pay" && (
        <div className="no-print rounded-2xl border-2 border-border bg-surface p-4" role="tabpanel">
          <h2 className="font-display mb-1 text-lg font-bold">Can I pay for it?</h2>
          <p className="mb-3 text-sm text-muted">
            Put the money you have in your pile below. Then type the price.
          </p>
          <label htmlFor={priceId} className="mb-1 block font-semibold">
            Price ($)
          </label>
          <input
            id={priceId}
            type="text"
            inputMode="decimal"
            value={priceInput}
            onChange={(e) => setPriceInput(e.target.value)}
            placeholder="e.g. 4.95"
            className="touch-target w-full max-w-xs rounded-xl border-2 border-border bg-background px-4 py-3 text-xl"
          />
          <div aria-live="polite">
            {payment && (
              <div className="mt-3 rounded-xl border-2 border-border bg-background p-4">
                {payment.cashPriceCents !== toCents(price ?? 0) && (
                  <p className="mb-2 text-sm text-muted">
                    Paying with cash, {formatCents(toCents(price ?? 0))} rounds to{" "}
                    {formatCents(payment.cashPriceCents)}. Australia has no 1 or 2 cent coins.
                  </p>
                )}
                <p className="font-display text-2xl font-bold">
                  {payment.enough ? (
                    <>
                      <span aria-hidden="true">✅ </span>Yes, you have enough
                    </>
                  ) : (
                    <>
                      <span aria-hidden="true">❌ </span>Not enough yet
                    </>
                  )}
                </p>
                <p className="mt-1 text-lg">
                  {payment.enough
                    ? payment.changeCents > 0
                      ? `You should get ${formatCents(payment.changeCents)} change.`
                      : "You have the exact amount. No change."
                    : `You need ${formatCents(payment.shortByCents)} more.`}
                </p>
                {payment.enough && payment.changeCents > 0 && (
                  <PiecesPicture
                    counts={fewestPieces(payment.changeCents)}
                    label="Your change could look like this"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      )}

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
          Tap a coin to add it to your pile. The coins are shown at their
          real sizes compared to each other. The $2 coin is smaller than the
          $1 coin, even though it is worth more.
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
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
          little longer for every step up in value. A $100 note is longer
          than a $5 note, which helps people with low vision tell them apart.
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
                    aria-label={`Take away one ${piece.label}`}
                    className="no-print touch-target grid shrink-0 place-items-center rounded-lg border-2 border-border bg-surface"
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

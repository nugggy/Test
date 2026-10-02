"use client";

import { useState } from "react";
import { useFirstThenBoard, type BoardMode, type PictureItem } from "@/lib/first-then-storage";
import { useSpeech } from "@/lib/use-speech";
import PicturePickerDialog from "./PicturePickerDialog";

const MODES: { id: BoardMode; label: string; icon: string }[] = [
  { id: "firstThen", label: "First-Then", icon: "🔜" },
  { id: "choice", label: "Choice board", icon: "🤲" },
];

export default function FirstThenBoard() {
  const {
    state,
    setMode,
    setFirstItem,
    setThenItem,
    toggleFirstDone,
    moveOn,
    resetFirstThen,
    addChoiceItem,
    removeChoiceItem,
    selectChoice,
  } = useFirstThenBoard();
  const { speak } = useSpeech();
  const [pickerTarget, setPickerTarget] = useState<"first" | "then" | "choice" | null>(null);
  const [editingChoices, setEditingChoices] = useState(false);

  function handleToggleFirstDone() {
    // Ticking "First" off is the moment the person needs to hear what
    // comes next, so say it straight away.
    if (!state.firstDone && state.thenItem) {
      speak(`First is done. Now, ${state.thenItem.label}`);
    }
    toggleFirstDone();
  }

  function handleMoveOn() {
    if (state.thenItem) speak(`First, ${state.thenItem.label}`);
    moveOn();
  }

  function handlePick(item: PictureItem) {
    if (pickerTarget === "first") setFirstItem(item);
    if (pickerTarget === "then") setThenItem(item);
    if (pickerTarget === "choice") addChoiceItem(item);
    setPickerTarget(null);
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        role="group"
        aria-label="Board type"
        className="no-print flex gap-2 rounded-xl border-2 border-border bg-surface p-1"
      >
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMode(m.id)}
            aria-pressed={state.mode === m.id}
            className={`touch-target flex-1 rounded-lg px-3 text-sm font-semibold ${
              state.mode === m.id ? "bg-brand text-brand-ink" : "text-muted"
            }`}
          >
            {m.icon} {m.label}
          </button>
        ))}
      </div>

      {state.mode === "firstThen" ? (
        <div className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Slot
              label="First"
              item={state.firstItem}
              done={state.firstDone}
              onChoose={() => setPickerTarget("first")}
              onSpeak={() => state.firstItem && speak(`First, ${state.firstItem.label}`)}
              onClear={() => setFirstItem(null)}
            />
            <Slot
              label="Then"
              item={state.thenItem}
              onChoose={() => setPickerTarget("then")}
              onSpeak={() => state.thenItem && speak(`Then, ${state.thenItem.label}`)}
              onClear={() => setThenItem(null)}
            />
          </div>

          {state.firstItem && (
            <label className="touch-target flex items-center justify-center gap-3 rounded-2xl border-2 border-border bg-surface px-4 text-lg font-bold">
              <input
                type="checkbox"
                checked={state.firstDone}
                onChange={handleToggleFirstDone}
                className="h-7 w-7 accent-brand"
              />
              {state.firstDone ? "First is done ✅" : "Mark 'First' as done"}
            </label>
          )}

          {state.firstDone && state.thenItem && (
            <div className="no-print flex flex-col items-center gap-2 rounded-2xl border-2 border-brand bg-brand-soft p-4 text-center">
              <p className="font-semibold">
                Ready for the next step? &quot;{state.thenItem.label}&quot; moves into First,
                and you can choose a new Then.
              </p>
              <button
                type="button"
                onClick={handleMoveOn}
                className="touch-target rounded-xl border-2 border-brand bg-brand px-5 font-semibold text-brand-ink"
              >
                ➡️ Move on
              </button>
            </div>
          )}

          <div className="no-print flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() =>
                speak(
                  [
                    state.firstItem ? `First, ${state.firstItem.label}` : "",
                    state.thenItem ? `Then, ${state.thenItem.label}` : "",
                  ]
                    .filter(Boolean)
                    .join(". ")
                )
              }
              disabled={!state.firstItem && !state.thenItem}
              className="touch-target rounded-xl border-2 border-brand bg-brand px-5 font-semibold text-brand-ink disabled:opacity-40"
            >
              🔊 Speak both
            </button>
            <button
              type="button"
              onClick={resetFirstThen}
              className="touch-target rounded-xl border-2 border-border bg-surface px-5 font-semibold"
            >
              ↺ Start over
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="no-print max-w-2xl text-sm text-muted">
            Build a set of up to 6 pictures, then offer the board. Tapping an option
            selects it and speaks it aloud. Fewer choices (2 or 3) are often easier.
          </p>
          <div className="no-print flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setEditingChoices((v) => !v)}
              aria-pressed={editingChoices}
              className={`touch-target rounded-xl border-2 px-4 font-semibold ${
                editingChoices
                  ? "border-brand bg-brand text-brand-ink"
                  : "border-border bg-surface"
              }`}
            >
              {editingChoices ? "✅ Finish editing" : "✏️ Edit choices"}
            </button>
            <button
              type="button"
              onClick={() => selectChoice(null)}
              disabled={!state.selectedChoiceId}
              className="touch-target rounded-xl border-2 border-border bg-surface px-4 font-semibold disabled:opacity-40"
            >
              ↺ Clear the choice
            </button>
          </div>
          <p aria-live="polite" className="sr-only">
            {state.selectedChoiceId
              ? `Chosen: ${state.choiceItems.find((i) => i.id === state.selectedChoiceId)?.label ?? ""}`
              : ""}
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {state.choiceItems.map((item) => (
              <div key={item.id} className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    selectChoice(item.id);
                    speak(item.label);
                  }}
                  aria-pressed={state.selectedChoiceId === item.id}
                  className={`touch-target flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-4 p-5 text-center shadow-sm transition-transform active:scale-95 motion-reduce:transition-none motion-reduce:active:scale-100 ${
                    state.selectedChoiceId === item.id
                      ? "border-brand bg-brand/15"
                      : "border-border bg-surface"
                  }`}
                >
                  <span aria-hidden="true" className="text-5xl leading-none">
                    {item.emoji}
                  </span>
                  <span className="font-display text-base font-bold leading-tight break-words">
                    {item.label}
                  </span>
                </button>
                {editingChoices && (
                  <button
                    type="button"
                    onClick={() => removeChoiceItem(item.id)}
                    aria-label={`Remove ${item.label} from the choice board`}
                    className="no-print touch-target rounded-xl border-2 border-border bg-background px-3 text-sm font-semibold"
                  >
                    <span aria-hidden="true">🗑️</span> Remove
                  </button>
                )}
              </div>
            ))}
            {state.choiceItems.length < 6 && (editingChoices || state.choiceItems.length === 0) && (
              <button
                type="button"
                onClick={() => setPickerTarget("choice")}
                className="no-print touch-target flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-background p-5 text-muted hover:border-brand hover:text-foreground"
              >
                <span aria-hidden="true" className="text-3xl">➕</span>
                Add option
              </button>
            )}
          </div>
        </div>
      )}

      <PicturePickerDialog
        open={pickerTarget !== null}
        title={
          pickerTarget === "first"
            ? "Choose the 'First' picture"
            : pickerTarget === "then"
              ? "Choose the 'Then' picture"
              : "Add a choice"
        }
        onClose={() => setPickerTarget(null)}
        onPick={handlePick}
      />
    </div>
  );
}

function Slot({
  label,
  item,
  done,
  onChoose,
  onSpeak,
  onClear,
}: {
  label: string;
  item: PictureItem | null;
  done?: boolean;
  onChoose: () => void;
  onSpeak: () => void;
  onClear: () => void;
}) {
  return (
    <div
      className={`print-avoid-break flex flex-col items-center gap-3 rounded-2xl border-4 p-6 text-center ${
        done ? "border-border bg-background opacity-60" : "border-brand bg-surface"
      }`}
    >
      <span className="font-display text-sm font-bold uppercase tracking-wide text-muted">
        {label}
      </span>
      {item ? (
        <>
          <span
            aria-hidden="true"
            className={`text-7xl leading-none ${done ? "line-through decoration-4" : ""}`}
          >
            {item.emoji}
          </span>
          <span className="font-display text-xl font-bold">{item.label}</span>
          <div className="no-print flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={onSpeak}
              className="touch-target rounded-xl border-2 border-border bg-background px-4 text-sm font-semibold"
            >
              🔊 Speak
            </button>
            <button
              type="button"
              onClick={onChoose}
              className="touch-target rounded-xl border-2 border-border bg-background px-4 text-sm font-semibold"
            >
              Change
            </button>
            <button
              type="button"
              onClick={onClear}
              className="touch-target rounded-xl border-2 border-border bg-background px-4 text-sm font-semibold"
            >
              Clear
            </button>
          </div>
        </>
      ) : (
        <button
          type="button"
          onClick={onChoose}
          className="no-print touch-target flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-border bg-background px-8 py-6 text-muted hover:border-brand hover:text-foreground"
        >
          <span aria-hidden="true" className="text-3xl">➕</span>
          Tap to choose a picture
        </button>
      )}
    </div>
  );
}

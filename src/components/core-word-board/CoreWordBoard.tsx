"use client";

import { useRef, useState } from "react";
import { CORE_CATEGORIES, CORE_WORDS, type CoreWord } from "@/lib/core-word-board-data";
import { useSpeech } from "@/lib/use-speech";

export default function CoreWordBoard() {
  const { speak, supported: speechSupported } = useSpeech();
  const [message, setMessage] = useState<CoreWord[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);

  function handleTap(word: CoreWord) {
    speak(word.label);
    setMessage((prev) => [...prev, word]);
  }

  function handleSpeakMessage() {
    if (message.length === 0) return;
    speak(message.map((w) => w.label).join(", "));
  }

  function handleClearMessage() {
    setMessage([]);
  }

  async function toggleFullscreen() {
    if (!boardRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await boardRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {
      // Full-screen isn't available on some browsers/devices - the board
      // still works at normal size.
    }
  }

  return (
    <div
      ref={boardRef}
      className="flex min-h-[70vh] flex-col rounded-2xl bg-background"
      style={isFullscreen ? { padding: "1rem" } : undefined}
    >
      {!speechSupported && (
        <p className="no-print mb-3 rounded-xl border-2 border-accent bg-accent/10 px-4 py-2 text-sm">
          This browser can&apos;t speak out loud, but you can still tap
          words and read the message strip.
        </p>
      )}

      {/* Message strip */}
      <div className="no-print mb-4 flex flex-wrap items-center gap-2 rounded-2xl border-2 border-border bg-surface p-3">
        <div className="flex min-h-[3.5rem] flex-1 flex-wrap items-center gap-2" aria-live="polite">
          {message.length === 0 ? (
            <span className="text-muted">Tap words below to build a message…</span>
          ) : (
            message.map((word, i) => (
              <span
                key={`${word.id}-${i}`}
                className="rounded-full bg-background px-3 py-1.5 font-semibold"
              >
                {word.label}
              </span>
            ))
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSpeakMessage}
            disabled={message.length === 0}
            className="touch-target rounded-xl border-2 border-brand bg-brand px-4 font-semibold text-brand-ink disabled:opacity-40"
          >
            🔊 Speak
          </button>
          <button
            type="button"
            onClick={handleClearMessage}
            disabled={message.length === 0}
            className="touch-target rounded-xl border-2 border-border bg-background px-4 font-semibold disabled:opacity-40"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="no-print mb-4 flex justify-end">
        <button
          type="button"
          onClick={toggleFullscreen}
          className="touch-target rounded-xl border-2 border-border bg-surface px-4 font-semibold hover:border-brand"
        >
          <span aria-hidden="true">{isFullscreen ? "🡼" : "⛶"}</span>{" "}
          {isFullscreen ? "Exit full screen" : "Full screen"}
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {CORE_CATEGORIES.map((category) => (
          <div key={category.id}>
            <h2 className="mb-2 text-sm font-bold text-muted">{category.name}</h2>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
              {CORE_WORDS.filter((word) => word.categoryId === category.id).map((word) => (
                <button
                  key={word.id}
                  type="button"
                  onClick={() => handleTap(word)}
                  className="touch-target flex flex-col items-center justify-center gap-1 rounded-2xl border-2 border-black/10 p-3 text-center shadow-sm transition-transform active:scale-95"
                  style={{
                    background: `var(--${category.colorVar})`,
                    color: `var(--${category.colorVar}-ink)`,
                  }}
                >
                  <span className="font-display text-base font-bold leading-tight break-words sm:text-lg">
                    {word.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

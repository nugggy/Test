"use client";

import Link from "next/link";
import { useState } from "react";
import { useSpeech } from "@/lib/use-speech";

const PHRASES = [
  { icon: "👋", label: "Hello!" },
  { icon: "🙏", label: "Thank you" },
  { icon: "🥤", label: "I'd like a drink" },
  { icon: "🙋", label: "I need help" },
];

/**
 * Homepage bento tile: a tiny, working slice of the Communication Board.
 * Tap a picture and it is spoken aloud and shown in the message strip, so
 * visitors try the product within seconds of arriving.
 */
export default function TalkTile() {
  const { speak, supported } = useSpeech();
  const [said, setSaid] = useState<string | null>(null);

  return (
    <div className="flex h-full flex-col rounded-3xl bg-brand p-5 text-brand-ink sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider">Try it now</p>
          <h2 className="font-display mt-1 text-2xl">Tap to talk</h2>
        </div>
        <span aria-hidden="true" className="text-3xl">🔊</span>
      </div>

      <p
        aria-live="polite"
        className="font-display mt-4 min-h-12 rounded-2xl bg-black/20 px-4 py-3 text-lg font-medium"
      >
        {said ?? (supported ? "Tap a picture below…" : "Tap a picture below to build a message…")}
      </p>

      <div className="mt-4 grid flex-1 grid-cols-2 gap-2.5 sm:grid-cols-4">
        {PHRASES.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => {
              setSaid(p.label);
              speak(p.label);
            }}
            className="touch-target flex flex-col items-center justify-center gap-1 rounded-2xl bg-surface px-2 py-3 text-foreground shadow-md transition-transform hover:-translate-y-0.5"
          >
            <span aria-hidden="true" className="text-3xl">{p.icon}</span>
            <span className="text-sm font-semibold leading-tight">{p.label}</span>
          </button>
        ))}
      </div>

      <Link
        href="/tools/communication-board"
        className="mt-4 inline-flex min-h-11 items-center gap-1 self-start font-semibold underline-offset-4 hover:underline"
      >
        Open the full Communication Board <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}

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
  // Bumps on every tap so the message and sound waves replay each time.
  const [tapCount, setTapCount] = useState(0);

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-3xl bg-brand p-5 text-brand-ink sm:p-6">
      <span
        aria-hidden="true"
        className="deco pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10"
      />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider">Try it now</p>
          <h2 className="font-display mt-1 text-2xl">Tap to talk</h2>
        </div>
        <span aria-hidden="true" className="relative flex items-center">
          <span className="text-3xl">🔊</span>
          {tapCount > 0 && (
            <svg key={tapCount} viewBox="0 0 24 24" className="deco -ml-0.5 h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path className="sound-wave" d="M4 8 Q8 12 4 16" />
              <path className="sound-wave" style={{ animationDelay: "150ms" }} d="M10 5 Q16 12 10 19" />
              <path className="sound-wave" style={{ animationDelay: "300ms" }} d="M16 2 Q24 12 16 22" />
            </svg>
          )}
        </span>
      </div>

      <p
        aria-live="polite"
        className="font-display relative mt-4 min-h-12 rounded-2xl rounded-bl-sm bg-black/20 px-4 py-3 text-lg font-medium"
      >
        <span key={tapCount} className={tapCount > 0 ? "pop-in inline-block" : "inline-block"}>
          {said ?? (supported ? "Tap a picture below…" : "Tap a picture below to build a message…")}
        </span>
      </p>

      <div className="mt-4 grid flex-1 grid-cols-2 gap-2.5 sm:grid-cols-4">
        {PHRASES.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => {
              setSaid(p.label);
              setTapCount((n) => n + 1);
              speak(p.label);
            }}
            className={`touch-target group/talk flex flex-col items-center justify-center gap-1 rounded-2xl bg-surface px-2 py-3 text-foreground shadow-md transition-transform hover:-translate-y-1 ${
              said === p.label ? "ring-4 ring-accent" : ""
            }`}
          >
            <span aria-hidden="true" className="text-3xl transition-transform duration-200 group-hover/talk:-rotate-6 group-hover/talk:scale-110">
              {p.icon}
            </span>
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

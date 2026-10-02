"use client";

import { useState } from "react";
import type { SocialStory } from "@/lib/social-story-storage";
import { useSpeech } from "@/lib/use-speech";
import PrintButton from "@/components/PrintButton";

interface StoryPresenterProps {
  story: SocialStory;
  onExit: () => void;
}

export default function StoryPresenter({ story, onExit }: StoryPresenterProps) {
  const [pageIndex, setPageIndex] = useState(0);
  const [autoRead, setAutoRead] = useState(false);
  const { speak, stop, supported: speechSupported } = useSpeech();
  const page = story.pages[pageIndex];
  const isLastPage = pageIndex === story.pages.length - 1;
  const title = story.title || "Untitled story";

  function goTo(index: number) {
    if (index < 0 || index >= story.pages.length) return;
    setPageIndex(index);
    const next = story.pages[index];
    if (autoRead && next?.text.trim()) {
      speak(next.text);
    } else {
      stop();
    }
  }

  function handleToggleAutoRead() {
    const turningOn = !autoRead;
    setAutoRead(turningOn);
    if (turningOn && page?.text.trim()) speak(page.text);
    if (!turningOn) stop();
  }

  if (!page) {
    return (
      <div className="flex flex-col items-center gap-4 py-12">
        <p className="text-muted">This story doesn&apos;t have any pages yet.</p>
        <button
          type="button"
          onClick={onExit}
          className="touch-target rounded-xl border-2 border-border bg-surface px-4 font-semibold"
        >
          ← Back to stories
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => {
            stop();
            onExit();
          }}
          className="touch-target rounded-xl border-2 border-border bg-surface px-4 font-semibold"
        >
          ← Back
        </button>
        <p aria-live="polite" className="font-semibold text-muted">
          Page {pageIndex + 1} of {story.pages.length}
        </p>
        <PrintButton label="Print whole story" />
      </div>

      {speechSupported && (
        <button
          type="button"
          onClick={handleToggleAutoRead}
          aria-pressed={autoRead}
          className={`no-print touch-target self-center rounded-xl border-2 px-4 font-semibold ${
            autoRead ? "border-brand bg-brand text-brand-ink" : "border-border bg-surface"
          }`}
        >
          {autoRead ? "🔊 Reading each page aloud: on" : "🔈 Read each page aloud: off"}
        </button>
      )}

      {/* On-screen: one page at a time */}
      <div className="no-print flex flex-col gap-4">
        <h1 className="font-display text-center text-2xl font-bold">{title}</h1>

        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-6 rounded-2xl border-2 border-border bg-surface p-8 text-center">
          <span aria-hidden="true" className="text-8xl">
            {page.emoji}
          </span>
          <p className="font-display max-w-xl text-xl font-semibold sm:text-2xl">
            {page.text || "(No words on this page yet)"}
          </p>
          {speechSupported && (
            <button
              type="button"
              onClick={() => speak(page.text)}
              disabled={!page.text}
              className="touch-target rounded-xl border-2 border-brand bg-brand px-6 font-semibold text-brand-ink disabled:opacity-40"
            >
              🔊 Read aloud
            </button>
          )}
        </div>

        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => goTo(pageIndex - 1)}
            disabled={pageIndex === 0}
            className="touch-target flex-1 rounded-xl border-2 border-border bg-surface font-semibold disabled:opacity-40"
          >
            ← Previous
          </button>
          {isLastPage ? (
            <button
              type="button"
              onClick={() => goTo(0)}
              disabled={story.pages.length < 2}
              className="touch-target flex-1 rounded-xl border-2 border-brand bg-brand font-semibold text-brand-ink disabled:opacity-40"
            >
              ↺ The end. Read again
            </button>
          ) : (
            <button
              type="button"
              onClick={() => goTo(pageIndex + 1)}
              className="touch-target flex-1 rounded-xl border-2 border-brand bg-brand font-semibold text-brand-ink"
            >
              Next →
            </button>
          )}
        </div>
      </div>

      {/* Printed: every page, one under another, so it can be made into a book */}
      <div className="hidden print:block">
        <h1 className="font-display mb-6 text-center text-3xl font-bold">{title}</h1>
        <ol className="flex flex-col gap-6">
          {story.pages.map((p, i) => (
            <li
              key={p.id}
              className="print-avoid-break flex flex-col items-center gap-3 rounded-2xl border-2 border-border p-6 text-center"
            >
              <span aria-hidden="true" className="text-7xl">
                {p.emoji}
              </span>
              <p className="font-display text-2xl font-semibold">{p.text}</p>
              <p className="text-sm">Page {i + 1}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

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
  const { speak, supported: speechSupported } = useSpeech();
  const page = story.pages[pageIndex];

  function goTo(index: number) {
    if (index < 0 || index >= story.pages.length) return;
    setPageIndex(index);
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
      <div className="no-print flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onExit}
          className="touch-target rounded-xl border-2 border-border bg-surface px-4 font-semibold"
        >
          ← Back
        </button>
        <p aria-live="polite" className="font-semibold text-muted">
          Page {pageIndex + 1} of {story.pages.length}
        </p>
        <PrintButton label="Print" />
      </div>

      <h1 className="font-display text-center text-2xl font-bold">
        {story.title || "Untitled story"}
      </h1>

      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-6 rounded-2xl border-2 border-border bg-surface p-8 text-center">
        <span aria-hidden="true" className="text-8xl">
          {page.emoji}
        </span>
        <p className="font-display max-w-xl text-xl font-semibold sm:text-2xl">
          {page.text || "(No text on this page)"}
        </p>
        {speechSupported && (
          <button
            type="button"
            onClick={() => speak(page.text)}
            disabled={!page.text}
            className="no-print touch-target rounded-xl border-2 border-brand bg-brand px-6 font-semibold text-brand-ink disabled:opacity-40"
          >
            🔊 Read aloud
          </button>
        )}
      </div>

      <div className="no-print flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => goTo(pageIndex - 1)}
          disabled={pageIndex === 0}
          className="touch-target flex-1 rounded-xl border-2 border-border bg-surface font-semibold disabled:opacity-40"
        >
          ← Previous
        </button>
        <button
          type="button"
          onClick={() => goTo(pageIndex + 1)}
          disabled={pageIndex === story.pages.length - 1}
          className="touch-target flex-1 rounded-xl border-2 border-brand bg-brand font-semibold text-brand-ink disabled:opacity-40"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

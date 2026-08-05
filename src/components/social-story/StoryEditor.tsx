"use client";

import { useState } from "react";
import { EMOJI_CHOICES } from "@/lib/emoji-choices";
import { useSpeechToText } from "@/lib/use-speech";
import type { StoryPage, SocialStory } from "@/lib/social-story-storage";

interface StoryEditorProps {
  story: SocialStory;
  onSave: (updates: { title?: string; pages?: StoryPage[] }) => void;
  onDone: () => void;
  onPresent: () => void;
}

function newPage(): StoryPage {
  return {
    id: `page-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    emoji: EMOJI_CHOICES[0],
    text: "",
  };
}

export default function StoryEditor({
  story,
  onSave,
  onDone,
  onPresent,
}: StoryEditorProps) {
  const [title, setTitle] = useState(story.title);
  const [pages, setPages] = useState<StoryPage[]>(story.pages);
  const [pickerOpenFor, setPickerOpenFor] = useState<string | null>(null);

  function commit(nextTitle: string, nextPages: StoryPage[]) {
    setTitle(nextTitle);
    setPages(nextPages);
    onSave({ title: nextTitle, pages: nextPages });
  }

  function handleAddPage() {
    commit(title, [...pages, newPage()]);
  }

  function handleRemovePage(id: string) {
    commit(title, pages.filter((p) => p.id !== id));
  }

  function handlePageText(id: string, text: string) {
    commit(
      title,
      pages.map((p) => (p.id === id ? { ...p, text } : p))
    );
  }

  function handlePageEmoji(id: string, emoji: string) {
    commit(
      title,
      pages.map((p) => (p.id === id ? { ...p, emoji } : p))
    );
    setPickerOpenFor(null);
  }

  function handleMove(id: string, direction: "up" | "down") {
    const index = pages.findIndex((p) => p.id === id);
    if (index === -1) return;
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= pages.length) return;
    const next = [...pages];
    [next[index], next[newIndex]] = [next[newIndex], next[index]];
    commit(title, next);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onDone}
          className="touch-target rounded-xl border-2 border-border bg-surface px-4 font-semibold"
        >
          ← Back to stories
        </button>
        <button
          type="button"
          onClick={onPresent}
          disabled={pages.length === 0}
          className="touch-target rounded-xl border-2 border-brand bg-brand px-4 font-semibold text-brand-ink disabled:opacity-40"
        >
          ▶️ Read story
        </button>
      </div>

      <div>
        <label htmlFor="story-title" className="block font-semibold mb-1">
          Story title
        </label>
        <input
          id="story-title"
          type="text"
          value={title}
          onChange={(e) => commit(e.target.value, pages)}
          maxLength={80}
          placeholder="e.g. Going to the dentist"
          className="font-display w-full rounded-xl border-2 border-border bg-background px-4 py-3 text-lg font-bold touch-target"
        />
      </div>

      <div className="flex flex-col gap-3">
        {pages.map((page, index) => (
          <StoryPageRow
            key={page.id}
            page={page}
            index={index}
            total={pages.length}
            pickerOpen={pickerOpenFor === page.id}
            onTogglePicker={() =>
              setPickerOpenFor(pickerOpenFor === page.id ? null : page.id)
            }
            onChangeEmoji={(emoji) => handlePageEmoji(page.id, emoji)}
            onChangeText={(text) => handlePageText(page.id, text)}
            onRemove={() => handleRemovePage(page.id)}
            onMove={(dir) => handleMove(page.id, dir)}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={handleAddPage}
        className="touch-target flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-surface font-semibold hover:border-brand"
      >
        <span aria-hidden="true">➕</span> Add page
      </button>
    </div>
  );
}

interface StoryPageRowProps {
  page: StoryPage;
  index: number;
  total: number;
  pickerOpen: boolean;
  onTogglePicker: () => void;
  onChangeEmoji: (emoji: string) => void;
  onChangeText: (text: string) => void;
  onRemove: () => void;
  onMove: (direction: "up" | "down") => void;
}

function StoryPageRow({
  page,
  index,
  total,
  pickerOpen,
  onTogglePicker,
  onChangeEmoji,
  onChangeText,
  onRemove,
  onMove,
}: StoryPageRowProps) {
  const { supported: sttSupported, listening, start, stop } = useSpeechToText();

  function handleMicClick() {
    if (listening) {
      stop();
    } else {
      start((text) => onChangeText(text));
    }
  }

  return (
    <div className="rounded-2xl border-2 border-border bg-surface p-4">
      <div className="mb-3 flex items-center gap-3">
        <span className="font-display shrink-0 text-sm font-bold text-muted">
          Page {index + 1}
        </span>
        <div className="no-print ml-auto flex gap-1">
          <button
            type="button"
            onClick={() => onMove("up")}
            disabled={index === 0}
            aria-label={`Move page ${index + 1} earlier`}
            className="grid h-9 w-9 place-items-center rounded-lg border-2 border-border bg-background disabled:opacity-30"
          >
            <span aria-hidden="true">▲</span>
          </button>
          <button
            type="button"
            onClick={() => onMove("down")}
            disabled={index === total - 1}
            aria-label={`Move page ${index + 1} later`}
            className="grid h-9 w-9 place-items-center rounded-lg border-2 border-border bg-background disabled:opacity-30"
          >
            <span aria-hidden="true">▼</span>
          </button>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Delete page ${index + 1}`}
            className="grid h-9 w-9 place-items-center rounded-lg border-2 border-border bg-background"
          >
            <span aria-hidden="true">🗑️</span>
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="shrink-0">
          <button
            type="button"
            onClick={onTogglePicker}
            aria-expanded={pickerOpen}
            aria-label="Change picture"
            className="touch-target grid place-items-center rounded-xl border-2 border-border bg-background text-4xl"
          >
            {page.emoji}
          </button>
        </div>
        <div className="flex-1">
          <div className="flex gap-2">
            <textarea
              value={page.text}
              onChange={(e) => onChangeText(e.target.value)}
              rows={3}
              maxLength={300}
              placeholder="What happens on this page?"
              className="flex-1 rounded-xl border-2 border-border bg-background px-4 py-3 text-base"
            />
            {sttSupported && (
              <button
                type="button"
                onClick={handleMicClick}
                aria-pressed={listening}
                aria-label={
                  listening
                    ? "Stop recording"
                    : "Use microphone to say this page's text"
                }
                className={`touch-target shrink-0 rounded-xl border-2 px-4 font-semibold ${
                  listening
                    ? "border-accent bg-accent text-accent-ink"
                    : "border-border bg-background"
                }`}
              >
                <span aria-hidden="true">{listening ? "⏹️" : "🎤"}</span>
              </button>
            )}
          </div>
          {listening && (
            <p aria-live="polite" className="mt-1 text-sm text-muted">
              Listening…
            </p>
          )}
        </div>
      </div>

      {pickerOpen && (
        <div className="mt-3 grid grid-cols-8 gap-1.5 border-t-2 border-border pt-3">
          {EMOJI_CHOICES.map((choice) => (
            <button
              key={choice}
              type="button"
              onClick={() => onChangeEmoji(choice)}
              aria-label={`Use picture ${choice}`}
              className="grid aspect-square place-items-center rounded-lg border-2 border-border bg-background text-xl hover:border-brand"
            >
              {choice}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

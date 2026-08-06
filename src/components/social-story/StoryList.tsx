"use client";

import type { SocialStory } from "@/lib/social-story-storage";

interface StoryListProps {
  stories: SocialStory[];
  onNew: () => void;
  onEdit: (id: string) => void;
  onPresent: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function StoryList({
  stories,
  onNew,
  onEdit,
  onPresent,
  onDelete,
}: StoryListProps) {
  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={onNew}
        className="touch-target flex items-center justify-center gap-2 self-stretch rounded-2xl border-2 border-dashed border-brand bg-brand/5 font-semibold text-brand sm:self-start sm:px-8"
      >
        <span aria-hidden="true">➕</span> New story
      </button>

      {stories.length === 0 ? (
        <p className="rounded-xl border-2 border-dashed border-border p-8 text-center text-muted">
          No stories yet - create one to prepare for a new place, event or
          routine.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {stories.map((story) => (
            <li
              key={story.id}
              className="flex flex-col rounded-2xl border-2 border-border bg-surface p-4"
            >
              <span aria-hidden="true" className="mb-2 text-3xl">
                {story.pages[0]?.emoji ?? "📖"}
              </span>
              <h3 className="font-display text-lg font-bold">
                {story.title || "Untitled story"}
              </h3>
              <p className="mb-4 text-sm text-muted">
                {story.pages.length}{" "}
                {story.pages.length === 1 ? "page" : "pages"}
              </p>
              <div className="mt-auto flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(story.id)}
                  className="touch-target flex-1 rounded-xl border-2 border-border bg-background px-3 text-sm font-semibold"
                >
                  ✏️ Edit
                </button>
                <button
                  type="button"
                  onClick={() => onPresent(story.id)}
                  disabled={story.pages.length === 0}
                  className="touch-target flex-1 rounded-xl border-2 border-brand bg-brand px-3 text-sm font-semibold text-brand-ink disabled:opacity-40"
                >
                  ▶️ Read
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (
                      window.confirm(
                        `Delete "${story.title || "Untitled story"}"? This can't be undone.`
                      )
                    ) {
                      onDelete(story.id);
                    }
                  }}
                  aria-label={`Delete ${story.title || "Untitled story"}`}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border-2 border-border bg-background"
                >
                  <span aria-hidden="true">🗑️</span>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

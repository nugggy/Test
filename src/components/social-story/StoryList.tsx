"use client";

import type { SocialStory } from "@/lib/social-story-storage";
import { STORY_TEMPLATES } from "@/lib/social-story-templates";

interface StoryListProps {
  stories: SocialStory[];
  onNew: () => void;
  onFromTemplate: (templateId: string) => void;
  onDuplicate: (id: string) => void;
  onEdit: (id: string) => void;
  onPresent: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function StoryList({
  stories,
  onNew,
  onFromTemplate,
  onDuplicate,
  onEdit,
  onPresent,
  onDelete,
}: StoryListProps) {
  return (
    <div className="flex flex-col gap-6">
      <button
        type="button"
        onClick={onNew}
        className="touch-target flex items-center justify-center gap-2 self-stretch rounded-2xl border-2 border-dashed border-brand bg-brand/5 font-semibold text-brand sm:self-start sm:px-8"
      >
        <span aria-hidden="true">➕</span> New blank story
      </button>

      <section aria-labelledby="story-templates-heading" className="rounded-2xl border-2 border-border bg-surface p-4">
        <h2 id="story-templates-heading" className="font-display text-lg font-bold">
          Or start from an example
        </h2>
        <p className="mb-3 text-sm text-muted">
          Each example makes your own copy. Change the words and pictures to match the real
          place, people and routine.
        </p>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {STORY_TEMPLATES.map((template) => (
            <li key={template.id}>
              <button
                type="button"
                onClick={() => onFromTemplate(template.id)}
                className="touch-target flex w-full items-center gap-3 rounded-xl border-2 border-border bg-background px-4 text-left font-semibold hover:border-brand"
              >
                <span aria-hidden="true" className="text-3xl">
                  {template.pages[0]?.emoji ?? "📖"}
                </span>
                <span>{template.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="my-stories-heading">
        <h2 id="my-stories-heading" className="font-display mb-3 text-lg font-bold">
          My stories
        </h2>
        {stories.length === 0 ? (
          <p className="rounded-xl border-2 border-dashed border-border p-8 text-center text-muted">
            No stories yet. Make one to get ready for a new place, event or
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
                    onClick={() => onPresent(story.id)}
                    disabled={story.pages.length === 0}
                    className="touch-target flex-1 rounded-xl border-2 border-brand bg-brand px-3 text-sm font-semibold text-brand-ink disabled:opacity-40"
                  >
                    ▶️ Read
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit(story.id)}
                    className="touch-target flex-1 rounded-xl border-2 border-border bg-background px-3 text-sm font-semibold"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDuplicate(story.id)}
                    aria-label={`Make a copy of ${story.title || "Untitled story"}`}
                    className="touch-target rounded-xl border-2 border-border bg-background px-3 text-sm font-semibold"
                  >
                    <span aria-hidden="true">📄</span> Copy
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
                    className="touch-target grid shrink-0 place-items-center rounded-xl border-2 border-border bg-background"
                  >
                    <span aria-hidden="true">🗑️</span>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

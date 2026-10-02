"use client";

import { useState } from "react";
import { useSocialStories } from "@/lib/social-story-storage";
import { STORY_TEMPLATES } from "@/lib/social-story-templates";
import StoryList from "@/components/social-story/StoryList";
import StoryEditor from "@/components/social-story/StoryEditor";
import StoryPresenter from "@/components/social-story/StoryPresenter";

type View =
  | { mode: "list" }
  | { mode: "edit"; storyId: string }
  | { mode: "present"; storyId: string };

export default function SocialStoryApp() {
  const { stories, createStory, updateStory, deleteStory } = useSocialStories();
  const [view, setView] = useState<View>({ mode: "list" });

  const activeStory =
    view.mode !== "list" ? stories.find((s) => s.id === view.storyId) : undefined;

  function handleNewStory() {
    const id = createStory("New story");
    setView({ mode: "edit", storyId: id });
  }

  function handleFromTemplate(templateId: string) {
    const template = STORY_TEMPLATES.find((t) => t.id === templateId);
    if (!template) return;
    const id = createStory(template.title, template.pages);
    setView({ mode: "edit", storyId: id });
  }

  function handleDuplicate(storyId: string) {
    const story = stories.find((s) => s.id === storyId);
    if (!story) return;
    createStory(`${story.title || "Untitled story"} (copy)`, story.pages);
  }

  if (view.mode === "edit" && activeStory) {
    return (
      <StoryEditor
        story={activeStory}
        onSave={(updates) => updateStory(activeStory.id, updates)}
        onDone={() => setView({ mode: "list" })}
        onPresent={() => setView({ mode: "present", storyId: activeStory.id })}
      />
    );
  }

  if (view.mode === "present" && activeStory) {
    return (
      <StoryPresenter story={activeStory} onExit={() => setView({ mode: "list" })} />
    );
  }

  return (
    <StoryList
      stories={stories}
      onNew={handleNewStory}
      onFromTemplate={handleFromTemplate}
      onDuplicate={handleDuplicate}
      onEdit={(id) => setView({ mode: "edit", storyId: id })}
      onPresent={(id) => setView({ mode: "present", storyId: id })}
      onDelete={deleteStory}
    />
  );
}

"use client";

import { useState } from "react";
import {
  FRIENDSHIP_GOAL_CATEGORIES,
  useFriendshipGoals,
} from "@/lib/friendship-goals-storage";
import GoalCard from "./GoalCard";
import PrintButton from "@/components/PrintButton";

const GOAL_SUGGESTIONS: Record<string, string[]> = {
  "Meeting people": [
    "Join a community group",
    "Say hello to a neighbour",
    "Try a new class or club",
  ],
  "Maintaining friendships": [
    "Call a friend every week",
    "Remember a friend's birthday",
    "Plan a catch-up",
  ],
  "Community inclusion": [
    "Visit a local library or centre",
    "Attend a community event",
    "Volunteer somewhere",
  ],
};

const STEP_SUGGESTIONS = [
  "Find out when and where",
  "Ask someone to come with me",
  "Put it in my calendar",
  "Practise what I'll say",
];

export default function FriendshipGoalPlanner() {
  const { goals, addGoal, updateGoal, removeGoal } = useFriendshipGoals();
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  function handleAdd(category: string, e: React.FormEvent) {
    e.preventDefault();
    const title = drafts[category] ?? "";
    addGoal(title, category);
    setDrafts((prev) => ({ ...prev, [category]: "" }));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="no-print flex justify-end">
        <PrintButton />
      </div>

      {FRIENDSHIP_GOAL_CATEGORIES.map((category) => {
        const categoryGoals = goals.filter((g) => g.category === category);
        return (
          <div
            key={category}
            className="print-avoid-break rounded-2xl border-2 border-border bg-surface p-4"
          >
            <h2 className="font-display mb-3 text-lg font-bold">{category}</h2>

            {categoryGoals.length > 0 && (
              <div className="mb-3 flex flex-col gap-3">
                {categoryGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    categories={FRIENDSHIP_GOAL_CATEGORIES}
                    stepSuggestions={STEP_SUGGESTIONS}
                    onChange={(patch) => updateGoal(goal.id, patch)}
                    onRemove={() => removeGoal(goal.id)}
                  />
                ))}
              </div>
            )}

            <form
              onSubmit={(e) => handleAdd(category, e)}
              className="no-print flex gap-2"
            >
              <label htmlFor={`goal-${category}`} className="sr-only">
                Add a goal to {category}
              </label>
              <input
                id={`goal-${category}`}
                type="text"
                value={drafts[category] ?? ""}
                onChange={(e) =>
                  setDrafts((prev) => ({ ...prev, [category]: e.target.value }))
                }
                placeholder="Type a goal"
                maxLength={140}
                className="flex-1 rounded-xl border-2 border-border bg-background px-4 py-3 touch-target"
              />
              <button
                type="submit"
                className="touch-target shrink-0 rounded-xl border-2 border-brand bg-brand px-4 font-semibold text-brand-ink"
              >
                Add
              </button>
            </form>
            <div className="no-print mt-2 flex flex-wrap gap-1.5">
              {GOAL_SUGGESTIONS[category]
                .filter((s) => !categoryGoals.some((g) => g.title === s))
                .map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => addGoal(s, category)}
                  className="touch-target rounded-xl border-2 border-border bg-background px-3 text-sm font-semibold hover:border-brand"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

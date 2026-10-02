"use client";

import { useState } from "react";
import { useRegulationPlan } from "@/lib/regulation-plan-storage";
import { planHasContent } from "@/lib/regulation-plan-data";
import EditableListSection from "@/components/EditableListSection";
import PrintButton from "@/components/PrintButton";
import CrisisContacts from "@/components/who-can-help-me/CrisisContacts";
import PlanSummary from "./PlanSummary";

const WARNING_SIGN_SUGGESTIONS = [
  "Talking faster/louder",
  "Clenching fists",
  "Pacing",
  "Going quiet",
  "Heart racing",
  "Feeling hot",
];

const STRATEGY_SUGGESTIONS = [
  "Deep breaths",
  "Go somewhere quiet",
  "Squeeze a stress ball",
  "Listen to music",
  "Go for a walk",
  "Ask for a break",
];

const GROUNDING_SUGGESTIONS = [
  "5-4-3-2-1 senses (5 things you see, 4 you hear, 3 you feel, 2 you smell, 1 you taste)",
  "Box breathing (in for 4, hold for 4, out for 4, hold for 4)",
  "Hold something cold, like an ice cube",
  "Press your feet firmly into the floor",
  "Name 5 objects in the room",
];

const OTHERS_CAN_HELP_SUGGESTIONS = [
  "Talk slowly and quietly",
  "Give me space",
  "Use short, simple sentences",
  "Ask before touching me",
  "Offer me my headphones",
  "Stay nearby, but don't ask lots of questions",
  "Remind me of my calm-down strategies",
];

const AVOID_SUGGESTIONS = [
  "Being told to calm down",
  "Loud noises",
  "Being crowded",
  "Being rushed",
];

const STEPS = [
  { id: "warningSigns", label: "Warning signs" },
  { id: "strategies", label: "What helps" },
  { id: "grounding", label: "Grounding" },
  { id: "othersCanHelp", label: "How others can help" },
  { id: "avoid", label: "What makes it worse" },
  { id: "supportPeople", label: "Support people" },
  { id: "urgentHelp", label: "Urgent help" },
] as const;

type Mode = "view" | "edit";

export default function RegulationPlan() {
  const { plan, updateField: saveField, clearPlan, hydrated } = useRegulationPlan();
  const [stepIndex, setStepIndex] = useState(0);
  // null = not chosen yet: open the finished plan if there is one (so it's
  // one tap away in a hard moment), otherwise start building it.
  const [chosenMode, setChosenMode] = useState<Mode | null>(null);
  const mode: Mode = chosenMode ?? (planHasContent(plan) ? "view" : "edit");

  // Lock in edit mode on the first change, so adding the first item to an
  // empty plan doesn't suddenly flip the screen over to the summary.
  const updateField: typeof saveField = (key, value) => {
    if (chosenMode === null) setChosenMode("edit");
    saveField(key, value);
  };

  if (!hydrated) {
    return <p className="text-muted">Loading your plan…</p>;
  }

  function goToStep(index: number) {
    setStepIndex(index);
    setChosenMode("edit");
  }

  const isLastStep = stepIndex === STEPS.length - 1;

  return (
    <div className="flex flex-col gap-4">
      <div className="no-print flex flex-wrap justify-end gap-2">
        {mode === "view" ? (
          <button
            type="button"
            onClick={() => goToStep(0)}
            className="touch-target rounded-xl border-2 border-brand bg-brand px-4 font-semibold text-brand-ink"
          >
            <span aria-hidden="true">✏️ </span>Change my plan
          </button>
        ) : (
          planHasContent(plan) && (
            <button
              type="button"
              onClick={() => setChosenMode("view")}
              className="touch-target rounded-xl border-2 border-brand bg-brand px-4 font-semibold text-brand-ink"
            >
              <span aria-hidden="true">👀 </span>See my whole plan
            </button>
          )
        )}
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Clear this whole plan? This can't be undone.")) {
              clearPlan();
              setStepIndex(0);
              setChosenMode("edit");
            }
          }}
          className="touch-target rounded-xl border-2 border-border bg-surface px-3 text-sm font-semibold"
        >
          Clear plan
        </button>
        <PrintButton />
      </div>

      {/* The summary is what prints, in both modes. On screen it only shows
          in view mode. */}
      <div className={mode === "view" ? "" : "hidden print:block"}>
        <PlanSummary plan={plan} />
      </div>

      {mode === "edit" && (
        <div className="no-print flex flex-col gap-4">
          <div className="rounded-2xl border-2 border-border bg-surface p-4">
            <label htmlFor="plan-owner-name" className="mb-1 block font-semibold">
              Whose plan is this? (optional)
            </label>
            <p className="mb-2 text-sm text-muted">
              Shown at the top when you print it for support people.
            </p>
            <input
              id="plan-owner-name"
              type="text"
              value={plan.name}
              onChange={(e) => updateField("name", e.target.value)}
              maxLength={80}
              placeholder="e.g. Sam"
              className="touch-target w-full rounded-xl border-2 border-border bg-background px-4 text-base"
            />
          </div>

          <nav aria-label="Plan steps">
            <p className="mb-2 text-sm font-semibold text-muted" aria-live="polite">
              Step {stepIndex + 1} of {STEPS.length}: {STEPS[stepIndex].label}
            </p>
            <div className="mb-1 flex flex-wrap gap-2">
              {STEPS.map((step, i) => (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setStepIndex(i)}
                  aria-current={i === stepIndex ? "step" : undefined}
                  className={`touch-target rounded-xl border-2 px-3 text-sm font-semibold ${
                    i === stepIndex
                      ? "border-brand bg-brand text-brand-ink"
                      : "border-border bg-surface"
                  }`}
                >
                  {i + 1}. {step.label}
                </button>
              ))}
            </div>
          </nav>

          {stepIndex === 0 && (
            <EditableListSection
              title="My warning signs"
              description="How do I (or other people) know I'm starting to feel overwhelmed?"
              placeholder="e.g. My voice gets louder"
              items={plan.warningSigns}
              suggestions={WARNING_SIGN_SUGGESTIONS}
              onChange={(items) => updateField("warningSigns", items)}
            />
          )}

          {stepIndex === 1 && (
            <EditableListSection
              title="What helps me calm down"
              description="Strategies that actually work for me"
              placeholder="e.g. Go outside for 5 minutes"
              items={plan.strategies}
              suggestions={STRATEGY_SUGGESTIONS}
              onChange={(items) => updateField("strategies", items)}
            />
          )}

          {stepIndex === 2 && (
            <EditableListSection
              title="Grounding techniques"
              description="Ways to bring myself back to the present moment"
              placeholder="e.g. Hold something cold"
              items={plan.groundingTechniques}
              suggestions={GROUNDING_SUGGESTIONS}
              onChange={(items) => updateField("groundingTechniques", items)}
            />
          )}

          {stepIndex === 3 && (
            <EditableListSection
              title="How other people can help me"
              description="What I'd like family, friends or support workers to do when I'm upset"
              placeholder="e.g. Sit with me quietly"
              items={plan.othersCanHelp}
              suggestions={OTHERS_CAN_HELP_SUGGESTIONS}
              onChange={(items) => updateField("othersCanHelp", items)}
            />
          )}

          {stepIndex === 4 && (
            <EditableListSection
              title="Things that make it worse"
              description="What to avoid when I'm overwhelmed"
              placeholder="e.g. Being asked lots of questions at once"
              items={plan.avoid}
              suggestions={AVOID_SUGGESTIONS}
              onChange={(items) => updateField("avoid", items)}
            />
          )}

          {stepIndex === 5 && (
            <EditableListSection
              title="People I can go to"
              description="Who can support me, and how to reach them. Phone numbers become tap-to-call on your finished plan."
              placeholder="e.g. Mum - 0412 345 678"
              items={plan.supportPeople}
              onChange={(items) => updateField("supportPeople", items)}
            />
          )}

          {stepIndex === 6 && (
            <div className="flex flex-col gap-3">
              <div className="rounded-2xl border-2 border-border bg-surface p-4">
                <label
                  htmlFor="urgent-help-notes"
                  className="font-display block text-lg font-bold"
                >
                  When to get urgent help
                </label>
                <p className="mb-3 text-sm text-muted">
                  What &quot;urgent&quot; looks like for me, and what should happen
                </p>
                <textarea
                  id="urgent-help-notes"
                  value={plan.urgentHelpNotes}
                  onChange={(e) => updateField("urgentHelpNotes", e.target.value)}
                  rows={3}
                  maxLength={500}
                  placeholder="e.g. If I'm talking about hurting myself or someone else, call 000"
                  className="w-full rounded-xl border-2 border-border bg-background px-4 py-3 text-base"
                />
              </div>
              <CrisisContacts title="Crisis and support lines (Australia)" />
            </div>
          )}

          <div className="flex justify-between gap-2">
            <button
              type="button"
              onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
              disabled={stepIndex === 0}
              className="touch-target rounded-xl border-2 border-border bg-surface px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
            >
              ← Back
            </button>
            {isLastStep ? (
              <button
                type="button"
                onClick={() => setChosenMode("view")}
                className="touch-target rounded-xl border-2 border-brand bg-brand px-4 text-sm font-semibold text-brand-ink"
              >
                Finish and see my plan →
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setStepIndex((i) => Math.min(STEPS.length - 1, i + 1))}
                className="touch-target rounded-xl border-2 border-brand bg-brand px-4 text-sm font-semibold text-brand-ink"
              >
                Next →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

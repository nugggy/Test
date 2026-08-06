"use client";

import { useState } from "react";
import Link from "next/link";
import { useRegulationPlan } from "@/lib/regulation-plan-storage";
import EditableListSection from "@/components/EditableListSection";
import PrintButton from "@/components/PrintButton";

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

const AVOID_SUGGESTIONS = [
  "Being told to calm down",
  "Loud noises",
  "Being crowded",
  "Being rushed",
];

const STEPS = [
  { id: "warningSigns", label: "Warning signs" },
  { id: "strategies", label: "What helps" },
  { id: "grounding", label: "Grounding techniques" },
  { id: "avoid", label: "What makes it worse" },
  { id: "supportPeople", label: "Support people" },
  { id: "urgentHelp", label: "Urgent help" },
  { id: "review", label: "Review & print" },
] as const;

export default function RegulationPlan() {
  const { plan, updateField, clearPlan } = useRegulationPlan();
  const [stepIndex, setStepIndex] = useState(0);

  function stepVisibility(index: number) {
    // Only the active step shows on screen (the wizard), but every step
    // stays mounted so printing/downloading a PDF always includes the
    // whole plan, not just whichever step happens to be open.
    return index === stepIndex ? "" : "hidden print:block";
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="no-print flex justify-end gap-2">
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Clear this whole plan? This can't be undone.")) {
              clearPlan();
              setStepIndex(0);
            }
          }}
          className="touch-target rounded-xl border-2 border-border bg-surface px-3 text-sm font-semibold"
        >
          Clear plan
        </button>
        <PrintButton />
      </div>

      <nav aria-label="Plan steps" className="no-print">
        <p className="mb-2 text-sm font-semibold text-muted">
          Step {stepIndex + 1} of {STEPS.length}: {STEPS[stepIndex].label}
        </p>
        <div className="mb-3 flex flex-wrap gap-1.5">
          {STEPS.map((step, i) => (
            <button
              key={step.id}
              type="button"
              onClick={() => setStepIndex(i)}
              aria-current={i === stepIndex ? "step" : undefined}
              className={`rounded-full border-2 px-3 py-1 text-xs font-semibold ${
                i === stepIndex
                  ? "border-brand bg-brand text-brand-ink"
                  : "border-border bg-surface text-muted"
              }`}
            >
              {i + 1}. {step.label}
            </button>
          ))}
        </div>
      </nav>

      <div className={stepVisibility(0)}>
        <EditableListSection
          title="My warning signs"
          description="How do I know I'm starting to feel overwhelmed?"
          placeholder="e.g. My voice gets louder"
          items={plan.warningSigns}
          suggestions={WARNING_SIGN_SUGGESTIONS}
          onChange={(items) => updateField("warningSigns", items)}
        />
      </div>

      <div className={stepVisibility(1)}>
        <EditableListSection
          title="What helps me calm down"
          description="Strategies that actually work for me"
          placeholder="e.g. Go outside for 5 minutes"
          items={plan.strategies}
          suggestions={STRATEGY_SUGGESTIONS}
          onChange={(items) => updateField("strategies", items)}
        />
      </div>

      <div className={stepVisibility(2)}>
        <EditableListSection
          title="Grounding techniques"
          description="Ways to bring myself back to the present moment"
          placeholder="e.g. Hold something cold"
          items={plan.groundingTechniques}
          suggestions={GROUNDING_SUGGESTIONS}
          onChange={(items) => updateField("groundingTechniques", items)}
        />
      </div>

      <div className={stepVisibility(3)}>
        <EditableListSection
          title="Things that make it worse"
          description="What to avoid when I'm overwhelmed"
          placeholder="e.g. Being asked lots of questions at once"
          items={plan.avoid}
          suggestions={AVOID_SUGGESTIONS}
          onChange={(items) => updateField("avoid", items)}
        />
      </div>

      <div className={stepVisibility(4)}>
        <EditableListSection
          title="People I can go to"
          description="Who can support me, and how to reach them"
          placeholder="e.g. Mum - 0412 345 678"
          items={plan.supportPeople}
          onChange={(items) => updateField("supportPeople", items)}
        />
      </div>

      <div className={stepVisibility(5)}>
        <div className="print-avoid-break rounded-2xl border-2 border-border bg-surface p-4">
          <h2 className="font-display text-lg font-bold">When to get urgent help</h2>
          <p className="mb-3 text-sm text-muted">
            What &quot;urgent&quot; looks like for me, and what should happen
          </p>
          <textarea
            value={plan.urgentHelpNotes}
            onChange={(e) => updateField("urgentHelpNotes", e.target.value)}
            rows={3}
            maxLength={500}
            placeholder="e.g. If I'm talking about hurting myself or someone else"
            className="w-full rounded-xl border-2 border-border bg-background px-4 py-3 text-base"
          />
          <p className="mt-3 rounded-xl border-2 border-accent bg-accent/10 px-4 py-3 text-sm">
            <strong>In an emergency</strong>, call <strong>000</strong>, or
            Lifeline on <strong>13 11 14</strong> (24/7). See the full{" "}
            <Link href="/disclaimer" className="font-semibold text-brand hover:underline">
              disclaimer
            </Link>{" "}
            for more crisis contacts.
          </p>
        </div>
      </div>

      <div className={`${stepVisibility(6)} no-print`}>
        <div className="rounded-2xl border-2 border-brand bg-brand/10 p-4 text-center">
          <h2 className="font-display text-lg font-bold">Your plan is ready</h2>
          <p className="mt-1 text-sm text-muted">
            You can jump back to any step above to change something, or print
            or download the whole plan as a PDF now.
          </p>
          <PrintButton className="mt-3" />
        </div>
      </div>

      <div className="no-print flex justify-between gap-2">
        <button
          type="button"
          onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
          disabled={stepIndex === 0}
          className="touch-target rounded-xl border-2 border-border bg-surface px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={() => setStepIndex((i) => Math.min(STEPS.length - 1, i + 1))}
          disabled={stepIndex === STEPS.length - 1}
          className="touch-target rounded-xl border-2 border-brand bg-brand px-4 text-sm font-semibold text-brand-ink disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

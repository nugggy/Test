"use client";

import Link from "next/link";
import { useRegulationPlan } from "@/lib/regulation-plan-storage";
import EditableListSection from "@/components/EditableListSection";

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

const AVOID_SUGGESTIONS = [
  "Being told to calm down",
  "Loud noises",
  "Being crowded",
  "Being rushed",
];

export default function RegulationPlan() {
  const { plan, updateField, clearPlan } = useRegulationPlan();

  return (
    <div className="flex flex-col gap-4">
      <div className="no-print flex justify-end gap-2">
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Clear this whole plan? This can't be undone.")) {
              clearPlan();
            }
          }}
          className="touch-target rounded-xl border-2 border-border bg-surface px-3 text-sm font-semibold"
        >
          Clear plan
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="touch-target rounded-xl border-2 border-brand bg-brand px-3 text-sm font-semibold text-brand-ink"
        >
          🖨️ Print
        </button>
      </div>

      <EditableListSection
        title="My warning signs"
        description="How do I know I'm starting to feel overwhelmed?"
        placeholder="e.g. My voice gets louder"
        items={plan.warningSigns}
        suggestions={WARNING_SIGN_SUGGESTIONS}
        onChange={(items) => updateField("warningSigns", items)}
      />
      <EditableListSection
        title="What helps me calm down"
        description="Strategies that actually work for me"
        placeholder="e.g. Go outside for 5 minutes"
        items={plan.strategies}
        suggestions={STRATEGY_SUGGESTIONS}
        onChange={(items) => updateField("strategies", items)}
      />
      <EditableListSection
        title="Things that make it worse"
        description="What to avoid when I'm overwhelmed"
        placeholder="e.g. Being asked lots of questions at once"
        items={plan.avoid}
        suggestions={AVOID_SUGGESTIONS}
        onChange={(items) => updateField("avoid", items)}
      />
      <EditableListSection
        title="People I can go to"
        description="Who can support me, and how to reach them"
        placeholder="e.g. Mum — 0412 345 678"
        items={plan.supportPeople}
        onChange={(items) => updateField("supportPeople", items)}
      />

      <div className="rounded-2xl border-2 border-border bg-surface p-4">
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
  );
}

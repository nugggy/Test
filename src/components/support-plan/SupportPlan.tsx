"use client";

import { useSupportPlan } from "@/lib/support-plan-storage";
import EditableListSection from "@/components/EditableListSection";
import PrintButton from "@/components/PrintButton";

const GOAL_SUGGESTIONS = [
  "Learn to catch the bus independently",
  "Make new friends",
  "Get a part-time job",
  "Learn to cook simple meals",
  "Build confidence going out in public",
];

const SUPPORT_SUGGESTIONS = [
  "Support worker",
  "Occupational therapist",
  "Speech pathologist",
  "Psychologist / counsellor",
  "GP",
  "Support coordinator",
];

const HEALTH_SUGGESTIONS = [
  "Allergic to...",
  "Takes S8 (controlled) medication...",
  "Takes medication at...",
  "Epilepsy — call 000 if a seizure lasts over 5 minutes",
  "Diabetic — needs regular meals",
  "Trigger — avoid...",
];

const COMMUNICATION_SUGGESTIONS = [
  "Give me time to answer",
  "Use simple, short sentences",
  "Show me a picture or write it down",
  "Don't rush me",
  "I use a communication device/board",
];

export default function SupportPlan() {
  const { plan, updateField, clearPlan } = useSupportPlan();

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
        <PrintButton label="Print" />
      </div>

      <EditableListSection
        title="Alerts — read first"
        description="Critical things a new support worker or service needs to know straight away: allergies, S8 (controlled) medications, seizure triggers, and anything else urgent."
        placeholder="e.g. Allergic to penicillin"
        items={plan.healthAndSafety}
        suggestions={HEALTH_SUGGESTIONS}
        onChange={(items) => updateField("healthAndSafety", items)}
        variant="alert"
      />

      <div className="print-avoid-break rounded-2xl border-2 border-border bg-surface p-4">
        <h2 className="font-display text-lg font-bold">About me</h2>
        <p className="mb-3 text-sm text-muted">
          Who I am, what I like, and anything else that helps someone new get
          to know me
        </p>
        <textarea
          value={plan.aboutMe}
          onChange={(e) => updateField("aboutMe", e.target.value)}
          rows={4}
          maxLength={1000}
          placeholder="e.g. I love music and dogs. I get overwhelmed in loud places. I use a wheelchair and need ramp access."
          className="w-full rounded-xl border-2 border-border bg-background px-4 py-3 text-base"
        />
      </div>

      <EditableListSection
        title="My goals"
        description="What I want to work towards"
        placeholder="e.g. Learn to catch the bus independently"
        items={plan.goals}
        suggestions={GOAL_SUGGESTIONS}
        onChange={(items) => updateField("goals", items)}
      />

      <EditableListSection
        title="My supports"
        description="Who supports me, and what they help with"
        placeholder="e.g. Speech pathologist — Tuesdays, Dundaloo"
        items={plan.supports}
        suggestions={SUPPORT_SUGGESTIONS}
        onChange={(items) => updateField("supports", items)}
      />

      <EditableListSection
        title="How to communicate with me"
        description="What helps, and what doesn't"
        placeholder="e.g. Give me time to answer"
        items={plan.communicationTips}
        suggestions={COMMUNICATION_SUGGESTIONS}
        onChange={(items) => updateField("communicationTips", items)}
      />

      <EditableListSection
        title="Emergency contacts"
        description="Who to call, and how to reach them"
        placeholder="e.g. Mum — 0412 345 678"
        items={plan.emergencyContacts}
        onChange={(items) => updateField("emergencyContacts", items)}
      />
    </div>
  );
}

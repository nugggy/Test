"use client";

import { useState } from "react";
import { useSupportPlan } from "@/lib/support-plan-storage";
import EditableListSection from "@/components/EditableListSection";
import PrintButton from "@/components/PrintButton";
import OnePagePlan from "./OnePagePlan";

const IMPORTANT_SUGGESTIONS = [
  "Seeing my family",
  "Keeping to my routine",
  "Having my own space",
  "My pets",
  "My music",
  "My culture and faith",
];

const HOW_TO_SUPPORT_SUGGESTIONS = [
  "Tell me what is happening next",
  "Let me try things myself first",
  "Ask me before you help",
  "Knock before coming into my room",
  "Give me a quiet space if I'm upset",
];

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
  "Epilepsy - call 000 if a seizure lasts over 5 minutes",
  "Diabetic - needs regular meals",
  "Trigger - avoid...",
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
  const [showPlan, setShowPlan] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="no-print flex flex-wrap justify-end gap-2">
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
          onClick={() => setShowPlan((v) => !v)}
          aria-expanded={showPlan}
          aria-controls="one-page-plan"
          className="touch-target rounded-xl border-2 border-brand bg-surface px-4 font-semibold"
        >
          {showPlan ? "Hide one-page plan" : "See one-page plan"}
        </button>
        <PrintButton label="Print one-page plan" />
      </div>

      {/* Always in the printout; on screen only when asked for. */}
      <div
        id="one-page-plan"
        className={`${showPlan ? "block" : "hidden"} rounded-2xl border-2 border-brand p-4 print:block print:border-0 print:p-0`}
      >
        <OnePagePlan plan={plan} />
      </div>

      <div className="no-print flex flex-col gap-4">
        <div className="rounded-2xl border-2 border-border bg-surface p-4">
          <label htmlFor="support-plan-name" className="font-display block text-lg font-bold">
            My name
          </label>
          <p className="mb-3 text-sm text-muted">The name I like to be called</p>
          <input
            id="support-plan-name"
            type="text"
            value={plan.name}
            onChange={(e) => updateField("name", e.target.value)}
            maxLength={120}
            autoComplete="name"
            placeholder="e.g. Sam"
            className="touch-target w-full rounded-xl border-2 border-border bg-background px-4 text-base"
          />
        </div>

        <EditableListSection
          title="Alerts - read first"
          description="Critical things a new support worker or service needs to know straight away: allergies, S8 (controlled) medications, seizure triggers, and anything else urgent."
          placeholder="e.g. Allergic to penicillin"
          items={plan.healthAndSafety}
          suggestions={HEALTH_SUGGESTIONS}
          onChange={(items) => updateField("healthAndSafety", items)}
          variant="alert"
        />

        <div className="rounded-2xl border-2 border-border bg-surface p-4">
          <label htmlFor="support-plan-about" className="font-display block text-lg font-bold">
            About me
          </label>
          <p className="mb-3 text-sm text-muted">
            Who I am, what I like, and anything else that helps someone new get
            to know me
          </p>
          <textarea
            id="support-plan-about"
            value={plan.aboutMe}
            onChange={(e) => updateField("aboutMe", e.target.value)}
            rows={4}
            maxLength={1000}
            placeholder="e.g. I love music and dogs. I get overwhelmed in loud places. I use a wheelchair and need ramp access."
            className="w-full rounded-xl border-2 border-border bg-background px-4 py-3 text-base"
          />
        </div>

        <EditableListSection
          title="What's important to me"
          description="The people, things and routines that matter most to me"
          placeholder="e.g. Calling my sister every Sunday"
          items={plan.importantToMe}
          suggestions={IMPORTANT_SUGGESTIONS}
          onChange={(items) => updateField("importantToMe", items)}
        />

        <EditableListSection
          title="How to support me well"
          description="What good support looks like for me, in my own words"
          placeholder="e.g. Let me try things myself first"
          items={plan.howToSupportMe}
          suggestions={HOW_TO_SUPPORT_SUGGESTIONS}
          onChange={(items) => updateField("howToSupportMe", items)}
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
          placeholder="e.g. Speech pathologist - Tuesdays"
          items={plan.supports}
          suggestions={SUPPORT_SUGGESTIONS}
          onChange={(items) => updateField("supports", items)}
        />

        <EditableListSection
          title="Emergency contacts"
          description="Who to call, and how to reach them"
          placeholder="e.g. Mum - 0412 345 678"
          items={plan.emergencyContacts}
          onChange={(items) => updateField("emergencyContacts", items)}
        />
      </div>
    </div>
  );
}

"use client";

import { useNdisMeetingPrep } from "@/lib/ndis-meeting-prep-storage";
import EditableListSection from "@/components/EditableListSection";
import ChecklistSection from "@/components/ChecklistSection";
import PrintButton from "@/components/PrintButton";

const WORKING_WELL_SUGGESTIONS = [
  "My support worker's hours suit me",
  "I'm making progress on my goals",
  "My therapy sessions are helping",
];

const NOT_WORKING_SUGGESTIONS = [
  "Not enough hours for the support I need",
  "Hard to find the right provider",
  "Transport funding isn't enough",
];

const CHANGES_SUGGESTIONS = [
  "Moved house or changed living arrangements",
  "New diagnosis or health condition",
  "Started or finished school, study or work",
  "A support person or provider is no longer available",
  "My informal supports (family/friends) have changed",
];

const DAILY_LIFE_SUGGESTIONS = [
  "I need help with personal care (showering, dressing, eating)",
  "I need support to leave the house safely",
  "I need prompting or reminders to complete daily tasks",
  "I need help communicating with others",
  "I need support to manage my money or bills",
  "I need help keeping myself safe",
];

const SUPPORT_NEEDS_SUGGESTIONS = [
  "More support worker hours",
  "Access to a new therapy or service",
  "Help with daily living tasks",
  "Assistive technology or equipment",
];

const FUTURE_GOALS_SUGGESTIONS = [
  "Get a part-time job",
  "Live more independently",
  "Build new friendships",
  "Learn a new skill",
];

const DOCUMENT_SUGGESTIONS = [
  "My current NDIS plan",
  "Reports from my therapists (OT, speech, physio, psychology)",
  "Support Coordinator report",
  "Recent invoices or receipts",
  "Behaviour support plan",
  "Letters from my doctor or specialist",
];

const MEETING_TYPES = [
  "New plan (first meeting)",
  "Plan review",
  "Plan reassessment",
  "Unscheduled review",
  "Other",
];

const MEETING_FORMATS = ["In person", "Phone", "Video call"];

export default function NdisMeetingPrep() {
  const { prep, updateField, clearPrep } = useNdisMeetingPrep();

  return (
    <div className="flex flex-col gap-4">
      <div className="no-print flex justify-end gap-2">
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Clear this whole meeting prep? This can't be undone.")) {
              clearPrep();
            }
          }}
          className="touch-target rounded-xl border-2 border-border bg-surface px-3 text-sm font-semibold"
        >
          Clear
        </button>
        <PrintButton />
      </div>

      <div className="rounded-2xl border-2 border-border bg-surface p-4">
        <h2 className="font-display mb-3 text-lg font-bold">Meeting details</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1 block font-semibold">Meeting date</span>
            <input
              type="date"
              value={prep.meetingDate}
              onChange={(e) => updateField("meetingDate", e.target.value)}
              className="touch-target w-full rounded-xl border-2 border-border bg-background px-3"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-semibold">Meeting type</span>
            <select
              value={prep.meetingType}
              onChange={(e) => updateField("meetingType", e.target.value)}
              className="touch-target w-full rounded-xl border-2 border-border bg-background px-3"
            >
              <option value="">Not sure yet</option>
              {MEETING_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-semibold">Meeting format</span>
            <select
              value={prep.meetingFormat}
              onChange={(e) => updateField("meetingFormat", e.target.value)}
              className="touch-target w-full rounded-xl border-2 border-border bg-background px-3"
            >
              <option value="">Not sure yet</option>
              {MEETING_FORMATS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-semibold">Who&apos;s coming with me</span>
            <input
              type="text"
              value={prep.attendees}
              onChange={(e) => updateField("attendees", e.target.value)}
              maxLength={200}
              placeholder="e.g. Mum, my support worker"
              className="touch-target w-full rounded-xl border-2 border-border bg-background px-3"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-semibold">Current plan start date</span>
            <input
              type="date"
              value={prep.planStartDate}
              onChange={(e) => updateField("planStartDate", e.target.value)}
              className="touch-target w-full rounded-xl border-2 border-border bg-background px-3"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-semibold">Current plan end date</span>
            <input
              type="date"
              value={prep.planEndDate}
              onChange={(e) => updateField("planEndDate", e.target.value)}
              className="touch-target w-full rounded-xl border-2 border-border bg-background px-3"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-semibold">Plan manager</span>
            <input
              type="text"
              value={prep.planManagerName}
              onChange={(e) => updateField("planManagerName", e.target.value)}
              maxLength={120}
              placeholder="Name"
              className="touch-target w-full rounded-xl border-2 border-border bg-background px-3"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-semibold">Support coordinator</span>
            <input
              type="text"
              value={prep.supportCoordinatorName}
              onChange={(e) => updateField("supportCoordinatorName", e.target.value)}
              maxLength={120}
              placeholder="Name"
              className="touch-target w-full rounded-xl border-2 border-border bg-background px-3"
            />
          </label>
        </div>
      </div>

      <ChecklistSection
        title="Documents to bring"
        description="Tick off what you've gathered before the meeting"
        placeholder="Add another document"
        items={prep.documentsToBring}
        suggestions={DOCUMENT_SUGGESTIONS}
        onChange={(items) => updateField("documentsToBring", items)}
      />

      <EditableListSection
        title="What's working well"
        description="Supports and funding that are making a real difference"
        placeholder="e.g. My support worker's hours suit me"
        items={prep.workingWell}
        suggestions={WORKING_WELL_SUGGESTIONS}
        onChange={(items) => updateField("workingWell", items)}
      />

      <EditableListSection
        title="What isn't working"
        description="Anything that's falling short or getting in the way"
        placeholder="e.g. Not enough hours for the support I need"
        items={prep.notWorking}
        suggestions={NOT_WORKING_SUGGESTIONS}
        onChange={(items) => updateField("notWorking", items)}
      />

      <EditableListSection
        title="Changes since my last plan"
        description="Anything different in your life the planner should know about"
        placeholder="e.g. Moved house"
        items={prep.changesSinceLastPlan}
        suggestions={CHANGES_SUGGESTIONS}
        onChange={(items) => updateField("changesSinceLastPlan", items)}
      />

      <EditableListSection
        title="How this affects my daily life"
        description="Concrete examples of your support needs - this is what funding decisions are based on"
        placeholder="e.g. I need prompting to complete daily tasks"
        items={prep.dailyLifeImpact}
        suggestions={DAILY_LIFE_SUGGESTIONS}
        onChange={(items) => updateField("dailyLifeImpact", items)}
      />

      <EditableListSection
        title="My support needs"
        description="What you want to ask for in this plan"
        placeholder="e.g. More support worker hours"
        items={prep.supportNeeds}
        suggestions={SUPPORT_NEEDS_SUGGESTIONS}
        onChange={(items) => updateField("supportNeeds", items)}
      />

      <EditableListSection
        title="My future goals"
        description="What you want to work towards next"
        placeholder="e.g. Get a part-time job"
        items={prep.futureGoals}
        suggestions={FUTURE_GOALS_SUGGESTIONS}
        onChange={(items) => updateField("futureGoals", items)}
      />

      <EditableListSection
        title="Questions for my planner"
        description="Anything you want to make sure gets answered at the meeting"
        placeholder="e.g. Can my funding cover a support worker for social outings?"
        items={prep.questionsForPlanner}
        onChange={(items) => updateField("questionsForPlanner", items)}
      />
    </div>
  );
}

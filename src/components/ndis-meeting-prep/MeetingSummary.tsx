import {
  formatDayAU,
  hasAnyContent,
  type NdisMeetingPrep,
} from "@/lib/ndis-meeting-prep-storage";

interface MeetingSummaryProps {
  prep: NdisMeetingPrep;
}

const LIST_SECTIONS: { key: keyof NdisMeetingPrep; title: string }[] = [
  { key: "dailyLifeImpact", title: "How my disability affects my daily life" },
  { key: "supportNeeds", title: "What I'm asking for in this plan" },
  { key: "notWorking", title: "What isn't working" },
  { key: "workingWell", title: "What's working well" },
  { key: "changesSinceLastPlan", title: "Changes since my last plan" },
  { key: "futureGoals", title: "My goals" },
  { key: "questionsForPlanner", title: "My questions" },
];

/**
 * A clean, read-only summary of the meeting prep - only the parts that have
 * been filled in, with dates in Australian format. This is what prints, so
 * the person has a tidy page to hand to their planner instead of a print of
 * the editing form.
 */
export default function MeetingSummary({ prep }: MeetingSummaryProps) {
  if (!hasAnyContent(prep)) {
    return (
      <p className="rounded-xl border-2 border-dashed border-border p-6 text-center text-muted">
        Your summary is empty. Fill in some of the sections below and they
        will show up here.
      </p>
    );
  }

  const details: { label: string; value: string }[] = [
    { label: "Name", value: prep.participantName },
    { label: "Meeting date", value: formatDayAU(prep.meetingDate) },
    { label: "Meeting type", value: prep.meetingType },
    { label: "Meeting format", value: prep.meetingFormat },
    { label: "Coming with me", value: prep.attendees },
    {
      label: "Current plan",
      value:
        prep.planStartDate || prep.planEndDate
          ? `${formatDayAU(prep.planStartDate) || "?"} to ${formatDayAU(prep.planEndDate) || "?"}`
          : "",
    },
    { label: "Plan manager", value: prep.planManagerName },
    { label: "Support coordinator", value: prep.supportCoordinatorName },
  ].filter((d) => d.value.trim() !== "");

  return (
    <div className="flex flex-col gap-4 text-base">
      <h2 className="font-display text-2xl font-bold">
        {prep.participantName.trim()
          ? `${prep.participantName.trim()}'s NDIS meeting summary`
          : "My NDIS meeting summary"}
      </h2>

      {details.length > 0 && (
        <dl className="print-avoid-break grid gap-x-4 gap-y-1 rounded-2xl border-2 border-border bg-surface p-4 sm:grid-cols-[max-content_1fr]">
          {details.map((d) => (
            <div key={d.label} className="contents">
              <dt className="font-semibold">{d.label}</dt>
              <dd className="mb-1 sm:mb-0">{d.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {prep.topPriorities.length > 0 && (
        <section className="print-avoid-break rounded-2xl border-2 border-accent bg-accent-soft p-4">
          <h3 className="font-display mb-2 text-lg font-bold">
            The most important things for me
          </h3>
          <ol className="list-decimal space-y-1 pl-6 font-semibold">
            {prep.topPriorities.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ol>
        </section>
      )}

      {LIST_SECTIONS.map(({ key, title }) => {
        const items = prep[key] as string[];
        if (items.length === 0) return null;
        return (
          <section key={key} className="print-avoid-break">
            <h3 className="font-display mb-1 text-lg font-bold">{title}</h3>
            <ul className="list-disc space-y-1 pl-6">
              {items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>
        );
      })}

      {prep.documentsToBring.length > 0 && (
        <section className="print-avoid-break">
          <h3 className="font-display mb-1 text-lg font-bold">Documents</h3>
          <ul className="space-y-1">
            {prep.documentsToBring.map((d) => (
              <li key={d.id}>
                <span aria-hidden="true">{d.done ? "☑" : "☐"}</span>{" "}
                {d.text}
                <span className="text-muted">{d.done ? " (ready)" : " (still to get)"}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="hidden print:block print-avoid-break">
        <h3 className="font-display mb-1 text-lg font-bold">Notes from the meeting</h3>
        <div className="flex flex-col">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-8 border-b border-border-strong" />
          ))}
        </div>
      </section>
    </div>
  );
}

"use client";

import { planHasContent, type SupportPlan } from "@/lib/support-plan-storage";
import { formatDate } from "@/lib/datetime";
import { useTimezone } from "@/lib/timezone-context";

interface OnePagePlanProps {
  plan: SupportPlan;
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <section className="print-avoid-break rounded-2xl border-2 border-border bg-surface p-3">
      <h3 className="font-display mb-1 text-base font-bold">{title}</h3>
      <ul className="list-disc space-y-0.5 pl-5 text-sm">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

/**
 * The read-only, one-page version of the support plan - only filled-in
 * parts, most urgent first. This is what prints, so a new worker gets a
 * tidy page rather than a print of the editing form (where long "About me"
 * text could also get cut off inside the text box).
 */
export default function OnePagePlan({ plan }: OnePagePlanProps) {
  const { timezone } = useTimezone();

  if (!planHasContent(plan)) {
    return (
      <p className="rounded-xl border-2 border-dashed border-border p-6 text-center text-muted">
        Your one-page plan is empty. Fill in some of the sections below and
        they will show up here.
      </p>
    );
  }

  const name = plan.name.trim();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-2xl font-bold">
          {name ? `${name}'s support plan` : "My support plan"}
        </h2>
        {plan.updatedAt && (
          <p className="text-sm text-muted">
            Last updated {formatDate(plan.updatedAt, timezone)}
          </p>
        )}
      </div>

      {plan.healthAndSafety.length > 0 && (
        <section className="print-avoid-break rounded-2xl border-2 border-accent bg-accent-soft p-3">
          <h3 className="font-display mb-1 text-base font-bold">
            <span aria-hidden="true">⚠️ </span>Alerts - read first
          </h3>
          <ul className="list-disc space-y-0.5 pl-5 text-sm font-semibold">
            {plan.healthAndSafety.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {plan.aboutMe.trim() && (
        <section className="print-avoid-break rounded-2xl border-2 border-border bg-surface p-3">
          <h3 className="font-display mb-1 text-base font-bold">About me</h3>
          <p className="whitespace-pre-line text-sm">{plan.aboutMe}</p>
        </section>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <ListBlock title="What's important to me" items={plan.importantToMe} />
        <ListBlock title="How to support me well" items={plan.howToSupportMe} />
        <ListBlock title="How to communicate with me" items={plan.communicationTips} />
        <ListBlock title="My goals" items={plan.goals} />
        <ListBlock title="My supports" items={plan.supports} />
        <ListBlock title="Emergency contacts" items={plan.emergencyContacts} />
      </div>
    </div>
  );
}

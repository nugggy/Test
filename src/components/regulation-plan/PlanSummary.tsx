"use client";

import type { ReactNode } from "react";
import { splitPhoneNumbers, type RegulationPlan } from "@/lib/regulation-plan-data";
import { formatDate } from "@/lib/datetime";
import { useTimezone } from "@/lib/timezone-context";
import CrisisContacts from "@/components/who-can-help-me/CrisisContacts";

/** Free text with any phone numbers turned into tap-to-call links. */
export function TextWithPhoneLinks({ text }: { text: string }) {
  return (
    <>
      {splitPhoneNumbers(text).map((segment, i) =>
        segment.tel ? (
          <a key={i} href={`tel:${segment.tel}`} className="font-bold text-brand underline">
            {segment.text}
          </a>
        ) : (
          <span key={i}>{segment.text}</span>
        )
      )}
    </>
  );
}

function SummaryCard({
  icon,
  title,
  items,
  emptyText,
  children,
}: {
  icon: string;
  title: string;
  items?: string[];
  emptyText: string;
  children?: ReactNode;
}) {
  const hasItems = items !== undefined && items.length > 0;
  return (
    <section className="print-avoid-break rounded-2xl border-2 border-border bg-surface p-4">
      <h3 className="font-display mb-2 flex items-center gap-2 text-lg font-bold">
        <span aria-hidden="true">{icon}</span>
        {title}
      </h3>
      {hasItems ? (
        <ul className="flex flex-col gap-1.5 text-base">
          {items.map((item, i) => (
            <li key={i} className="flex gap-2">
              <span aria-hidden="true" className="text-muted">
                •
              </span>
              <span>
                <TextWithPhoneLinks text={item} />
              </span>
            </li>
          ))}
        </ul>
      ) : children ? null : (
        <p className="text-sm text-muted">{emptyText}</p>
      )}
      {children}
    </section>
  );
}

interface PlanSummaryProps {
  plan: RegulationPlan;
}

/**
 * The whole plan on one screen, in the order someone needs it during a hard
 * moment. This is also exactly what prints, so support staff get a clean,
 * one-document copy rather than the step-by-step editor.
 */
export default function PlanSummary({ plan }: PlanSummaryProps) {
  const { timezone } = useTimezone();
  const owner = plan.name.trim();

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h2 className="font-display text-2xl font-bold">
          {owner ? `${owner}'s calm-down plan` : "My calm-down plan"}
        </h2>
        {plan.updatedAt && (
          <p className="text-sm text-muted">
            Last updated {formatDate(plan.updatedAt, timezone)}
          </p>
        )}
      </div>

      <SummaryCard
        icon="🌡️"
        title="Warning signs: how you can tell I'm getting upset"
        items={plan.warningSigns}
        emptyText="Nothing written here yet."
      />
      <SummaryCard
        icon="💚"
        title="What helps me calm down"
        items={plan.strategies}
        emptyText="Nothing written here yet."
      />
      <SummaryCard
        icon="🦶"
        title="Grounding techniques"
        items={plan.groundingTechniques}
        emptyText="Nothing written here yet."
      />
      <SummaryCard
        icon="🤝"
        title="How other people can help me"
        items={plan.othersCanHelp}
        emptyText="Nothing written here yet."
      />
      <SummaryCard
        icon="🚫"
        title="Please avoid"
        items={plan.avoid}
        emptyText="Nothing written here yet."
      />
      <SummaryCard
        icon="📞"
        title="People I can go to"
        items={plan.supportPeople}
        emptyText="Nothing written here yet."
      />
      <SummaryCard
        icon="🆘"
        title="When to get urgent help"
        emptyText="Nothing written here yet."
      >
        {plan.urgentHelpNotes.trim() ? (
          <p className="whitespace-pre-line text-base">
            <TextWithPhoneLinks text={plan.urgentHelpNotes} />
          </p>
        ) : (
          <p className="text-sm text-muted">Nothing written here yet.</p>
        )}
      </SummaryCard>

      <CrisisContacts title="Crisis and support lines (Australia)" />
    </div>
  );
}

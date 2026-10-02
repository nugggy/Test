"use client";

import { useState } from "react";
import { RIGHTS_SCENARIOS, telHref, type RightsContact } from "@/lib/know-your-rights-data";

function ContactCard({ contact }: { contact: RightsContact }) {
  return (
    <li className="print-avoid-break rounded-xl border-2 border-border bg-background p-3">
      <p className="font-semibold">{contact.name}</p>
      <p className="text-sm text-muted">{contact.note}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {contact.phone && (
          <a
            href={telHref(contact.phone)}
            className="touch-target inline-flex items-center gap-2 rounded-xl border-2 border-brand bg-brand px-4 text-sm font-bold text-brand-ink"
          >
            <span aria-hidden="true">📞</span>
            Call {contact.phone}
          </a>
        )}
        {contact.website && (
          <a
            href={contact.website}
            target="_blank"
            rel="noopener noreferrer"
            className="touch-target inline-flex items-center rounded-xl border-2 border-border bg-surface px-4 text-sm font-semibold hover:border-brand"
          >
            {contact.website.replace(/^https?:\/\/(www\.)?/, "")}
            <span aria-hidden="true">&nbsp;↗</span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        )}
      </div>
    </li>
  );
}

/**
 * "What's the problem?" picker that answers the most common question on
 * this page: exactly who do I contact, and how. On screen it shows the one
 * the person picked; the printout includes every situation.
 */
export default function RightsContactFinder() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = RIGHTS_SCENARIOS.find((s) => s.id === selectedId);

  return (
    <section
      aria-labelledby="rights-finder-heading"
      className="rounded-2xl border-2 border-brand bg-brand-soft p-4"
    >
      <h2 id="rights-finder-heading" className="font-display text-lg font-bold">
        Who do I contact?
      </h2>
      <p className="mb-3 text-sm">Tap the one that sounds most like you.</p>

      <div role="group" aria-label="What is the problem?" className="no-print flex flex-col gap-2">
        {RIGHTS_SCENARIOS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSelectedId(s.id === selectedId ? null : s.id)}
            aria-pressed={s.id === selectedId}
            className={`touch-target flex items-center gap-3 rounded-xl border-2 px-4 py-2 text-left font-semibold ${
              s.id === selectedId
                ? "border-brand bg-brand text-brand-ink"
                : "border-border bg-surface hover:border-brand"
            }`}
          >
            <span aria-hidden="true" className="text-xl">
              {s.icon}
            </span>
            <span className="flex-1">{s.label}</span>
            {s.id === selectedId && <span className="text-sm">Selected</span>}
          </button>
        ))}
      </div>

      <p aria-live="polite" className="sr-only">
        {selected ? `Showing who to contact for: ${selected.label}` : ""}
      </p>

      <div className="mt-4 flex flex-col gap-4">
        {RIGHTS_SCENARIOS.map((s) => (
          <div
            key={s.id}
            className={`${s.id === selectedId ? "block" : "hidden print:block"} print-avoid-break rounded-2xl border-2 border-border bg-surface p-4`}
          >
            <h3 className="font-display mb-2 text-base font-bold">
              <span aria-hidden="true">{s.icon} </span>
              {s.label}
            </h3>
            <ol className="mb-3 list-decimal space-y-1 pl-5 text-sm">
              {s.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <ul className="flex flex-col gap-2">
              {s.contacts.map((c) => (
                <ContactCard key={c.name} contact={c} />
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-4 text-sm">
        Need an interpreter? Call TIS National on{" "}
        <a href="tel:131450" className="font-bold underline">
          131 450
        </a>{" "}
        and ask them to call the service for you. If you are deaf or find it
        hard to hear or speak, you can use the National Relay Service.
      </p>
    </section>
  );
}

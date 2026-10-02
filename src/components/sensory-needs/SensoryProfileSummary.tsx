import { SENSORY_DOMAINS } from "@/lib/sensory-needs-data";
import type { SensoryNeedsNotes } from "@/lib/sensory-needs-data";

/**
 * Everything recorded across all the senses on one card, so it can be read
 * at a glance or printed as a one-page profile for support people, without
 * the long educational text in between.
 */
export default function SensoryProfileSummary({ notes }: { notes: SensoryNeedsNotes }) {
  const owner = notes.name.trim();
  const domains = SENSORY_DOMAINS.map((domain) => ({
    domain,
    helps: notes.helps[domain.id] ?? [],
    overwhelms: notes.overwhelms[domain.id] ?? [],
  })).filter((d) => d.helps.length > 0 || d.overwhelms.length > 0);

  return (
    <section className="rounded-2xl border-2 border-brand bg-surface p-4">
      <h2 className="font-display text-xl font-bold">
        {owner ? `${owner}'s sensory profile` : "My sensory profile"}
      </h2>
      <p className="mb-3 text-sm text-muted">
        Everything you&apos;ve added below, all in one place. This is what prints.
      </p>
      <div className="flex flex-col gap-3">
        {domains.map(({ domain, helps, overwhelms }) => (
          <div
            key={domain.id}
            className="print-avoid-break rounded-xl border-2 border-border bg-background p-3"
          >
            <h3 className="font-display mb-2 flex items-center gap-2 font-bold">
              <span aria-hidden="true">{domain.icon}</span>
              {domain.title}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-sm font-semibold">
                  <span aria-hidden="true">✅ </span>What helps
                </p>
                {helps.length > 0 ? (
                  <ul className="list-disc pl-5 text-sm">
                    {helps.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted">Nothing added</p>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold">
                  <span aria-hidden="true">⚠️ </span>What overwhelms
                </p>
                {overwhelms.length > 0 ? (
                  <ul className="list-disc pl-5 text-sm">
                    {overwhelms.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted">Nothing added</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

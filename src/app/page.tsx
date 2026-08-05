import Link from "next/link";
import { tools } from "@/lib/tools";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <section className="mb-12 sm:mb-16">
        <p className="font-display font-semibold text-brand mb-3">
          Free. Forever. No sign-up.
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-bold leading-tight max-w-3xl">
          Practical tools for disability support, built to actually get used.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          Made for participants, families, support workers, educators and
          allied health professionals. Every tool is touch-friendly, works on
          a phone, tablet or iPad, and opens straight into your hands —
          nothing to install, nothing to pay for.
        </p>
        <p className="mt-3 max-w-2xl text-sm text-muted">
          These tools support everyday communication and organisation — they
          aren&apos;t medical advice. See our{" "}
          <Link href="/disclaimer" className="font-semibold text-brand hover:underline">
            full disclaimer
          </Link>
          .
        </p>
      </section>

      <section aria-labelledby="tools-heading">
        <h2 id="tools-heading" className="font-display text-2xl font-bold mb-5">
          Tools
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <li key={tool.slug}>
              {tool.status === "live" ? (
                <Link
                  href={`/tools/${tool.slug}`}
                  className="group flex h-full flex-col rounded-2xl border-2 border-border bg-surface p-5 hover:border-brand hover:shadow-md transition-colors"
                >
                  <ToolCard tool={tool} />
                </Link>
              ) : (
                <div className="flex h-full flex-col rounded-2xl border-2 border-dashed border-border bg-surface/60 p-5 opacity-80">
                  <ToolCard tool={tool} />
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function ToolCard({ tool }: { tool: (typeof tools)[number] }) {
  return (
    <>
      <div className="flex items-start justify-between gap-2">
        <span
          aria-hidden="true"
          className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-background text-3xl"
        >
          {tool.icon}
        </span>
        {tool.status === "soon" && (
          <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-ink">
            Coming soon
          </span>
        )}
      </div>
      <h3 className="font-display mt-3 text-lg font-bold">{tool.name}</h3>
      <p className="mt-1 text-sm text-muted flex-1">{tool.description}</p>
      {tool.requiresAccount && tool.status === "soon" && (
        <p className="mt-2 text-xs font-semibold text-muted">
          Will need a free account (saves data over time)
        </p>
      )}
      {tool.requiresAccount && tool.status === "live" && (
        <p className="mt-2 text-xs font-semibold text-muted">
          Preview: saved on this device only for now
        </p>
      )}
      {tool.status === "live" && (
        <span className="mt-3 font-semibold text-brand group-hover:underline">
          Open tool →
        </span>
      )}
    </>
  );
}

import Link from "next/link";
import type { ToolEntry } from "@/lib/tools";

interface MostFavouritedProps {
  tools: ToolEntry[];
}

export default function MostFavourited({ tools }: MostFavouritedProps) {
  if (tools.length === 0) return null;

  return (
    <section className="mb-12 sm:mb-16" aria-labelledby="most-favourited-heading">
      <h2 id="most-favourited-heading" className="font-display mb-4 text-2xl font-bold">
        ❤️ Most favourited by our community
      </h2>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <li key={tool.slug}>
            <Link
              href={`/tools/${tool.slug}`}
              className="group flex h-full items-center gap-3 rounded-2xl border-2 border-border bg-surface p-4 hover:border-brand hover:shadow-md transition-colors"
            >
              <span
                aria-hidden="true"
                className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-background text-2xl"
              >
                {tool.icon}
              </span>
              <div className="min-w-0">
                <h3 className="font-display font-bold">{tool.name}</h3>
                <p className="truncate text-sm text-muted">{tool.description}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

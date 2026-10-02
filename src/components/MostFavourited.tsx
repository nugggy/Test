import Link from "next/link";
import type { CSSProperties } from "react";
import type { ToolEntry } from "@/lib/tools";
import { categoryStyle } from "@/lib/category-style";
import Scribble from "@/components/Scribble";

interface MostFavouritedProps {
  tools: ToolEntry[];
}

export default function MostFavourited({ tools }: MostFavouritedProps) {
  if (tools.length === 0) return null;

  return (
    <section className="mb-12 sm:mb-16" aria-labelledby="most-favourited-heading">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="most-favourited-heading" className="font-display text-2xl sm:text-3xl">
          Community <Scribble color="var(--solid-wellbeing)">favourites</Scribble>
        </h2>
        <p className="text-sm text-muted">The tools people here love most</p>
      </div>
      <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool, i) => {
          const cs = categoryStyle(tool.category);
          return (
            <li key={tool.slug}>
              <Link
                href={`/tools/${tool.slug}`}
                className="group pop flex h-full items-center gap-4 rounded-2xl border-2 border-border bg-surface p-4"
                style={{ "--pop-color": cs.solidVar } as CSSProperties}
              >
                <span className="font-display tabular w-6 shrink-0 text-center text-2xl font-bold text-muted">
                  <span className="sr-only">Number </span>
                  {i + 1}
                </span>
                <span
                  aria-hidden="true"
                  className={`sticker grid h-12 w-12 shrink-0 place-items-center rounded-xl text-2xl ${cs.tint}`}
                >
                  {tool.icon}
                </span>
                <span className="min-w-0">
                  <span className="font-display block truncate font-semibold">{tool.name}</span>
                  <span className={`block text-xs font-semibold ${cs.ink}`}>{tool.category}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

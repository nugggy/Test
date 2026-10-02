import Link from "next/link";
import type { CSSProperties } from "react";
import type { ToolEntry } from "@/lib/tools";
import { categoryStyle } from "@/lib/category-style";

/**
 * Homepage bento tile: every category as a colourful sticker, with a count.
 * Each one jumps to the tool directory already filtered to that category
 * (ToolDirectory reads ?category= on load).
 */
export default function CategoryTile({ tools }: { tools: ToolEntry[] }) {
  const counts = new Map<string, { count: number; icon: string }>();
  for (const t of tools) {
    if (t.status !== "live") continue;
    const entry = counts.get(t.category);
    if (entry) entry.count += 1;
    else counts.set(t.category, { count: 1, icon: t.icon });
  }
  const categories = [...counts.entries()].sort((a, b) => b[1].count - a[1].count);

  return (
    <div className="rounded-3xl border-2 border-border bg-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-2xl sm:text-3xl">Pick what you need help with</h2>
        <p className="text-sm text-muted">{categories.length} areas of everyday life</p>
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {categories.map(([name, { count, icon }], i) => {
          const cs = categoryStyle(name);
          return (
            <li key={name} className="min-w-0">
              <Link
                href={`/?category=${encodeURIComponent(name)}#tools-heading`}
                className={`group pop hc-outline flex h-full items-center gap-2.5 overflow-hidden rounded-2xl sm:gap-3 border-2 border-transparent p-3 ${cs.tint}`}
                style={{ "--pop-color": cs.solidVar } as CSSProperties}
              >
                <span
                  aria-hidden="true"
                  className={`sticker grid h-10 w-10 shrink-0 place-items-center rounded-xl border-[3px] border-surface bg-surface text-xl shadow-md sm:h-12 sm:w-12 sm:text-2xl ${
                    i % 2 === 0 ? "-rotate-3" : "rotate-3"
                  }`}
                >
                  {icon}
                </span>
                <span className="min-w-0">
                  <span className={`block text-sm font-semibold leading-tight ${cs.ink}`}>{name}</span>
                  <span className={`text-xs ${cs.ink}`}>{count} tools</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

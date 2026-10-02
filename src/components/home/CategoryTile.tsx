import Link from "next/link";
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
        <h2 className="font-display text-2xl">Pick what you need help with</h2>
        <p className="text-sm text-muted">{categories.length} areas of everyday life</p>
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {categories.map(([name, { count, icon }]) => {
          const cs = categoryStyle(name);
          return (
            <li key={name}>
              <Link
                href={`/?category=${encodeURIComponent(name)}#tools-heading`}
                className={`group lift flex h-full items-center gap-3 rounded-2xl p-3 ${cs.tint}`}
              >
                <span
                  aria-hidden="true"
                  className="sticker grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-surface text-2xl shadow-sm"
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

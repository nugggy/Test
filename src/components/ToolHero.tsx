import type { ReactNode } from "react";
import BackToToolsLink from "@/components/BackToToolsLink";
import FavouriteToggleButton from "@/components/FavouriteToggleButton";
import { tools } from "@/lib/tools";
import { categoryStyle } from "@/lib/category-style";

interface ToolHeroProps {
  /** Tool slug from src/lib/tools.ts - supplies the icon and category. */
  slug: string;
  /** Page title (the tool's h1). */
  title: ReactNode;
  /** Short intro shown under the title. */
  children?: ReactNode;
}

/**
 * The shared header at the top of every tool page: back link, the tool's
 * "sticker" icon in its category colour, category label, title, intro and
 * favourite button. One component so all 48 tools look and behave the
 * same, and a design change lands everywhere at once.
 *
 * Printing: the title still prints (as before); the back link, sticker,
 * category label, intro and favourite button are screen-only.
 */
export default function ToolHero({ slug, title, children }: ToolHeroProps) {
  const tool = tools.find((t) => t.slug === slug);
  const cs = categoryStyle(tool?.category ?? "");

  return (
    <header className="mb-6">
      <BackToToolsLink />
      <div className="relative overflow-hidden rounded-3xl border-2 border-border bg-surface p-5 sm:p-7 print:overflow-visible print:border-0 print:p-0">
        {/* decorative category-colour shapes */}
        <span
          aria-hidden="true"
          className={`no-print pointer-events-none absolute -right-14 -top-16 h-48 w-48 rounded-full opacity-70 ${cs.tint}`}
        />
        <span
          aria-hidden="true"
          className={`no-print pointer-events-none absolute right-24 top-6 h-3 w-3 rounded-full ${cs.solid}`}
        />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
          {tool && (
            <span
              aria-hidden="true"
              className={`no-print grid h-16 w-16 shrink-0 place-items-center rounded-2xl text-4xl shadow-sm ring-4 ring-surface sm:h-20 sm:w-20 sm:text-5xl ${cs.tint}`}
            >
              {tool.icon}
            </span>
          )}
          <div className="min-w-0 flex-1">
            {tool && (
              <p className={`no-print mb-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${cs.tint} ${cs.ink}`}>
                <span aria-hidden="true" className={`h-2 w-2 rounded-full ${cs.solid}`} />
                {tool.category}
              </p>
            )}
            <h1 className="font-display text-3xl leading-tight sm:text-4xl">{title}</h1>
            {children && (
              <div className="no-print mt-2 max-w-2xl text-muted [&_a]:font-semibold [&_a]:text-brand [&_a:hover]:underline">
                {children}
              </div>
            )}
          </div>
          <div className="no-print shrink-0">
            <FavouriteToggleButton slug={slug} />
          </div>
        </div>
      </div>
    </header>
  );
}

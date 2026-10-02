import type { ReactNode } from "react";
import BackToToolsLink from "@/components/BackToToolsLink";
import FavouriteToggleButton from "@/components/FavouriteToggleButton";
import { tools } from "@/lib/tools";
import { categoryStyle } from "@/lib/category-style";
import Sprinkles, { SPRINKLE_SETS } from "@/components/Sprinkles";

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
 * category label, intro, favourite button and decoration are screen-only.
 *
 * 0.41.0: the whole banner is the category's tint (ink and foreground text
 * are 6:1+ on every tint, in light and dark), with a tilted "sticker" icon
 * casting a solid shadow in the category colour.
 */
export default function ToolHero({ slug, title, children }: ToolHeroProps) {
  const tool = tools.find((t) => t.slug === slug);
  const cs = categoryStyle(tool?.category ?? "");

  return (
    <header className="mb-6">
      <BackToToolsLink />
      <div
        className={`hc-outline relative overflow-hidden rounded-3xl p-5 sm:p-7 print:overflow-visible print:bg-transparent print:p-0 ${cs.tint}`}
      >
        {/* decorative: a soft white blob behind the sticker and a little
            confetti in the category colour */}
        <span
          aria-hidden="true"
          className="deco pointer-events-none absolute -left-16 -top-20 h-56 w-56 rounded-full bg-surface opacity-50"
        />
        <Sprinkles items={SPRINKLE_SETS.tool} className={cs.ink} />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
          {tool && (
            <span
              aria-hidden="true"
              className="no-print grid h-20 w-20 shrink-0 -rotate-3 place-items-center rounded-[1.6rem] border-4 border-surface bg-surface text-5xl transition-transform duration-300 hover:rotate-3 sm:h-24 sm:w-24 sm:text-6xl"
              style={{ boxShadow: `5px 5px 0 ${cs.solidVar}` }}
            >
              {tool.icon}
            </span>
          )}
          <div className="min-w-0 flex-1">
            {tool && (
              <p className={`no-print mb-2 inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-xs font-semibold ${cs.ink}`}>
                <span aria-hidden="true" className={`h-2 w-2 rounded-full ${cs.solid}`} />
                {tool.category}
              </p>
            )}
            <h1 className="font-display text-3xl leading-tight sm:text-4xl lg:text-5xl">{title}</h1>
            {children && (
              <div className="no-print mt-3 max-w-2xl text-foreground/80 [&_a]:font-semibold [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4">
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

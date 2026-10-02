"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import type { ToolEntry } from "@/lib/tools";
import { fuzzyIncludes } from "@/lib/fuzzy-match";
import { useFavourites } from "@/lib/favourites-storage";
import { categoryStyle } from "@/lib/category-style";
import Buddy from "@/components/Buddy";
import Scribble from "@/components/Scribble";
import FavouriteHeart from "@/components/FavouriteHeart";

interface ToolDirectoryProps {
  tools: ToolEntry[];
}

type ViewMode = "grid" | "list";

const VIEW_STORAGE_KEY = "dt:tool-directory:view:v1";

export default function ToolDirectory({ tools }: ToolDirectoryProps) {
  const [query, setQuery] = useState("");
  const [view, setView] = useState<ViewMode>("grid");
  const [category, setCategory] = useState<string | null>(null);
  const { favourites, toggleFavourite } = useFavourites();

  const categories = Array.from(new Set(tools.map((t) => t.category))).sort();

  useEffect(() => {
    // Remember the user's chosen layout, and honour ?category= from the
    // homepage category tiles. Read after mount so the server-rendered
    // defaults always match the first paint.
    /* eslint-disable react-hooks/set-state-in-effect */
    const saved = window.localStorage.getItem(VIEW_STORAGE_KEY);
    if (saved === "grid" || saved === "list") setView(saved);
    const fromUrl = new URLSearchParams(window.location.search).get("category");
    if (fromUrl && tools.some((t) => t.category === fromUrl)) setCategory(fromUrl);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [tools]);

  function handleSetView(next: ViewMode) {
    setView(next);
    try {
      window.localStorage.setItem(VIEW_STORAGE_KEY, next);
    } catch {
      // If storage is full or unavailable, the choice just won't persist
      // across visits - the toggle still works for the current session.
    }
  }

  const trimmedQuery = query.trim().toLowerCase();
  const filtered = tools.filter((tool) => {
    const matchesQuery = trimmedQuery
      ? fuzzyIncludes(`${tool.name} ${tool.description} ${tool.category}`, trimmedQuery)
      : true;
    const matchesCategory = category ? tool.category === category : true;
    return matchesQuery && matchesCategory;
  });

  return (
    <section aria-labelledby="tools-heading">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="tools-heading" className="font-display scroll-mt-24 text-3xl sm:text-4xl">
            Browse <Scribble>tools</Scribble>
          </h2>
          <p className="mt-1 text-muted">
            Everything is free, and everything you enter stays on your device.
          </p>
        </div>
        <div
          role="group"
          aria-label="Layout"
          className="flex gap-1 rounded-2xl border-2 border-border bg-surface-2 p-1"
        >
          <ViewButton active={view === "grid"} onClick={() => handleSetView("grid")} label="Grid view" icon="▦" />
          <ViewButton active={view === "list"} onClick={() => handleSetView("list")} label="List view" icon="☰" />
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="tool-search" className="sr-only">
          Search tools
        </label>
        <div className="relative">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted"
          >
            <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2.2" />
            <path d="M16.5 16.5 21 21" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          <input
            id="tool-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools, e.g. timer, money, feelings…"
            className="touch-target w-full rounded-2xl border-2 border-border bg-surface py-3 pl-14 pr-5 text-lg shadow-sm"
          />
        </div>
      </div>

      {/* Each chip keeps the full 88px tap area but draws a 48px pill
          inside it. On phones the chips scroll sideways in one row
          instead of stacking into a tall wall of buttons. */}
      <div
        role="group"
        aria-label="Filter by category"
        className="-mx-4 mb-4 flex gap-x-1 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
      >
        <CategoryChip
          label="All tools"
          selected={category === null}
          onClick={() => setCategory(null)}
          selectedClass="border-foreground bg-foreground text-background"
        />
        {categories.map((c) => {
          const cs = categoryStyle(c);
          const selected = category === c;
          return (
            <CategoryChip
              key={c}
              label={c}
              selected={selected}
              onClick={() => setCategory(selected ? null : c)}
              selectedClass={`${cs.tint} ${cs.ink} ${cs.inkBorder}`}
              dotClass={cs.solid}
            />
          );
        })}
      </div>

      <p aria-live="polite" className="mb-3 text-sm text-muted">
        {trimmedQuery || category
          ? `${filtered.length} ${filtered.length === 1 ? "tool" : "tools"} found`
          : `${filtered.length} tools`}
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-border-strong bg-surface-2 p-8 text-center sm:p-10">
          <Buddy mood="think" className="mx-auto h-28 w-28" />
          <p className="font-display mt-3 text-xl font-semibold">No tools match that yet</p>
          <p className="mt-1 text-muted">
            Try a different word{category ? `, or look outside ${category}` : ""}.
            {" "}
            <Link href="/suggestions" className="font-semibold text-brand hover:underline">
              Suggest a tool
            </Link>{" "}
            if it doesn&apos;t exist.
          </p>
        </div>
      ) : view === "grid" ? (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((tool) => (
            <li key={tool.slug}>
              <ToolCard
                tool={tool}
                favourited={favourites.has(tool.slug)}
                onToggleFavourite={() => toggleFavourite(tool.slug)}
              />
            </li>
          ))}
        </ul>
      ) : (
        <ul className="overflow-hidden rounded-3xl border-2 border-border bg-surface">
          {filtered.map((tool, i) => (
            <li key={tool.slug} className={i > 0 ? "border-t border-border" : ""}>
              <ToolRow
                tool={tool}
                favourited={favourites.has(tool.slug)}
                onToggleFavourite={() => toggleFavourite(tool.slug)}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function CategoryChip({
  label,
  selected,
  onClick,
  selectedClass,
  dotClass,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  selectedClass: string;
  dotClass?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className="touch-target group/chip inline-flex shrink-0 items-center justify-center rounded-full"
    >
      <span
        className={`inline-flex h-12 items-center gap-2 whitespace-nowrap rounded-full border-2 px-3.5 text-sm font-semibold transition-[transform,background-color,border-color] duration-150 ${
          selected
            ? `${selectedClass} -rotate-1`
            : "border-border bg-surface text-foreground group-hover/chip:-translate-y-0.5 group-hover/chip:border-border-strong"
        }`}
      >
        {selected ? (
          <span aria-hidden="true" className="text-xs">✓</span>
        ) : (
          dotClass && <span aria-hidden="true" className={`h-2.5 w-2.5 shrink-0 rounded-full ${dotClass}`} />
        )}
        {label}
      </span>
    </button>
  );
}

function ViewButton({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      className={`grid h-11 w-11 place-items-center rounded-xl text-lg transition-colors ${
        active ? "bg-surface text-foreground shadow-md" : "text-muted hover:text-foreground"
      }`}
    >
      <span aria-hidden="true">{icon}</span>
    </button>
  );
}

function FavouriteButton({
  favourited,
  onToggle,
  toolName,
  compact = false,
}: {
  favourited: boolean;
  onToggle: () => void;
  toolName: string;
  /** Skips the shared 88px touch-target minimum for the dense list view,
   * where the whole row is still the large tappable target - only this
   * secondary icon shrinks. */
  compact?: boolean;
}) {
  const [popKey, setPopKey] = useState(0);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
        setPopKey((k) => k + 1);
      }}
      aria-pressed={favourited}
      aria-label={favourited ? `Remove ${toolName} from favourites` : `Add ${toolName} to favourites`}
      className={`${compact ? "h-10 w-10" : "touch-target -m-[22px]"} group/fav grid shrink-0 place-items-center rounded-full`}
    >
      {/* The visible circle is 44px; the tappable area stays the full
          88px touch target (the negative margin keeps the layout tidy). */}
      <span
        aria-hidden="true"
        className={`grid ${compact ? "h-10 w-10 text-base" : "h-11 w-11 text-lg"} place-items-center rounded-full border-2 bg-surface transition-colors ${
          favourited ? "border-brand bg-brand-soft" : "border-border group-hover/fav:border-border-strong"
        }`}
      >
        <FavouriteHeart favourited={favourited} popKey={popKey} />
      </span>
    </button>
  );
}

function OfflineBadge({ worksOffline }: { worksOffline: boolean }) {
  return (
    <span
      title={worksOffline ? "Works without internet once you've opened it while online" : "Needs an internet connection to work"}
      className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted"
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rounded-full ${worksOffline ? "bg-[var(--solid-living)]" : "bg-[var(--solid-preparation)]"}`}
      />
      {worksOffline ? "Works offline" : "Needs internet"}
    </span>
  );
}

function ToolCard({
  tool,
  favourited,
  onToggleFavourite,
}: {
  tool: ToolEntry;
  favourited: boolean;
  onToggleFavourite: () => void;
}) {
  const cs = categoryStyle(tool.category);
  const body = (
    <>
      {/* decorative category-colour blob in the corner, grows on hover */}
      <span
        aria-hidden="true"
        className={`deco pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full transition-transform duration-500 ease-out group-hover:scale-[1.35] ${cs.tint}`}
      />
      <div className="relative flex items-start justify-between gap-3">
        <span
          aria-hidden="true"
          className={`sticker grid h-16 w-16 shrink-0 place-items-center rounded-2xl border-4 border-surface text-4xl shadow-md ${cs.tint}`}
        >
          {tool.icon}
        </span>
        <div className="flex items-center gap-2">
          {tool.status === "soon" && (
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-ink">
              Coming soon
            </span>
          )}
          {tool.status === "live" && (
            <FavouriteButton favourited={favourited} onToggle={onToggleFavourite} toolName={tool.name} />
          )}
        </div>
      </div>
      <p className={`relative mt-4 text-xs font-semibold uppercase tracking-wider ${cs.ink}`}>{tool.category}</p>
      <h3 className="font-display relative mt-1 text-xl font-semibold leading-snug">{tool.name}</h3>
      <p className="relative mt-1.5 line-clamp-2 flex-1 text-sm text-muted">{tool.description}</p>
      <div className="relative mt-4 flex items-center justify-between border-t border-border pt-3">
        <OfflineBadge worksOffline={tool.worksOffline} />
        {tool.status === "live" && (
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-brand">
            Open
            <span
              aria-hidden="true"
              className="grid h-7 w-7 place-items-center rounded-full bg-brand-soft transition-[transform,background-color,color] duration-200 group-hover:translate-x-1 group-hover:bg-brand group-hover:text-brand-ink"
            >
              →
            </span>
          </span>
        )}
      </div>
    </>
  );

  return tool.status === "live" ? (
    <Link
      href={`/tools/${tool.slug}`}
      className="group pop relative flex h-full flex-col overflow-hidden rounded-3xl border-2 border-border bg-surface p-5"
      style={{ "--pop-color": cs.solidVar } as CSSProperties}
    >
      {body}
    </Link>
  ) : (
    <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border-2 border-dashed border-border-strong bg-surface-2 p-5 opacity-80">
      {body}
    </div>
  );
}

function ToolRow({
  tool,
  favourited,
  onToggleFavourite,
}: {
  tool: ToolEntry;
  favourited: boolean;
  onToggleFavourite: () => void;
}) {
  const cs = categoryStyle(tool.category);
  const body = (
    <>
      <span
        aria-hidden="true"
        className={`sticker grid h-11 w-11 shrink-0 place-items-center rounded-xl text-xl ${cs.tint}`}
      >
        {tool.icon}
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="font-display truncate text-base font-semibold">{tool.name}</h3>
        <p className={`text-xs font-semibold ${cs.ink}`}>
          {tool.category}
          {tool.status === "soon" && " · Coming soon"}
        </p>
      </div>
      {tool.status === "live" && (
        <>
          <FavouriteButton favourited={favourited} onToggle={onToggleFavourite} toolName={tool.name} compact />
          <span aria-hidden="true" className="shrink-0 font-semibold text-brand transition-transform group-hover:translate-x-1">
            →
          </span>
        </>
      )}
    </>
  );

  return tool.status === "live" ? (
    <Link
      href={`/tools/${tool.slug}`}
      className="group flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-surface-2"
    >
      {body}
    </Link>
  ) : (
    <div className="flex items-center gap-3 px-4 py-2.5 opacity-70">{body}</div>
  );
}

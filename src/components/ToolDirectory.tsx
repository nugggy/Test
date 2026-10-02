"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ToolEntry } from "@/lib/tools";
import { fuzzyIncludes } from "@/lib/fuzzy-match";
import { useFavourites } from "@/lib/favourites-storage";
import { categoryStyle } from "@/lib/category-style";

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
            Browse tools
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

      <div role="group" aria-label="Filter by category" className="mb-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategory(null)}
          aria-pressed={category === null}
          className={`touch-target inline-flex items-center rounded-full border-2 px-5 text-sm font-semibold ${
            category === null
              ? "border-foreground bg-foreground text-background"
              : "border-border bg-surface text-foreground hover:border-border-strong"
          }`}
        >
          All tools
        </button>
        {categories.map((c) => {
          const cs = categoryStyle(c);
          const selected = category === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(selected ? null : c)}
              aria-pressed={selected}
              className={`touch-target inline-flex items-center gap-2 rounded-full border-2 px-5 text-sm font-semibold ${
                selected
                  ? `${cs.tint} ${cs.ink} ${cs.inkBorder}`
                  : "border-border bg-surface text-foreground hover:border-border-strong"
              }`}
            >
              <span aria-hidden="true" className={`h-2.5 w-2.5 shrink-0 rounded-full ${cs.solid}`} />
              {c}
            </button>
          );
        })}
      </div>

      <p aria-live="polite" className="mb-3 text-sm text-muted">
        {trimmedQuery || category
          ? `${filtered.length} ${filtered.length === 1 ? "tool" : "tools"} found`
          : `${filtered.length} tools`}
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-border-strong bg-surface-2 p-10 text-center">
          <p aria-hidden="true" className="text-4xl">🔍</p>
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
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
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
        {favourited ? "❤️" : "🤍"}
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
      <div className="flex items-start justify-between gap-3">
        <span
          aria-hidden="true"
          className={`sticker grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-3xl ${cs.tint}`}
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
      <p className={`mt-4 text-xs font-semibold uppercase tracking-wider ${cs.ink}`}>{tool.category}</p>
      <h3 className="font-display mt-1 text-xl font-semibold leading-snug">{tool.name}</h3>
      <p className="mt-1.5 line-clamp-2 flex-1 text-sm text-muted">{tool.description}</p>
      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
        <OfflineBadge worksOffline={tool.worksOffline} />
        {tool.status === "live" && (
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand">
            Open
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
          </span>
        )}
      </div>
    </>
  );

  return tool.status === "live" ? (
    <Link
      href={`/tools/${tool.slug}`}
      className="group lift flex h-full flex-col rounded-3xl border-2 border-border bg-surface p-5 hover:border-border-strong"
    >
      {body}
    </Link>
  ) : (
    <div className="flex h-full flex-col rounded-3xl border-2 border-dashed border-border-strong bg-surface-2 p-5 opacity-80">
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

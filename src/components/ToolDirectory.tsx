"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ToolEntry } from "@/lib/tools";
import { fuzzyIncludes } from "@/lib/fuzzy-match";
import { useFavourites } from "@/lib/favourites-storage";

interface ToolDirectoryProps {
  tools: ToolEntry[];
}

type ViewMode = "grid" | "list";

const VIEW_STORAGE_KEY = "dt:tool-directory:view:v1";

export default function ToolDirectory({ tools }: ToolDirectoryProps) {
  const [query, setQuery] = useState("");
  const [view, setView] = useState<ViewMode>("list");
  const [category, setCategory] = useState<string | null>(null);
  const { favourites, toggleFavourite } = useFavourites();

  useEffect(() => {
    // Remember the user's chosen layout across visits - read after mount so
    // the server-rendered default ("list") always matches the first paint.
    const saved = window.localStorage.getItem(VIEW_STORAGE_KEY);
    if (saved === "grid" || saved === "list") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setView(saved);
    }
  }, []);

  function handleSetView(next: ViewMode) {
    setView(next);
    try {
      window.localStorage.setItem(VIEW_STORAGE_KEY, next);
    } catch {
      // If storage is full or unavailable, the choice just won't persist
      // across visits - the toggle still works for the current session.
    }
  }

  const categories = Array.from(new Set(tools.map((t) => t.category))).sort();

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
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 id="tools-heading" className="font-display text-2xl font-bold">
          Tools
        </h2>
        <div
          role="group"
          aria-label="Layout"
          className="flex gap-1 rounded-xl border-2 border-border bg-surface p-1"
        >
          <button
            type="button"
            onClick={() => handleSetView("grid")}
            aria-pressed={view === "grid"}
            aria-label="Grid view"
            className={`grid h-11 w-11 place-items-center rounded-lg text-lg ${
              view === "grid" ? "bg-brand text-brand-ink" : "text-muted"
            }`}
          >
            <span aria-hidden="true">▦</span>
          </button>
          <button
            type="button"
            onClick={() => handleSetView("list")}
            aria-pressed={view === "list"}
            aria-label="List view"
            className={`grid h-11 w-11 place-items-center rounded-lg text-lg ${
              view === "list" ? "bg-brand text-brand-ink" : "text-muted"
            }`}
          >
            <span aria-hidden="true">☰</span>
          </button>
        </div>
      </div>

      <div className="mb-5">
        <label htmlFor="tool-search" className="sr-only">
          Search tools
        </label>
        <div className="relative">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
          >
            🔍
          </span>
          <input
            id="tool-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools by name or category…"
            className="w-full rounded-xl border-2 border-border bg-surface py-3 pl-11 pr-4 text-base touch-target"
          />
        </div>
      </div>

      <div
        role="group"
        aria-label="Filter by category"
        className="mb-5 flex flex-wrap gap-2"
      >
        <button
          type="button"
          onClick={() => setCategory(null)}
          aria-pressed={category === null}
          className={`touch-target rounded-full border-2 px-4 text-sm font-semibold ${
            category === null
              ? "border-brand bg-brand text-brand-ink"
              : "border-border bg-surface text-muted"
          }`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(category === c ? null : c)}
            aria-pressed={category === c}
            className={`touch-target rounded-full border-2 px-4 text-sm font-semibold ${
              category === c
                ? "border-brand bg-brand text-brand-ink"
                : "border-border bg-surface text-muted"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <p aria-live="polite" className="sr-only">
        {trimmedQuery || category
          ? `${filtered.length} ${filtered.length === 1 ? "tool" : "tools"} found`
          : ""}
      </p>

      {filtered.length === 0 ? (
        <p className="rounded-xl border-2 border-dashed border-border p-8 text-center text-muted">
          No tools match{query ? ` "${query}"` : ""}
          {category ? ` in ${category}` : ""}.
        </p>
      ) : view === "grid" ? (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((tool) => (
            <li key={tool.slug}>
              {tool.status === "live" ? (
                <Link
                  href={`/tools/${tool.slug}`}
                  className="group flex h-full flex-col rounded-2xl border-2 border-border bg-surface p-5 hover:border-brand hover:shadow-md transition-colors"
                >
                  <ToolCardContent
                    tool={tool}
                    favourited={favourites.has(tool.slug)}
                    onToggleFavourite={() => toggleFavourite(tool.slug)}
                  />
                </Link>
              ) : (
                <div className="flex h-full flex-col rounded-2xl border-2 border-dashed border-border bg-surface/60 p-5 opacity-80">
                  <ToolCardContent tool={tool} />
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((tool) => (
            <li key={tool.slug}>
              {tool.status === "live" ? (
                <Link
                  href={`/tools/${tool.slug}`}
                  className="group flex items-center gap-4 rounded-2xl border-2 border-border bg-surface p-4 hover:border-brand hover:shadow-md transition-colors"
                >
                  <ToolListRowContent
                    tool={tool}
                    favourited={favourites.has(tool.slug)}
                    onToggleFavourite={() => toggleFavourite(tool.slug)}
                  />
                </Link>
              ) : (
                <div className="flex items-center gap-4 rounded-2xl border-2 border-dashed border-border bg-surface/60 p-4 opacity-80">
                  <ToolListRowContent tool={tool} />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function FavouriteButton({
  favourited,
  onToggle,
  toolName,
  className = "",
}: {
  favourited: boolean;
  onToggle: () => void;
  toolName: string;
  className?: string;
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
      className={`touch-target grid h-11 w-11 place-items-center rounded-full border-2 bg-surface text-lg ${
        favourited ? "border-brand text-brand" : "border-border text-muted"
      } ${className}`}
    >
      <span aria-hidden="true">{favourited ? "❤️" : "🤍"}</span>
    </button>
  );
}

function OfflineBadge({ worksOffline }: { worksOffline: boolean }) {
  return worksOffline ? (
    <span
      title="Works without internet once you've opened it while online"
      className="inline-flex items-center gap-1 rounded-full bg-background px-2.5 py-0.5 text-xs font-semibold text-muted"
    >
      📶 Works offline
    </span>
  ) : (
    <span
      title="Needs an internet connection to work"
      className="inline-flex items-center gap-1 rounded-full bg-background px-2.5 py-0.5 text-xs font-semibold text-muted"
    >
      🌐 Needs internet
    </span>
  );
}

function ToolCardContent({
  tool,
  favourited,
  onToggleFavourite,
}: {
  tool: ToolEntry;
  favourited?: boolean;
  onToggleFavourite?: () => void;
}) {
  return (
    <>
      <div className="flex items-start justify-between gap-2">
        <span
          aria-hidden="true"
          className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-background text-3xl"
        >
          {tool.icon}
        </span>
        <div className="flex items-center gap-2">
          {tool.status === "soon" && (
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-ink">
              Coming soon
            </span>
          )}
          {onToggleFavourite && (
            <FavouriteButton
              favourited={Boolean(favourited)}
              onToggle={onToggleFavourite}
              toolName={tool.name}
            />
          )}
        </div>
      </div>
      <h3 className="font-display mt-3 line-clamp-2 min-h-[3.5rem] text-lg font-bold">
        {tool.name}
      </h3>
      <div className="mt-1 flex flex-wrap gap-1.5">
        <span className="inline-block w-fit rounded-full bg-background px-2.5 py-0.5 text-xs font-semibold text-muted">
          {tool.category}
        </span>
        <OfflineBadge worksOffline={tool.worksOffline} />
      </div>
      <p className="mt-1 line-clamp-2 min-h-[2.5rem] flex-1 text-sm text-muted">
        {tool.description}
      </p>
      <p className="mt-2 min-h-[1rem] text-xs font-semibold text-muted">
        {tool.requiresAccount && tool.status === "soon"
          ? "Will need a free account (saves data over time)"
          : tool.requiresAccount && tool.status === "live"
            ? "Preview: saved on this device only for now"
            : " "}
      </p>
      {tool.status === "live" && (
        <span className="mt-3 font-semibold text-brand group-hover:underline">
          Open tool →
        </span>
      )}
    </>
  );
}

function ToolListRowContent({
  tool,
  favourited,
  onToggleFavourite,
}: {
  tool: ToolEntry;
  favourited?: boolean;
  onToggleFavourite?: () => void;
}) {
  return (
    <>
      <span
        aria-hidden="true"
        className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-background text-2xl"
      >
        {tool.icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-display font-bold">{tool.name}</h3>
          <span className="rounded-full bg-background px-2.5 py-0.5 text-xs font-semibold text-muted">
            {tool.category}
          </span>
          <OfflineBadge worksOffline={tool.worksOffline} />
          {tool.status === "soon" && (
            <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-bold text-accent-ink">
              Coming soon
            </span>
          )}
        </div>
        <p className="text-sm text-muted">{tool.description}</p>
        {tool.requiresAccount && tool.status === "soon" && (
          <p className="mt-1 text-xs font-semibold text-muted">
            Will need a free account
          </p>
        )}
        {tool.requiresAccount && tool.status === "live" && (
          <p className="mt-1 text-xs font-semibold text-muted">
            Preview: saved on this device only
          </p>
        )}
      </div>
      {onToggleFavourite && (
        <FavouriteButton
          favourited={Boolean(favourited)}
          onToggle={onToggleFavourite}
          toolName={tool.name}
          className="shrink-0"
        />
      )}
      {tool.status === "live" && (
        <span
          aria-hidden="true"
          className="shrink-0 font-semibold text-brand group-hover:underline"
        >
          →
        </span>
      )}
    </>
  );
}

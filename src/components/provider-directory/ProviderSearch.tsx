"use client";

import { useEffect, useState, useTransition } from "react";
import {
  ALLIED_HEALTH_SPECIALTIES,
  AU_STATES,
  type ProviderCategoryInfo,
  type ProviderListing,
} from "@/lib/provider-directory-data";
import { searchProviderListings } from "@/app/actions/provider-directory";
import ProviderCard from "./ProviderCard";

interface ProviderSearchProps {
  categoryInfo: ProviderCategoryInfo;
}

export default function ProviderSearch({ categoryInfo }: ProviderSearchProps) {
  const [state, setState] = useState("");
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [results, setResults] = useState<ProviderListing[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const found = await searchProviderListings({
        category: categoryInfo.category,
        state: state || undefined,
        query: query.trim() || undefined,
        specialty: specialty || undefined,
      });
      setResults(found);
      setHasSearched(true);
    });
  }, [categoryInfo.category, state, query, specialty]);

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border-2 border-border bg-surface p-4">
        <h2 className="font-display mb-3 text-lg font-bold">Search</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1 block font-semibold">State</span>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="touch-target w-full rounded-xl border-2 border-border bg-background px-3"
            >
              <option value="">Any state</option>
              {AU_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-semibold">Suburb, region or business name</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Geelong"
              className="touch-target w-full rounded-xl border-2 border-border bg-background px-3"
            />
          </label>
        </div>
        {categoryInfo.category === "allied-health" && (
          <label className="mt-3 block text-sm">
            <span className="mb-1 block font-semibold">Specialty</span>
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="touch-target w-full rounded-xl border-2 border-border bg-background px-3"
            >
              <option value="">Any specialty</option>
              {ALLIED_HEALTH_SPECIALTIES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        )}
        <p className="mt-3 text-xs text-muted">
          Search matches suburbs/regions written into each listing&apos;s
          service area — it isn&apos;t a map or exact-distance search.
        </p>
      </div>

      <p aria-live="polite" className="sr-only">
        {isPending ? "Searching…" : `${results.length} results found`}
      </p>

      {isPending ? (
        <p className="text-center text-muted">Searching…</p>
      ) : results.length === 0 ? (
        <p className="rounded-xl border-2 border-dashed border-border p-8 text-center text-muted">
          {hasSearched
            ? "No approved listings match yet — be the first to list your service below."
            : "Loading…"}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {results.map((listing) => (
            <ProviderCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}

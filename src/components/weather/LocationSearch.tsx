"use client";

import { useState } from "react";
import type { WeatherLocation } from "@/lib/weather-data";

interface LocationSearchProps {
  onSelect: (location: WeatherLocation) => void;
}

interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
}

export default function LocationSearch({ onSelect }: LocationSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    setStatus("loading");
    setResults([]);
    try {
      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=6&language=en&format=json`
      );
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      setResults(data.results ?? []);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  function handleUseMyLocation() {
    if (!("geolocation" in navigator)) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onSelect({
          name: "My location",
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setStatus("idle");
      },
      () => setStatus("error"),
      { timeout: 10000 }
    );
  }

  return (
    <div className="rounded-2xl border-2 border-border bg-surface p-4">
      <h2 className="font-display mb-3 text-lg font-bold">Location</h2>
      <form onSubmit={handleSearch} className="flex gap-2">
        <label htmlFor="weather-location-search" className="sr-only">
          Search for a suburb or town
        </label>
        <input
          id="weather-location-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a suburb or town"
          maxLength={100}
          className="flex-1 rounded-xl border-2 border-border bg-background px-4 py-3 touch-target"
        />
        <button
          type="submit"
          className="touch-target shrink-0 rounded-xl border-2 border-brand bg-brand px-4 font-semibold text-brand-ink"
        >
          Search
        </button>
      </form>
      <button
        type="button"
        onClick={handleUseMyLocation}
        className="touch-target mt-2 w-full rounded-xl border-2 border-border bg-background px-4 text-sm font-semibold hover:border-brand"
      >
        📍 Use my location
      </button>

      {status === "loading" && <p className="mt-3 text-sm text-muted">Looking...</p>}
      {status === "error" && (
        <p className="mt-3 text-sm text-muted">
          Couldn&apos;t find that, or location access wasn&apos;t available. Try typing a
          suburb or town name instead.
        </p>
      )}

      {results.length > 0 && (
        <ul className="mt-3 flex flex-col gap-1.5">
          {results.map((r) => (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => {
                  onSelect({
                    name: r.name,
                    admin1: r.admin1,
                    country: r.country,
                    latitude: r.latitude,
                    longitude: r.longitude,
                  });
                  setResults([]);
                  setQuery("");
                }}
                className="touch-target w-full rounded-xl border-2 border-border bg-background px-4 text-left text-sm font-semibold hover:border-brand"
              >
                {r.name}
                {r.admin1 ? `, ${r.admin1}` : ""}
                {r.country ? `, ${r.country}` : ""}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

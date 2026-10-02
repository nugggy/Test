// Pure helpers for turning a list of timestamped check-ins into simple
// "what's been happening lately" summaries. Shared by the Emotion Tracker
// and the Traffic Light Check-In. No React, so they can be unit tested.

export interface TimestampedEntry {
  timestamp: string; // UTC ISO string
}

/** Calendar day (yyyy-mm-dd) that `iso` falls on within `timezone`. */
export function dayKey(iso: string, timezone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(iso));
  const lookup = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  return `${lookup.year}-${lookup.month}-${lookup.day}`;
}

/** The last `days` calendar days in `timezone`, newest first, as yyyy-mm-dd keys. */
export function recentDayKeys(days: number, timezone: string, now: Date = new Date()): string[] {
  const keys: string[] = [];
  const todayKey = dayKey(now.toISOString(), timezone);
  const [y, m, d] = todayKey.split("-").map(Number);
  // Step back whole days from today's local date using UTC arithmetic on the
  // date parts alone, so daylight saving changes can't skip or repeat a day.
  for (let i = 0; i < days; i++) {
    const date = new Date(Date.UTC(y, m - 1, d - i));
    keys.push(date.toISOString().slice(0, 10));
  }
  return keys;
}

/** Entries that fall within the last `days` calendar days (including today). */
export function entriesInLastDays<T extends TimestampedEntry>(
  entries: T[],
  days: number,
  timezone: string,
  now: Date = new Date()
): T[] {
  const keys = new Set(recentDayKeys(days, timezone, now));
  return entries.filter((e) => isValidIso(e.timestamp) && keys.has(dayKey(e.timestamp, timezone)));
}

/** Count entries by a key (e.g. emotion id), keeping the order of `order`
 * and leaving out anything with a zero count. */
export function countBy<T>(
  entries: T[],
  getKey: (entry: T) => string,
  order: string[]
): { key: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const entry of entries) {
    const key = getKey(entry);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return order
    .filter((key) => (counts.get(key) ?? 0) > 0)
    .map((key) => ({ key, count: counts.get(key) ?? 0 }));
}

/** Group entries into the last `days` calendar days, newest day first. Days
 * with no entries are included with an empty list so gaps are visible. */
export function groupByRecentDays<T extends TimestampedEntry>(
  entries: T[],
  days: number,
  timezone: string,
  now: Date = new Date()
): { day: string; entries: T[] }[] {
  const keys = recentDayKeys(days, timezone, now);
  const groups = new Map<string, T[]>(keys.map((k) => [k, []]));
  for (const entry of entries) {
    if (!isValidIso(entry.timestamp)) continue;
    const list = groups.get(dayKey(entry.timestamp, timezone));
    if (list) list.push(entry);
  }
  return keys.map((day) => ({
    day,
    // Oldest first within a day, so it reads in the order things happened.
    entries: (groups.get(day) ?? []).sort((a, b) => a.timestamp.localeCompare(b.timestamp)),
  }));
}

/** "Thu 2 Oct" style label for a yyyy-mm-dd key, independent of timezone. */
export function formatDayKey(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  if ([y, m, d].some((n) => Number.isNaN(n))) return key;
  return new Intl.DateTimeFormat("en-AU", {
    timeZone: "UTC",
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date(Date.UTC(y, m - 1, d)));
}

function isValidIso(iso: unknown): iso is string {
  return typeof iso === "string" && !Number.isNaN(new Date(iso).getTime());
}

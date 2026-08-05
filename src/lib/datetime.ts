// Timestamps are always stored as UTC ISO strings (new Date().toISOString());
// these helpers format them for display in the user's selected IANA
// timezone (see timezone-context.tsx), which defaults to Australia/Sydney.

export function formatDateTime(iso: string, timezone: string): string {
  return new Intl.DateTimeFormat("en-AU", {
    timeZone: timezone,
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function formatDate(iso: string, timezone: string): string {
  return new Intl.DateTimeFormat("en-AU", {
    timeZone: timezone,
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export function formatShortDate(iso: string, timezone: string): string {
  return new Intl.DateTimeFormat("en-AU", {
    timeZone: timezone,
    day: "numeric",
    month: "short",
  }).format(new Date(iso));
}

export function formatTime(iso: string, timezone: string): string {
  return new Intl.DateTimeFormat("en-AU", {
    timeZone: timezone,
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

/** Today's date (yyyy-mm-dd) as it currently is within `timezone` — used to default date inputs. */
export function getTodayDateString(timezone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const lookup = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  return `${lookup.year}-${lookup.month}-${lookup.day}`;
}

/** Hour of day (0-23) that `iso` falls on within `timezone`, for time-of-day pattern charts. */
export function getHourInTimezone(iso: string, timezone: string): number {
  const hour = new Intl.DateTimeFormat("en-AU", {
    timeZone: timezone,
    hour: "numeric",
    hourCycle: "h23",
  }).format(new Date(iso));
  return parseInt(hour, 10);
}

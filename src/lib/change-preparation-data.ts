// Starter ideas for the Change Preparation Toolkit. Tapping one adds it to
// the list, where it can be ticked or deleted. Everyday, practical ideas
// only - nothing clinical.

export const CHANGING_SUGGESTIONS = [
  "Where I will live",
  "Where I go each day",
  "Who will support me",
  "My bedroom",
  "How I get there",
  "What time things happen",
  "My daily routine",
];

export const STAYING_SUGGESTIONS = [
  "My family",
  "My friends",
  "My favourite things",
  "My pet",
  "My bedtime routine",
  "My phone and music",
  "People I can call",
];

export const HELP_SUGGESTIONS = [
  "Visit the new place before the day",
  "Look at photos of the new place",
  "Meet the new person first",
  "Bring a favourite comfort item",
  "Use a visual schedule on the day",
  "Read a social story about the change",
  "Plan a quiet break",
  "Count down the days on a calendar",
  "Know who to ask for help",
];

/** Whole days from `today` to `dateStr` (both yyyy-mm-dd). Negative means
 * the date has passed; null when there's no date. Uses UTC maths so
 * daylight-saving changes can't make a day count wrong. */
export function daysUntil(dateStr: string, today: string): number | null {
  const parse = (s: string) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
    return m ? Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : NaN;
  };
  const a = parse(dateStr);
  const b = parse(today);
  if (Number.isNaN(a) || Number.isNaN(b)) return null;
  return Math.round((a - b) / 86_400_000);
}

export function countdownLabel(days: number | null): string | null {
  if (days === null) return null;
  if (days === 0) return "It's today";
  if (days === 1) return "Tomorrow. 1 sleep to go";
  if (days > 1) return `${days} days to go (${days} sleeps)`;
  if (days === -1) return "That was yesterday";
  return `That was ${Math.abs(days)} days ago`;
}

/** yyyy-mm-dd as an Australian date, e.g. "Friday 16 October 2026". */
export function formatChangeDate(dateStr: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  if (!m) return dateStr;
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  return new Intl.DateTimeFormat("en-AU", {
    timeZone: "UTC",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

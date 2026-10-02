export interface SleepQualityLevel {
  value: number;
  label: string;
  emoji: string;
}

export const QUALITY_LEVELS: SleepQualityLevel[] = [
  { value: 1, label: "Poor", emoji: "😣" },
  { value: 2, label: "Fair", emoji: "😕" },
  { value: 3, label: "Okay", emoji: "😐" },
  { value: 4, label: "Good", emoji: "🙂" },
  { value: 5, label: "Great", emoji: "😴" },
];

/** Hours slept between a bedtime and wake time (both "HH:MM"), assuming an
 * overnight sleep - if wake time is earlier in the day than bedtime, it's
 * treated as the next day. */
export function computeHoursSlept(bedTime: string, wakeTime: string): number {
  const [bedH, bedM] = bedTime.split(":").map(Number);
  const [wakeH, wakeM] = wakeTime.split(":").map(Number);
  if ([bedH, bedM, wakeH, wakeM].some((n) => Number.isNaN(n))) return 0;

  const bedMinutes = bedH * 60 + bedM;
  let wakeMinutes = wakeH * 60 + wakeM;
  if (wakeMinutes <= bedMinutes) wakeMinutes += 24 * 60;

  return Math.round(((wakeMinutes - bedMinutes) / 60) * 10) / 10;
}

/** "Thu 2 Oct 2026" style label for a yyyy-mm-dd entry date. The date is a
 * calendar day, not a moment in time, so it's formatted in UTC to stop any
 * timezone shifting it to the day before or after. */
export function formatSleepDate(date: string, options: { short?: boolean } = {}): string {
  const [y, m, d] = date.split("-").map(Number);
  if ([y, m, d].some((n) => Number.isNaN(n))) return date;
  return new Intl.DateTimeFormat("en-AU", {
    timeZone: "UTC",
    ...(options.short
      ? { day: "numeric", month: "short" }
      : { weekday: "short", day: "numeric", month: "short", year: "numeric" }),
  }).format(new Date(Date.UTC(y, m - 1, d)));
}

export interface SleepEntryLike {
  id: string;
  date: string;
  bedTime: string;
  wakeTime: string;
  quality: number;
  notes: string;
  /** Times woken in the night. Added later, so older entries have none. */
  wakeUps?: number;
}

function makeFallbackId(index: number) {
  return `sleep-restored-${index}`;
}

/** Load saved entries from any earlier version safely. Entries are kept even
 * if a field is missing - missing values get harmless defaults - and only
 * things that aren't entries at all are skipped. */
export function normaliseSleepEntries(raw: unknown): SleepEntryLike[] {
  if (!Array.isArray(raw)) return [];
  const result: SleepEntryLike[] = [];
  raw.forEach((item, index) => {
    if (!item || typeof item !== "object") return;
    const r = item as Record<string, unknown>;
    const quality = typeof r.quality === "number" && r.quality >= 1 && r.quality <= 5 ? r.quality : 3;
    const entry: SleepEntryLike = {
      id: typeof r.id === "string" && r.id ? r.id : makeFallbackId(index),
      date: typeof r.date === "string" ? r.date : "",
      bedTime: typeof r.bedTime === "string" ? r.bedTime : "",
      wakeTime: typeof r.wakeTime === "string" ? r.wakeTime : "",
      quality,
      notes: typeof r.notes === "string" ? r.notes : "",
    };
    if (typeof r.wakeUps === "number" && Number.isFinite(r.wakeUps) && r.wakeUps >= 0) {
      entry.wakeUps = Math.round(r.wakeUps);
    }
    result.push(entry);
  });
  return result;
}

export interface SleepSummary {
  nights: number;
  averageHours: number;
  /** Rounded average of the 1 to 5 quality ratings. */
  averageQuality: number;
  /** Average night wakings, only across nights where it was recorded. */
  averageWakeUps: number | null;
}

/** Plain averages across the most recent `count` nights logged. Descriptive
 * only - no "good" or "bad" amounts of sleep are implied. */
export function summariseRecentNights(entries: SleepEntryLike[], count = 7): SleepSummary | null {
  const recent = [...entries]
    .filter((e) => e.date)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, count);
  if (recent.length === 0) return null;
  const totalHours = recent.reduce((sum, e) => sum + computeHoursSlept(e.bedTime, e.wakeTime), 0);
  const totalQuality = recent.reduce((sum, e) => sum + e.quality, 0);
  const withWakeUps = recent.filter((e) => typeof e.wakeUps === "number");
  return {
    nights: recent.length,
    averageHours: Math.round((totalHours / recent.length) * 10) / 10,
    averageQuality: Math.round(totalQuality / recent.length),
    averageWakeUps:
      withWakeUps.length > 0
        ? Math.round((withWakeUps.reduce((s, e) => s + (e.wakeUps ?? 0), 0) / withWakeUps.length) * 10) / 10
        : null,
  };
}

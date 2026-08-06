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
 * overnight sleep — if wake time is earlier in the day than bedtime, it's
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

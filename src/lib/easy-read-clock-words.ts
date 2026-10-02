// Plain-language time for the Easy-Read Clock: "Quarter past 3",
// "Half past 7", "About 10 to 4". Many people who find it hard to read a
// clock face or a string of digits understand time said this way, and it is
// how support people usually say it out loud.

export type PartOfDay = "morning" | "afternoon" | "evening" | "night";

export interface PartOfDayInfo {
  id: PartOfDay;
  label: string;
  emoji: string;
}

const PARTS: Record<PartOfDay, PartOfDayInfo> = {
  morning: { id: "morning", label: "Morning", emoji: "🌅" },
  afternoon: { id: "afternoon", label: "Afternoon", emoji: "☀️" },
  evening: { id: "evening", label: "Evening", emoji: "🌆" },
  night: { id: "night", label: "Night", emoji: "🌙" },
};

/** Everyday (not official) parts of the day: morning 5am to before 12pm,
 * afternoon 12pm to before 5pm, evening 5pm to before 9pm, night after
 * that. `hour` is 0-23. */
export function partOfDay(hour: number): PartOfDayInfo {
  const h = ((Math.floor(hour) % 24) + 24) % 24;
  if (h >= 5 && h < 12) return PARTS.morning;
  if (h >= 12 && h < 17) return PARTS.afternoon;
  if (h >= 17 && h < 21) return PARTS.evening;
  return PARTS.night;
}

function hourName(hour24: number): string {
  const h = ((hour24 % 24) + 24) % 24;
  if (h === 0) return "midnight";
  if (h === 12) return "midday";
  return String(h % 12);
}

function hourPhrase(hour24: number, oClock: boolean): string {
  const name = hourName(hour24);
  if (name === "midnight" || name === "midday") return name;
  return oClock ? `${name} o'clock` : name;
}

/**
 * The time in plain words, rounded to the nearest five minutes. When the
 * real time isn't exactly on a five-minute mark, the phrase starts with
 * "About" so it is never misleading.
 *
 * Examples: 3:00 "3 o'clock", 3:15 "Quarter past 3", 3:30 "Half past 3",
 * 3:45 "Quarter to 4", 3:40 "20 to 4", 3:08 "About 10 past 3",
 * 11:58 "About midday", 0:00 "Midnight".
 */
export function timeInWords(hour: number, minute: number): string {
  const totalMinutes = ((Math.floor(hour) * 60 + Math.floor(minute)) % 1440 + 1440) % 1440;
  const rounded = Math.round(totalMinutes / 5) * 5;
  const exact = rounded === totalMinutes;
  const h = Math.floor(rounded / 60) % 24;
  const m = rounded % 60;

  let phrase: string;
  if (m === 0) phrase = hourPhrase(h, true);
  else if (m === 15) phrase = `quarter past ${hourPhrase(h, false)}`;
  else if (m === 30) phrase = `half past ${hourPhrase(h, false)}`;
  else if (m === 45) phrase = `quarter to ${hourPhrase(h + 1, false)}`;
  else if (m < 30) phrase = `${m} past ${hourPhrase(h, false)}`;
  else phrase = `${60 - m} to ${hourPhrase(h + 1, false)}`;

  const full = exact ? phrase : `about ${phrase}`;
  return full.charAt(0).toUpperCase() + full.slice(1);
}

/** What the "hear the time" button says, e.g. "It's quarter past 3 in the
 * afternoon." Midnight and midday are said without a part of the day. */
export function spokenTime(hour: number, minute: number): string {
  const words = timeInWords(hour, minute);
  const lower = words.charAt(0).toLowerCase() + words.slice(1);
  const plainHour = /midnight|midday/.test(lower);
  if (plainHour) return `It's ${lower}.`;
  const part = partOfDay(hour).id;
  const suffix = part === "night" ? "at night" : `in the ${part}`;
  return `It's ${lower} ${suffix}.`;
}

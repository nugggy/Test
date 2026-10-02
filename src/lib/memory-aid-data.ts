import type { TimeOfDay } from "./memory-aid-storage";

export interface TimeOfDayGroup {
  id: TimeOfDay;
  label: string;
  icon: string;
}

export const TIME_OF_DAY_GROUPS: TimeOfDayGroup[] = [
  { id: "morning", label: "Morning", icon: "🌅" },
  { id: "afternoon", label: "Afternoon", icon: "☀️" },
  { id: "evening", label: "Evening", icon: "🌙" },
  { id: "anytime", label: "Anytime", icon: "⏰" },
];

/** Which group is "now", from the hour (0-23): morning 5am to before 12pm,
 * afternoon 12pm to before 5pm, evening 5pm to before midnight. Overnight
 * (midnight to 5am) no group is highlighted. */
export function currentTimeOfDay(hour: number): TimeOfDay | null {
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 24) return "evening";
  return null;
}

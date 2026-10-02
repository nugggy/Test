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

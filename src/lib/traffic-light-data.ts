export interface TrafficLightState {
  id: "green" | "amber" | "red";
  label: string;
  description: string;
  suggestion: string;
  emoji: string;
  colorVar: string; // reuses the severity status ramp from globals.css
}

export const ZONE_GUIDE_SUGGESTIONS: Record<"green" | "amber" | "red", string[]> = {
  green: [
    "Smiling",
    "Happy",
    "Telling jokes",
    "Interacting with others",
    "Asking open questions",
  ],
  amber: [
    "Asking closed questions",
    "Withdrawn",
    "Quiet",
    "Fidgeting",
    "Short answers",
  ],
  red: ["Shouting", "Swearing", "Pacing", "Refusing to talk", "Walking away"],
};

export const TRAFFIC_LIGHT_STATES: TrafficLightState[] = [
  {
    id: "green",
    label: "Green",
    description: "I'm feeling OK",
    suggestion: "Keep going with what you're doing.",
    emoji: "🟢",
    colorVar: "sev-1",
  },
  {
    id: "amber",
    label: "Amber",
    description: "Getting worried or overwhelmed",
    suggestion:
      "Take a break, try a calming strategy, or ask for some space.",
    emoji: "🟡",
    colorVar: "sev-3",
  },
  {
    id: "red",
    label: "Red",
    description: "I need help now",
    suggestion: "Get help from a trusted person right away.",
    emoji: "🔴",
    colorVar: "sev-5",
  },
];

export interface ToolEntry {
  slug: string;
  name: string;
  description: string;
  icon: string;
  status: "live" | "soon";
  category: string;
  requiresAccount?: boolean;
}

export const tools: ToolEntry[] = [
  {
    slug: "communication-board",
    name: "Visual Communication Board",
    description:
      "Tap pictures to speak wants, needs and feelings out loud. Works offline, no account needed.",
    icon: "🗣️",
    status: "live",
    category: "Communication",
  },
  {
    slug: "visual-schedule",
    name: "Visual Schedule Builder",
    description: "Build a picture timeline of the day so routines feel predictable.",
    icon: "🗓️",
    status: "live",
    category: "Routines",
  },
  {
    slug: "social-story",
    name: "Social Story Creator",
    description: "Create a simple, illustrated story to prepare for a new place or event.",
    icon: "📖",
    status: "soon",
    category: "Preparation",
    requiresAccount: true,
  },
  {
    slug: "behaviour-tracking",
    name: "Behaviour Tracking Tool",
    description: "Quick ABC (antecedent-behaviour-consequence) data collection with trend charts.",
    icon: "📊",
    status: "soon",
    category: "Allied health",
    requiresAccount: true,
  },
  {
    slug: "emotion-tracker",
    name: "Emotion Tracker",
    description: "Daily emotion check-ins to build self-awareness and spot patterns over time.",
    icon: "🙂",
    status: "live",
    category: "Wellbeing",
  },
];

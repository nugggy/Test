export interface ActivityDef {
  id: string;
  label: string;
  icon: string;
}

export const ACTIVITY_LIBRARY: ActivityDef[] = [
  { id: "wake-up", label: "Wake up", icon: "☀️" },
  { id: "breakfast", label: "Breakfast", icon: "🥣" },
  { id: "brush-teeth", label: "Brush teeth", icon: "🪥" },
  { id: "wash-face", label: "Wash face", icon: "🧼" },
  { id: "get-dressed", label: "Get dressed", icon: "👕" },
  { id: "school", label: "School", icon: "🏫" },
  { id: "work", label: "Work", icon: "💼" },
  { id: "morning-tea", label: "Morning tea", icon: "🍪" },
  { id: "lunch", label: "Lunch", icon: "🍱" },
  { id: "therapy", label: "Therapy session", icon: "🧩" },
  { id: "medication", label: "Medication", icon: "💊" },
  { id: "outside-time", label: "Outside time", icon: "🌳" },
  { id: "play", label: "Play", icon: "🧸" },
  { id: "reading", label: "Reading", icon: "📚" },
  { id: "screen-time", label: "Screen time", icon: "📱" },
  { id: "homework", label: "Homework", icon: "✏️" },
  { id: "chores", label: "Chores", icon: "🧹" },
  { id: "afternoon-tea", label: "Afternoon tea", icon: "🍎" },
  { id: "dinner", label: "Dinner", icon: "🍽️" },
  { id: "bath", label: "Bath / shower", icon: "🛁" },
  { id: "pyjamas", label: "Pyjamas", icon: "🩳" },
  { id: "story-time", label: "Story time", icon: "📖" },
  { id: "bedtime", label: "Bedtime", icon: "🛏️" },
  { id: "free-choice", label: "Free choice", icon: "✨" },
  { id: "travel", label: "Travel / car trip", icon: "🚗" },
  { id: "appointment", label: "Appointment", icon: "🗓️" },
];

export type CategoryId =
  | "food"
  | "drinks"
  | "emotions"
  | "pain"
  | "toileting"
  | "activities"
  | "requests";

export interface CategoryDef {
  id: CategoryId;
  name: string;
  icon: string;
  colorVar: string; // maps to --cat-{id} in globals.css
}

export interface BoardItem {
  id: string;
  label: string;
  emoji: string;
  categoryId: CategoryId;
  custom?: boolean;
}

export const CATEGORIES: CategoryDef[] = [
  { id: "food", name: "Food", icon: "🍽️", colorVar: "cat-food" },
  { id: "drinks", name: "Drinks", icon: "🥤", colorVar: "cat-drinks" },
  { id: "emotions", name: "Emotions", icon: "💭", colorVar: "cat-emotions" },
  { id: "pain", name: "Pain", icon: "🩹", colorVar: "cat-pain" },
  { id: "toileting", name: "Toileting", icon: "🚻", colorVar: "cat-toileting" },
  { id: "activities", name: "Activities", icon: "🎯", colorVar: "cat-activities" },
  { id: "requests", name: "Requests", icon: "🙋", colorVar: "cat-requests" },
];

export const DEFAULT_ITEMS: BoardItem[] = [
  // Food
  { id: "food-1", label: "Hungry", emoji: "🍽️", categoryId: "food" },
  { id: "food-2", label: "Bread", emoji: "🍞", categoryId: "food" },
  { id: "food-3", label: "Fruit", emoji: "🍎", categoryId: "food" },
  { id: "food-4", label: "Sandwich", emoji: "🥪", categoryId: "food" },
  { id: "food-5", label: "Snack", emoji: "🍪", categoryId: "food" },
  { id: "food-6", label: "More food", emoji: "➕", categoryId: "food" },
  { id: "food-7", label: "All done eating", emoji: "🚫", categoryId: "food" },

  // Drinks
  { id: "drinks-1", label: "Thirsty", emoji: "🥤", categoryId: "drinks" },
  { id: "drinks-2", label: "Water", emoji: "💧", categoryId: "drinks" },
  { id: "drinks-3", label: "Juice", emoji: "🧃", categoryId: "drinks" },
  { id: "drinks-4", label: "Milk", emoji: "🥛", categoryId: "drinks" },
  { id: "drinks-5", label: "Hot drink", emoji: "☕", categoryId: "drinks" },
  { id: "drinks-6", label: "More drink", emoji: "➕", categoryId: "drinks" },

  // Emotions
  { id: "emotions-1", label: "Happy", emoji: "😀", categoryId: "emotions" },
  { id: "emotions-2", label: "Sad", emoji: "😢", categoryId: "emotions" },
  { id: "emotions-3", label: "Angry", emoji: "😠", categoryId: "emotions" },
  { id: "emotions-4", label: "Scared", emoji: "😨", categoryId: "emotions" },
  { id: "emotions-5", label: "Tired", emoji: "😴", categoryId: "emotions" },
  { id: "emotions-6", label: "Excited", emoji: "🤩", categoryId: "emotions" },
  { id: "emotions-7", label: "Confused", emoji: "😕", categoryId: "emotions" },
  { id: "emotions-8", label: "Calm", emoji: "😌", categoryId: "emotions" },

  // Pain
  { id: "pain-1", label: "It hurts", emoji: "🩹", categoryId: "pain" },
  { id: "pain-2", label: "Head", emoji: "🤕", categoryId: "pain" },
  { id: "pain-3", label: "Tummy", emoji: "🫃", categoryId: "pain" },
  { id: "pain-4", label: "Sharp pain", emoji: "⚡", categoryId: "pain" },
  { id: "pain-5", label: "Dull ache", emoji: "🌫️", categoryId: "pain" },
  { id: "pain-6", label: "Feeling sick", emoji: "🤢", categoryId: "pain" },

  // Toileting
  { id: "toilet-1", label: "Need toilet", emoji: "🚻", categoryId: "toileting" },
  { id: "toilet-2", label: "Wash hands", emoji: "🧼", categoryId: "toileting" },
  { id: "toilet-3", label: "Need help", emoji: "🆘", categoryId: "toileting" },
  { id: "toilet-4", label: "All finished", emoji: "✅", categoryId: "toileting" },

  // Activities
  { id: "activity-1", label: "Music", emoji: "🎵", categoryId: "activities" },
  { id: "activity-2", label: "Outside", emoji: "🌳", categoryId: "activities" },
  { id: "activity-3", label: "Read", emoji: "📚", categoryId: "activities" },
  { id: "activity-4", label: "Screen time", emoji: "📱", categoryId: "activities" },
  { id: "activity-5", label: "Draw", emoji: "🎨", categoryId: "activities" },
  { id: "activity-6", label: "Rest", emoji: "🛋️", categoryId: "activities" },
  { id: "activity-7", label: "Walk", emoji: "🚶", categoryId: "activities" },

  // Requests
  { id: "request-1", label: "Yes", emoji: "👍", categoryId: "requests" },
  { id: "request-2", label: "No", emoji: "👎", categoryId: "requests" },
  { id: "request-3", label: "Please", emoji: "🙏", categoryId: "requests" },
  { id: "request-4", label: "Thank you", emoji: "😊", categoryId: "requests" },
  { id: "request-5", label: "Wait", emoji: "✋", categoryId: "requests" },
  { id: "request-6", label: "Help me", emoji: "🆘", categoryId: "requests" },
  { id: "request-7", label: "Stop", emoji: "🛑", categoryId: "requests" },
  { id: "request-8", label: "I want that", emoji: "👉", categoryId: "requests" },
];

// Shown in a fixed "Quick words" row above the tabs on every screen, so the
// most urgent messages are always in the same place and one tap away.
export const QUICK_ITEM_IDS = ["request-1", "request-2", "request-6", "request-7"];

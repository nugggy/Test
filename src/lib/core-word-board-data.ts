export type CoreCategoryId =
  | "pronouns"
  | "verbs"
  | "descriptors"
  | "social"
  | "questions"
  | "negation";

export interface CoreCategoryDef {
  id: CoreCategoryId;
  name: string;
  colorVar: string; // maps to --cat-core-{id} in globals.css
}

export interface CoreWord {
  id: string;
  label: string;
  categoryId: CoreCategoryId;
}

export const CORE_CATEGORIES: CoreCategoryDef[] = [
  { id: "pronouns", name: "Pronouns", colorVar: "cat-core-pronouns" },
  { id: "verbs", name: "Verbs", colorVar: "cat-core-verbs" },
  { id: "descriptors", name: "Descriptors", colorVar: "cat-core-descriptors" },
  { id: "social", name: "Social", colorVar: "cat-core-social" },
  { id: "questions", name: "Questions", colorVar: "cat-core-questions" },
  { id: "negation", name: "Yes / No", colorVar: "cat-core-negation" },
];

// A fixed, non-customisable set of high-frequency core words - unlike the
// picture-based, fully-customisable Communication Board, a core board
// stays the same every time so its layout and colours become familiar and
// automatic with practice. IMPORTANT for anyone editing this list: only ever
// ADD new words at the END of a category. Moving or removing a word changes
// where every later word sits, which undoes the motor learning AAC users
// rely on.
export const CORE_WORDS: CoreWord[] = [
  // Pronouns
  { id: "i", label: "I", categoryId: "pronouns" },
  { id: "you", label: "you", categoryId: "pronouns" },
  { id: "it", label: "it", categoryId: "pronouns" },
  { id: "that", label: "that", categoryId: "pronouns" },
  { id: "my", label: "my", categoryId: "pronouns" },
  { id: "me", label: "me", categoryId: "pronouns" },
  { id: "we", label: "we", categoryId: "pronouns" },
  { id: "your", label: "your", categoryId: "pronouns" },
  { id: "they", label: "they", categoryId: "pronouns" },

  // Verbs
  { id: "want", label: "want", categoryId: "verbs" },
  { id: "go", label: "go", categoryId: "verbs" },
  { id: "stop", label: "stop", categoryId: "verbs" },
  { id: "help", label: "help", categoryId: "verbs" },
  { id: "like", label: "like", categoryId: "verbs" },
  { id: "put", label: "put", categoryId: "verbs" },
  { id: "look", label: "look", categoryId: "verbs" },
  { id: "play", label: "play", categoryId: "verbs" },
  { id: "eat", label: "eat", categoryId: "verbs" },
  { id: "drink", label: "drink", categoryId: "verbs" },
  { id: "need", label: "need", categoryId: "verbs" },
  { id: "feel", label: "feel", categoryId: "verbs" },
  { id: "get", label: "get", categoryId: "verbs" },
  { id: "open", label: "open", categoryId: "verbs" },
  { id: "turn", label: "turn", categoryId: "verbs" },
  { id: "do", label: "do", categoryId: "verbs" },
  { id: "make", label: "make", categoryId: "verbs" },
  { id: "come", label: "come", categoryId: "verbs" },

  // Descriptors
  { id: "more", label: "more", categoryId: "descriptors" },
  { id: "all-done", label: "all done", categoryId: "descriptors" },
  { id: "good", label: "good", categoryId: "descriptors" },
  { id: "bad", label: "bad", categoryId: "descriptors" },
  { id: "big", label: "big", categoryId: "descriptors" },
  { id: "little", label: "little", categoryId: "descriptors" },
  { id: "different", label: "different", categoryId: "descriptors" },
  { id: "same", label: "same", categoryId: "descriptors" },
  { id: "hot", label: "hot", categoryId: "descriptors" },
  { id: "cold", label: "cold", categoryId: "descriptors" },
  { id: "fast", label: "fast", categoryId: "descriptors" },
  { id: "slow", label: "slow", categoryId: "descriptors" },
  { id: "up", label: "up", categoryId: "descriptors" },
  { id: "down", label: "down", categoryId: "descriptors" },
  { id: "in", label: "in", categoryId: "descriptors" },
  { id: "on", label: "on", categoryId: "descriptors" },
  { id: "off", label: "off", categoryId: "descriptors" },
  { id: "here", label: "here", categoryId: "descriptors" },

  // Social
  { id: "hello", label: "hello", categoryId: "social" },
  { id: "bye", label: "bye", categoryId: "social" },
  { id: "please", label: "please", categoryId: "social" },
  { id: "thank-you", label: "thank you", categoryId: "social" },
  { id: "sorry", label: "sorry", categoryId: "social" },
  { id: "okay", label: "okay", categoryId: "social" },

  // Questions
  { id: "what", label: "what", categoryId: "questions" },
  { id: "where", label: "where", categoryId: "questions" },
  { id: "who", label: "who", categoryId: "questions" },
  { id: "why", label: "why", categoryId: "questions" },
  { id: "when", label: "when", categoryId: "questions" },
  { id: "how", label: "how", categoryId: "questions" },

  // Yes / No
  { id: "yes", label: "yes", categoryId: "negation" },
  { id: "no", label: "no", categoryId: "negation" },
  { id: "not", label: "not", categoryId: "negation" },
  { id: "dont", label: "don't", categoryId: "negation" },
];

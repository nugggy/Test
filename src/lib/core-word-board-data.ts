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
// automatic with practice.
export const CORE_WORDS: CoreWord[] = [
  // Pronouns
  { id: "i", label: "I", categoryId: "pronouns" },
  { id: "you", label: "you", categoryId: "pronouns" },
  { id: "it", label: "it", categoryId: "pronouns" },
  { id: "that", label: "that", categoryId: "pronouns" },
  { id: "my", label: "my", categoryId: "pronouns" },

  // Verbs
  { id: "want", label: "want", categoryId: "verbs" },
  { id: "go", label: "go", categoryId: "verbs" },
  { id: "stop", label: "stop", categoryId: "verbs" },
  { id: "help", label: "help", categoryId: "verbs" },
  { id: "like", label: "like", categoryId: "verbs" },
  { id: "put", label: "put", categoryId: "verbs" },
  { id: "look", label: "look", categoryId: "verbs" },
  { id: "play", label: "play", categoryId: "verbs" },

  // Descriptors
  { id: "more", label: "more", categoryId: "descriptors" },
  { id: "all-done", label: "all done", categoryId: "descriptors" },
  { id: "good", label: "good", categoryId: "descriptors" },
  { id: "bad", label: "bad", categoryId: "descriptors" },
  { id: "big", label: "big", categoryId: "descriptors" },
  { id: "little", label: "little", categoryId: "descriptors" },

  // Social
  { id: "hello", label: "hello", categoryId: "social" },
  { id: "bye", label: "bye", categoryId: "social" },
  { id: "please", label: "please", categoryId: "social" },
  { id: "thank-you", label: "thank you", categoryId: "social" },
  { id: "sorry", label: "sorry", categoryId: "social" },

  // Questions
  { id: "what", label: "what", categoryId: "questions" },
  { id: "where", label: "where", categoryId: "questions" },
  { id: "who", label: "who", categoryId: "questions" },
  { id: "why", label: "why", categoryId: "questions" },

  // Yes / No
  { id: "yes", label: "yes", categoryId: "negation" },
  { id: "no", label: "no", categoryId: "negation" },
  { id: "not", label: "not", categoryId: "negation" },
];

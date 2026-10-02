/**
 * Colour styling for the tool categories: each category has its own
 * "sticker" colour used on filter chips, tool cards and list rows.
 *
 * Every class string is written out in full so Tailwind's scanner sees it.
 * The colours come from the --tint-* / --ink-* / --solid-* tokens in
 * globals.css, which also define the dark and high-contrast variants, so
 * nothing here needs to know which theme is active. Every ink-on-tint
 * pairing is 6:1 or better.
 */

export interface CategoryStyle {
  /** Soft background for sticker tiles, chips and badges. */
  tint: string;
  /** Text colour readable on the tint (and on white). */
  ink: string;
  /** Border in the ink colour, for the selected filter chip. */
  inkBorder: string;
  /** Bright decorative colour for dots (never text). */
  solid: string;
  /** The solid colour as a raw CSS value, for inline styles such as the
   * --pop-color hover shadow and Sprinkles confetti. */
  solidVar: string;
}

const STYLES: Record<string, CategoryStyle> = {
  Communication: {
    tint: "bg-[var(--tint-communication)]",
    ink: "text-[var(--ink-communication)]",
    inkBorder: "border-[var(--ink-communication)]",
    solid: "bg-[var(--solid-communication)]",
    solidVar: "var(--solid-communication)",
  },
  "Emotional regulation": {
    tint: "bg-[var(--tint-emotional)]",
    ink: "text-[var(--ink-emotional)]",
    inkBorder: "border-[var(--ink-emotional)]",
    solid: "bg-[var(--solid-emotional)]",
    solidVar: "var(--solid-emotional)",
  },
  "Independent living": {
    tint: "bg-[var(--tint-living)]",
    ink: "text-[var(--ink-living)]",
    inkBorder: "border-[var(--ink-living)]",
    solid: "bg-[var(--solid-living)]",
    solidVar: "var(--solid-living)",
  },
  Preparation: {
    tint: "bg-[var(--tint-preparation)]",
    ink: "text-[var(--ink-preparation)]",
    inkBorder: "border-[var(--ink-preparation)]",
    solid: "bg-[var(--solid-preparation)]",
    solidVar: "var(--solid-preparation)",
  },
  Routines: {
    tint: "bg-[var(--tint-routines)]",
    ink: "text-[var(--ink-routines)]",
    inkBorder: "border-[var(--ink-routines)]",
    solid: "bg-[var(--solid-routines)]",
    solidVar: "var(--solid-routines)",
  },
  Wellbeing: {
    tint: "bg-[var(--tint-wellbeing)]",
    ink: "text-[var(--ink-wellbeing)]",
    inkBorder: "border-[var(--ink-wellbeing)]",
    solid: "bg-[var(--solid-wellbeing)]",
    solidVar: "var(--solid-wellbeing)",
  },
  "Goals & planning": {
    tint: "bg-[var(--tint-goals)]",
    ink: "text-[var(--ink-goals)]",
    inkBorder: "border-[var(--ink-goals)]",
    solid: "bg-[var(--solid-goals)]",
    solidVar: "var(--solid-goals)",
  },
  "Allied health": {
    tint: "bg-[var(--tint-allied)]",
    ink: "text-[var(--ink-allied)]",
    inkBorder: "border-[var(--ink-allied)]",
    solid: "bg-[var(--solid-allied)]",
    solidVar: "var(--solid-allied)",
  },
};

/** Neutral fallback for any category added later without its own colour. */
const FALLBACK: CategoryStyle = {
  tint: "bg-surface-2",
  ink: "text-foreground",
  inkBorder: "border-foreground",
  solid: "bg-brand",
  solidVar: "var(--brand)",
};

export function categoryStyle(category: string): CategoryStyle {
  return STYLES[category] ?? FALLBACK;
}

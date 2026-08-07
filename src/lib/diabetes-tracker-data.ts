export const READING_CONTEXT_SUGGESTIONS = [
  "Before breakfast",
  "After breakfast",
  "Before lunch",
  "After lunch",
  "Before dinner",
  "After dinner",
  "Bedtime",
  "During the night",
  "Feeling unwell",
  "Before exercise",
  "After exercise",
];

export const INSULIN_TYPE_SUGGESTIONS = [
  "Rapid-acting",
  "Short-acting",
  "Intermediate-acting",
  "Long-acting / basal",
  "Mixed",
];

// General reference bands only, used purely to colour the trend chart so
// readings are easy to scan at a glance. Everyone's individual target range
// is set by their own diabetes care team - see the disclaimer on this tool.
export const BGL_LOW_MMOL = 4;
export const BGL_HIGH_MMOL = 8;

// Starter suggestions for the Management Plan tab - generic examples of the
// kind of thing a doctor/diabetes educator's plan might say, not
// recommendations. The person always fills in their own doctor's actual
// instructions.
export const LOW_ACTION_SUGGESTIONS = [
  "Give 15g fast-acting carbs (e.g. juice, glucose tablets, jellybeans)",
  "Recheck BGL after 15 minutes",
  "Repeat if still low",
  "Once above target, follow with a small snack (e.g. crackers, sandwich)",
  "Stay with the person until they've recovered",
];

export const HIGH_ACTION_SUGGESTIONS = [
  "Check for ketones",
  "Encourage water",
  "Follow correction dose as per the scale below",
  "Recheck BGL after 2 hours",
  "Avoid strenuous exercise until BGL comes down",
];

export const CORRECTION_SCALE_SUGGESTIONS = [
  "Below target range: treat as low first, no correction dose",
  "Within target range: no correction needed",
  "Slightly above target: follow doctor's correction dose",
  "Well above target: follow doctor's correction dose and recheck sooner",
  "Above emergency threshold: contact doctor or diabetes educator",
];

export const SICK_DAY_SUGGESTIONS = [
  "Check BGL more often (e.g. every 2-4 hours)",
  "Check for ketones",
  "Never stop insulin completely, even if not eating - contact the care team about adjusting the dose",
  "Keep up fluids",
  "Contact the doctor or diabetes educator early, don't wait",
];

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

// No built-in target range: the chart and log only colour readings against
// the range the person enters from their own diabetes care team's plan
// (see classifyReading in diabetes-management-plan-storage.ts).

// Starter suggestions for the Management Plan tab. Deliberately NOT
// treatments: no amounts, doses, foods or timings, because those must only
// ever come from the person's own diabetes care team. They help people
// structure the plan and point back to the care team's instructions.
export const LOW_ACTION_SUGGESTIONS = [
  "Follow the low (hypo) steps in my care team's plan",
  "Stay with the person until they've recovered",
  "Call 000 if they can't swallow, are not responding or have a seizure",
  "Write down the reading, what was done and the time",
];

export const HIGH_ACTION_SUGGESTIONS = [
  "Follow the high BGL steps in my care team's plan",
  "Write down the reading, what was done and the time",
  "Contact my doctor or diabetes educator if unsure what to do",
];

export const CORRECTION_SCALE_SUGGESTIONS = [
  "Copy the correction scale exactly as my doctor wrote it",
  "Ask my doctor or diabetes educator to check this section",
];

export const SICK_DAY_SUGGESTIONS = [
  "Follow my care team's sick day plan",
  "Contact my doctor or diabetes educator early, don't wait",
  "Write down readings, food and drinks while unwell",
];

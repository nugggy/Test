export const ANTECEDENT_SUGGESTIONS = [
  "Transition/change of activity",
  "Loud noise",
  "Denied request",
  "Unexpected change",
  "Tired/hungry",
  "Crowded space",
  "Waiting",
  "Task demand",
];

export const BEHAVIOUR_SUGGESTIONS = [
  "Shouting",
  "Hitting",
  "Property damage",
  "Elopement (running off)",
  "Self-injury",
  "Refusal",
  "Withdrawal",
  "Crying",
];

export const CONSEQUENCE_SUGGESTIONS = [
  "Removed from situation",
  "Given space/time",
  "Request was met",
  "Redirected to activity",
  "Comforted/reassured",
  "Ignored (planned)",
  "Sensory break",
];

export interface SeverityLevel {
  value: number;
  label: string;
  colorVar: string; // maps to --sev-{value} in globals.css
}

export const SEVERITY_LEVELS: SeverityLevel[] = [
  { value: 1, label: "Very mild", colorVar: "sev-1" },
  { value: 2, label: "Mild", colorVar: "sev-2" },
  { value: 3, label: "Moderate", colorVar: "sev-3" },
  { value: 4, label: "Severe", colorVar: "sev-4" },
  { value: 5, label: "Very severe", colorVar: "sev-5" },
];

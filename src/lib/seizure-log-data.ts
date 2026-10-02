export const SEIZURE_TYPE_SUGGESTIONS = [
  "Tonic-clonic",
  "Focal aware",
  "Focal impaired awareness",
  "Absence",
  "Myoclonic",
  "Atonic",
  "Unknown",
];

export const TRIGGER_SUGGESTIONS = [
  "Lack of sleep",
  "Missed medication",
  "Illness or fever",
  "Flashing lights",
  "Stress",
  "Menstrual cycle",
  "Unknown",
];

export const ACTION_OPTIONS = [
  "First aid given",
  "Rescue medication given",
  "Ambulance called (000)",
  "Went to hospital",
  "Recovered at home",
  "None needed",
];

export const SEVERITY_OPTIONS = ["Mild", "Moderate", "Severe"] as const;

export const CONSCIOUSNESS_OPTIONS = [
  "Fully aware",
  "Partly aware",
  "Not aware / unconscious",
] as const;

export const LOCATION_SUGGESTIONS = [
  "Home",
  "School",
  "Work",
  "In the community",
  "In the car",
  "Asleep / in bed",
];

/** Seizures lasting this long or more are a medical emergency under most
 * epilepsy management plans - call 000 if rescue medication hasn't already
 * been given. Used to flag entries on the dashboard, not as medical advice. */
export const PROLONGED_SEIZURE_SECONDS = 5 * 60;

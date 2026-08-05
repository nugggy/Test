export interface EmotionDef {
  id: string;
  label: string;
  emoji: string;
  colorVar: string; // maps to --emo-{id} in globals.css
}

export const EMOTIONS: EmotionDef[] = [
  { id: "happy", label: "Happy", emoji: "😀", colorVar: "emo-happy" },
  { id: "sad", label: "Sad", emoji: "😢", colorVar: "emo-sad" },
  { id: "angry", label: "Angry", emoji: "😠", colorVar: "emo-angry" },
  { id: "scared", label: "Scared", emoji: "😨", colorVar: "emo-scared" },
  { id: "tired", label: "Tired", emoji: "😴", colorVar: "emo-tired" },
  { id: "excited", label: "Excited", emoji: "🤩", colorVar: "emo-excited" },
  { id: "calm", label: "Calm", emoji: "😌", colorVar: "emo-calm" },
  { id: "confused", label: "Confused", emoji: "😕", colorVar: "emo-confused" },
];

export const INTENSITY_LEVELS = [
  { value: 1, label: "A little" },
  { value: 2, label: "Medium" },
  { value: 3, label: "A lot" },
];

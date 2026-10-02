// Starter sequences for common everyday tasks. They are general examples
// so people don't start from a blank page - every step can be changed,
// removed or reordered to match how the person actually does the task.

export interface SequenceTemplate {
  id: string;
  name: string;
  emoji: string;
  steps: { label: string; emoji: string }[];
}

export const SEQUENCE_TEMPLATES: SequenceTemplate[] = [
  {
    id: "wash-hands",
    name: "Washing hands",
    emoji: "🧼",
    steps: [
      { label: "Turn on the tap", emoji: "🚰" },
      { label: "Wet your hands", emoji: "💧" },
      { label: "Put soap on your hands", emoji: "🧼" },
      { label: "Rub your hands together", emoji: "👐" },
      { label: "Rinse off the soap", emoji: "💦" },
      { label: "Turn off the tap", emoji: "🚰" },
      { label: "Dry your hands on the towel", emoji: "🧻" },
    ],
  },
  {
    id: "brush-teeth",
    name: "Brushing teeth",
    emoji: "🪥",
    steps: [
      { label: "Get your toothbrush", emoji: "🪥" },
      { label: "Put toothpaste on the brush", emoji: "🧴" },
      { label: "Brush your top teeth", emoji: "😁" },
      { label: "Brush your bottom teeth", emoji: "😁" },
      { label: "Spit into the sink", emoji: "🚰" },
      { label: "Rinse your toothbrush", emoji: "💧" },
      { label: "Put your toothbrush away", emoji: "✅" },
    ],
  },
  {
    id: "make-toast",
    name: "Making toast",
    emoji: "🍞",
    steps: [
      { label: "Get the bread", emoji: "🍞" },
      { label: "Put the bread in the toaster", emoji: "⬇️" },
      { label: "Push the lever down", emoji: "👇" },
      { label: "Wait for the toast to pop up", emoji: "⏳" },
      { label: "Take the toast out carefully", emoji: "🍞" },
      { label: "Put the toast on a plate", emoji: "🍽️" },
      { label: "Spread butter or a topping", emoji: "🧈" },
    ],
  },
  {
    id: "get-dressed",
    name: "Getting dressed",
    emoji: "👕",
    steps: [
      { label: "Put on your underwear", emoji: "🩲" },
      { label: "Put on your shirt", emoji: "👕" },
      { label: "Put on your pants", emoji: "👖" },
      { label: "Put on your socks", emoji: "🧦" },
      { label: "Put on your shoes", emoji: "👟" },
      { label: "Check yourself in the mirror", emoji: "🪞" },
    ],
  },
  {
    id: "pack-bag",
    name: "Packing my bag for the day",
    emoji: "🎒",
    steps: [
      { label: "Put in your lunch", emoji: "🥪" },
      { label: "Put in your water bottle", emoji: "💧" },
      { label: "Put in your wallet and travel card", emoji: "💳" },
      { label: "Put in your phone", emoji: "📱" },
      { label: "Put in your keys", emoji: "🔑" },
      { label: "Zip up your bag", emoji: "🎒" },
    ],
  },
  {
    id: "leave-house",
    name: "Leaving the house",
    emoji: "🏠",
    steps: [
      { label: "Turn off the lights", emoji: "💡" },
      { label: "Check the stove is off", emoji: "🍳" },
      { label: "Get your bag, phone and keys", emoji: "🎒" },
      { label: "Close the windows", emoji: "🪟" },
      { label: "Lock the door", emoji: "🔐" },
    ],
  },
];

// Starter tasks for the Daily Life Assistant. Tapping one adds it with
// these steps already filled in, so nobody has to start from a blank page.
// Every step can be changed, removed or added to afterwards - they're a
// starting point, not the "right" way to do the task.

export interface StarterTask {
  title: string;
  emoji: string;
  steps: string[];
}

export const STARTER_TASKS: StarterTask[] = [
  {
    title: "How to do laundry",
    emoji: "🧺",
    steps: [
      "Sort clothes into lights and darks",
      "Put one pile in the washing machine",
      "Add washing powder or liquid",
      "Close the door and choose the wash setting",
      "Press start",
      "When it finishes, take the clothes out",
      "Hang them up or put them in the dryer",
    ],
  },
  {
    title: "Morning routine",
    emoji: "🌅",
    steps: [
      "Get out of bed",
      "Go to the toilet",
      "Have a shower or wash",
      "Get dressed",
      "Have breakfast",
      "Brush my teeth",
      "Check my bag has what I need for today",
    ],
  },
  {
    title: "How to catch the bus",
    emoji: "🚌",
    steps: [
      "Check what time the bus comes",
      "Make sure my travel card has money on it, or I have a ticket",
      "Walk to the bus stop and wait",
      "Check the bus number before getting on",
      "Tap on or show my ticket",
      "Sit down or hold on",
      "Press the button before my stop",
      "Tap off when I get off",
    ],
  },
  {
    title: "How to make a cup of tea",
    emoji: "🍵",
    steps: [
      "Fill the kettle with water",
      "Turn the kettle on",
      "Put a tea bag in a cup",
      "When the water boils, pour it carefully into the cup",
      "Wait 2 minutes, then take the tea bag out",
      "Add milk or sugar if I like",
    ],
  },
  {
    title: "How to cook pasta",
    emoji: "🍝",
    steps: [
      "Fill a big pot with water",
      "Put it on the stove and turn the heat on high",
      "When the water bubbles, add the pasta",
      "Set a timer for the time on the packet",
      "Stir sometimes so it doesn't stick",
      "Turn the stove off",
      "Carefully pour the pasta into a strainer in the sink",
      "Add sauce and serve",
    ],
  },
  {
    title: "How to make a doctor's appointment",
    emoji: "📞",
    steps: [
      "Find the phone number for my doctor",
      "Think about which days and times suit me",
      "Call and say my name and date of birth",
      "Say I would like to make an appointment",
      "Write down the day and time they give me",
      "Put it in my calendar or phone",
    ],
  },
  {
    title: "Taking out the bins",
    emoji: "🗑️",
    steps: [
      "Check which bin goes out this week",
      "Tie up the rubbish bag in the kitchen",
      "Put the bag in the outside bin",
      "Close the lid",
      "Wheel the bin to the kerb the night before",
      "Bring the bin back in after it is emptied",
    ],
  },
  {
    title: "Going to bed",
    emoji: "🌙",
    steps: [
      "Put my phone on charge",
      "Brush my teeth",
      "Put my pyjamas on",
      "Set my alarm for the morning",
      "Turn off the lights",
    ],
  },
];

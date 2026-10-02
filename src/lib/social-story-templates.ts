// Ready-made starter stories. They are written the way social stories
// usually are: first person ("I"), short simple sentences, one idea per
// page, saying what will happen, how people might feel, and what I can do.
// They are general examples only - people are expected to change the words
// and pictures to match the real place, people and routine.

export interface StoryTemplate {
  id: string;
  title: string;
  pages: { emoji: string; text: string }[];
}

export const STORY_TEMPLATES: StoryTemplate[] = [
  {
    id: "doctor",
    title: "Going to the doctor",
    pages: [
      { emoji: "🩺", text: "Today I am going to see the doctor." },
      { emoji: "🚗", text: "I will go to the doctor's clinic with someone I know." },
      { emoji: "🪑", text: "I will sit in the waiting room. Sometimes I have to wait a while. That is okay." },
      { emoji: "🎧", text: "While I wait, I can listen to music, look at my phone or hold something I like." },
      { emoji: "👋", text: "The doctor will call my name. I will go into the doctor's room." },
      { emoji: "🗣️", text: "The doctor will ask me some questions. I can answer, or someone with me can help." },
      { emoji: "🤚", text: "The doctor might look at me or touch my arm. I can say stop if I need a break." },
      { emoji: "✅", text: "When the doctor is finished, I can go home. I did a great job." },
    ],
  },
  {
    id: "haircut",
    title: "Getting a haircut",
    pages: [
      { emoji: "💇", text: "Today I am getting a haircut." },
      { emoji: "🪑", text: "I will sit in a big chair at the hairdresser." },
      { emoji: "🧥", text: "The hairdresser will put a cape around me to keep hair off my clothes." },
      { emoji: "✂️", text: "The hairdresser will use scissors or clippers. Clippers can buzz and feel tickly." },
      { emoji: "🔢", text: "I can count slowly or listen to music while they cut my hair." },
      { emoji: "✋", text: "If I need a break, I can put my hand up or say 'break please'." },
      { emoji: "😀", text: "When it is finished, my hair will be shorter and neat. I did well." },
    ],
  },
  {
    id: "new-worker",
    title: "Meeting a new support worker",
    pages: [
      { emoji: "👋", text: "Soon I will meet a new support worker." },
      { emoji: "🙂", text: "A new person can feel strange at first. That is okay." },
      { emoji: "🪪", text: "My support worker will tell me their name. I can tell them mine." },
      { emoji: "📋", text: "My support worker will learn about the things I like and the things I need." },
      { emoji: "🗣️", text: "I can tell them how I like things done. They will listen to me." },
      { emoji: "😊", text: "After a few visits, my new support worker will feel more familiar." },
    ],
  },
  {
    id: "waiting",
    title: "Waiting my turn",
    pages: [
      { emoji: "⏳", text: "Sometimes I have to wait my turn." },
      { emoji: "🚶", text: "Other people might be in front of me. They are having their turn." },
      { emoji: "😤", text: "Waiting can feel hard or boring. That is okay." },
      { emoji: "🌬️", text: "While I wait, I can take slow breaths or squeeze my hands." },
      { emoji: "🎵", text: "I can also listen to music or think about something I like." },
      { emoji: "👍", text: "Soon it will be my turn. Waiting my turn is a good thing to do." },
    ],
  },
  {
    id: "shops",
    title: "Going to the shops",
    pages: [
      { emoji: "🛒", text: "Today I am going to the shops." },
      { emoji: "📝", text: "I will take a list of the things I want to buy." },
      { emoji: "👥", text: "The shops might be busy and noisy. I can wear headphones if I like." },
      { emoji: "🥫", text: "I will find the things on my list and put them in the trolley or basket." },
      { emoji: "💳", text: "At the checkout, I will pay for my things." },
      { emoji: "🏠", text: "Then I will go home with my shopping. I did it." },
    ],
  },
  {
    id: "plans-change",
    title: "When plans change",
    pages: [
      { emoji: "📅", text: "Sometimes plans change." },
      { emoji: "☔", text: "Plans can change because of the weather, or because someone is sick or busy." },
      { emoji: "😟", text: "When plans change, I might feel upset or worried. That is okay." },
      { emoji: "🗣️", text: "I can ask someone to tell me what will happen instead." },
      { emoji: "🌬️", text: "I can take slow breaths and do something that helps me feel calm." },
      { emoji: "🙂", text: "Even when plans change, things will be okay." },
    ],
  },
];

export const WRITING_TIPS = [
  "Write as 'I', like the person is telling the story.",
  "Use short, simple sentences. One idea on each page.",
  "Say what will happen, in the order it happens.",
  "Say how people might feel, and that it is okay to feel that way.",
  "Say what I can do to help myself, like taking a break.",
  "Use 'might' or 'sometimes' for things that may not happen.",
  "Keep it positive. Finish with something good.",
];

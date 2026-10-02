export type CardCategoryId = "interests" | "feelings" | "weekend" | "favourites" | "getting-to-know-you";

export interface CardCategoryDef {
  id: CardCategoryId;
  name: string;
  icon: string;
}

export interface ConversationCard {
  id: string;
  text: string;
  categoryId: CardCategoryId;
  custom?: boolean;
}

export const CARD_CATEGORIES: CardCategoryDef[] = [
  { id: "interests", name: "Interests", icon: "🎨" },
  { id: "feelings", name: "Feelings", icon: "💭" },
  { id: "weekend", name: "Weekend", icon: "📅" },
  { id: "favourites", name: "Favourites", icon: "⭐" },
  { id: "getting-to-know-you", name: "Getting to know you", icon: "🙋" },
];

export const DEFAULT_CARDS: ConversationCard[] = [
  // Interests
  { id: "int-1", text: "What's something you've gotten really good at?", categoryId: "interests" },
  { id: "int-2", text: "Is there a hobby you'd like to try?", categoryId: "interests" },
  { id: "int-3", text: "What's a show or game you can't stop thinking about?", categoryId: "interests" },
  { id: "int-4", text: "What do you like to do when you have free time?", categoryId: "interests" },
  { id: "int-5", text: "Is there a topic you could talk about for hours?", categoryId: "interests" },
  { id: "int-6", text: "What's something you collect, or would like to collect?", categoryId: "interests" },

  // Feelings
  { id: "feel-1", text: "What's something that made you smile today?", categoryId: "feelings" },
  { id: "feel-2", text: "What helps you feel calm when things get too much?", categoryId: "feelings" },
  { id: "feel-3", text: "What's something you're looking forward to?", categoryId: "feelings" },
  { id: "feel-4", text: "Is there anything on your mind you'd like to share?", categoryId: "feelings" },
  { id: "feel-5", text: "What's a small thing that made today better?", categoryId: "feelings" },

  // Weekend
  { id: "wknd-1", text: "What did you get up to on the weekend?", categoryId: "weekend" },
  { id: "wknd-2", text: "Do you have any plans for next weekend?", categoryId: "weekend" },
  { id: "wknd-3", text: "What's your favourite way to spend a day off?", categoryId: "weekend" },
  { id: "wknd-4", text: "If you could plan the perfect weekend, what would it look like?", categoryId: "weekend" },

  // Favourites
  { id: "fav-1", text: "What's your favourite food at the moment?", categoryId: "favourites" },
  { id: "fav-2", text: "What's your favourite song or band right now?", categoryId: "favourites" },
  { id: "fav-3", text: "What's your favourite place to go?", categoryId: "favourites" },
  { id: "fav-4", text: "Who's your favourite person to spend time with?", categoryId: "favourites" },
  { id: "fav-5", text: "What's your favourite season, and why?", categoryId: "favourites" },

  // Getting to know you
  { id: "gtky-1", text: "What's your name, and is there a nickname you like?", categoryId: "getting-to-know-you" },
  { id: "gtky-2", text: "Do you have any pets, or would you like one?", categoryId: "getting-to-know-you" },
  { id: "gtky-3", text: "What's something people might not know about you?", categoryId: "getting-to-know-you" },
  { id: "gtky-4", text: "What's a place you'd love to visit one day?", categoryId: "getting-to-know-you" },
  { id: "gtky-5", text: "What's something you're proud of?", categoryId: "getting-to-know-you" },
];

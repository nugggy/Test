import type { Metadata } from "next";
import ConversationStarterCards from "@/components/conversation-starters/ConversationStarterCards";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import FavouriteToggleButton from "@/components/FavouriteToggleButton";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";
import BackToToolsLink from "@/components/BackToToolsLink";

export const metadata: Metadata = {
  title: "Conversation Starter Cards - Toolkit",
  description:
    "A deck of conversation-starter prompts, grouped by category, for anyone who finds small talk hard - especially useful in group or day programs.",
};

export default function ConversationStarterCardsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <BackToToolsLink />
      <h1 className="font-display mb-1 text-2xl sm:text-3xl font-bold">
        Conversation Starter Cards
      </h1>
      <FavouriteToggleButton slug="conversation-starter-cards" />
      <p className="no-print mb-6 max-w-2xl text-muted">
        A deck of conversation-starter prompts, grouped by category, for
        anyone who finds small talk hard - especially useful in group or day
        programs.
      </p>
      <HowToUse
        steps={[
          "Pick a category, or leave it on All to see every card.",
          "Tap \"Hear this\" to have the card read aloud, or tap Next to move on.",
          "Save the cards you like best with the star, and find them again under \"My favourites\".",
          "Add your own cards any time.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <ConversationStarterCards />
    </div>
  );
}

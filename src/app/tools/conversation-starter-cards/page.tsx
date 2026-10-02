import type { Metadata } from "next";
import ToolHero from "@/components/ToolHero";
import ConversationStarterCards from "@/components/conversation-starters/ConversationStarterCards";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";

export const metadata: Metadata = {
  title: "Conversation Starter Cards - My Support Buddy",
  description:
    "A deck of conversation-starter prompts, grouped by category, for anyone who finds small talk hard - especially useful in group or day programs.",
};

export default function ConversationStarterCardsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <ToolHero slug="conversation-starter-cards" title="Conversation Starter Cards">
        <p>
        A deck of conversation-starter prompts, grouped by category, for
        anyone who finds small talk hard - especially useful in group or day
        programs.
        </p>
      </ToolHero>
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

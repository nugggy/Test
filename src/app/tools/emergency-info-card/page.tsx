import type { Metadata } from "next";
import EmergencyInfoCard from "@/components/emergency-info-card/EmergencyInfoCard";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import FavouriteToggleButton from "@/components/FavouriteToggleButton";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";
import BackToToolsLink from "@/components/BackToToolsLink";

export const metadata: Metadata = {
  title: "Emergency / About Me Card - My Support Buddy",
  description:
    "A printable, phone-ready card with conditions, allergies, medications, communication needs and emergency contacts - to hand to first responders or new support staff.",
};

export default function EmergencyInfoCardPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <BackToToolsLink />
      <h1 className="font-display mb-1 text-2xl sm:text-3xl font-bold">
        Emergency / About Me Card
      </h1>
      <FavouriteToggleButton slug="emergency-info-card" />
      <p className="no-print mb-6 max-w-2xl text-muted">
        A printable, phone-ready card with conditions, allergies,
        medications, communication needs and emergency contacts - to hand to
        first responders or new support staff.
      </p>
      <HowToUse
        steps={[
          "Fill in the fields below - conditions, allergies, medications, communication needs and what helps in a crisis.",
          "Add emergency contacts and key contacts like a GP or support coordinator.",
          "Print the card to keep in a wallet or on the fridge, or tap \"Show on phone\" for a full-screen view to hand over on the spot.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <EmergencyInfoCard />
    </div>
  );
}

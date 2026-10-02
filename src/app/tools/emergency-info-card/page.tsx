import type { Metadata } from "next";
import ToolHero from "@/components/ToolHero";
import EmergencyInfoCard from "@/components/emergency-info-card/EmergencyInfoCard";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";
import PrintHeader from "@/components/PrintHeader";

export const metadata: Metadata = {
  title: "Emergency / About Me Card - My Support Buddy",
  description:
    "A printable, phone-ready card with conditions, allergies, medications, communication needs and emergency contacts - to hand to first responders or new support staff.",
};

export default function EmergencyInfoCardPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <PrintHeader title="Emergency / About Me Card" />
      <ToolHero slug="emergency-info-card" title="Emergency / About Me Card">
        <p>
        A printable, phone-ready card with conditions, allergies,
        medications, communication needs and emergency contacts - to hand to
        first responders or new support staff.
        </p>
      </ToolHero>
      <HowToUse
        steps={[
          "Fill in the fields below. Allergies show at the top of the card in a bold box so they are seen first.",
          "Add emergency contacts and key contacts like a GP or support coordinator. They appear on the card with a Call button.",
          "Print the card to keep in a wallet or on the fridge, or tap \"Show on phone\" for a large, full-screen view to hand to a paramedic or new support worker.",
          "The card shows the date it was last updated. Check it whenever medications or contacts change.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <EmergencyInfoCard />
    </div>
  );
}

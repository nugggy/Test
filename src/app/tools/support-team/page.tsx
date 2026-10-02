import type { Metadata } from "next";
import SupportTeamDirectory from "@/components/support-team/SupportTeamDirectory";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import HowToUse from "@/components/HowToUse";
import PrintHeader from "@/components/PrintHeader";
import FavouriteToggleButton from "@/components/FavouriteToggleButton";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import BackToToolsLink from "@/components/BackToToolsLink";

export const metadata: Metadata = {
  title: "My Support Team Directory - Toolkit",
  description:
    "Keep every support contact in one place: Plan Manager, Support Coordinator, therapists, medical specialists and emergency contacts. Printable.",
};

export default function SupportTeamPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <BackToToolsLink />
      <PrintHeader title="My Support Team Directory" />
      <h1 className="font-display mb-1 text-2xl sm:text-3xl font-bold">
        My Support Team Directory
      </h1>
      <FavouriteToggleButton slug="support-team" />
      <p className="no-print mb-6 max-w-2xl text-muted">
        Every support contact in one place - Plan Manager, Support
        Coordinator, therapists, medical specialists and emergency contacts -
        so you&apos;re never searching for a number when you need it.
      </p>
      <HowToUse
        steps={[
          "Tap '+ Add' under the right category for each contact.",
          "Fill in a name, organisation, phone, email and any notes.",
          "Add as many contacts as you need in each category.",
          "Print the whole directory to keep a copy, or share it with a new support worker.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <SupportTeamDirectory />
    </div>
  );
}

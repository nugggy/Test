import type { Metadata } from "next";
import ToolHero from "@/components/ToolHero";
import SupportTeamDirectory from "@/components/support-team/SupportTeamDirectory";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import HowToUse from "@/components/HowToUse";
import PrintHeader from "@/components/PrintHeader";
import AddToHomeScreen from "@/components/AddToHomeScreen";

export const metadata: Metadata = {
  title: "My Support Team Directory - My Support Buddy",
  description:
    "Keep every support contact in one place: Plan Manager, Support Coordinator, therapists, medical specialists and emergency contacts. Printable.",
};

export default function SupportTeamPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <PrintHeader title="My Support Team Directory" />
      <ToolHero slug="support-team" title="My Support Team Directory">
        <p>
        Every support contact in one place - Plan Manager, Support
        Coordinator, therapists, medical specialists and emergency contacts -
        so you&apos;re never searching for a number when you need it.
        </p>
      </ToolHero>
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

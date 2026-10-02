import type { Metadata } from "next";
import ToolHero from "@/components/ToolHero";
import ChangePreparation from "@/components/change-preparation/ChangePreparation";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";

export const metadata: Metadata = {
  title: "Change Preparation Toolkit - My Support Buddy",
  description:
    "Prepare for an upcoming change - moving house, a new school, a new support worker - with what's changing, what's staying the same, a countdown, and things that might help.",
};

export default function ChangePreparationPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <ToolHero slug="change-preparation" title="Change Preparation Toolkit">
        <p>
        Prepare for an upcoming change - moving house, a new school, a new
        support worker - with what&apos;s changing, what&apos;s staying the
        same, a countdown, and things that might help.
        </p>
      </ToolHero>
      <HowToUse
        steps={[
          "Add a plan for the upcoming change, e.g. \"Moving house\" or \"Starting a new school\".",
          "Add the date if you know it, to see a countdown.",
          "List what's changing and what's staying the same, side by side.",
          "Add things that might help - comfort items, a visual schedule, people to call - and any notes.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <ChangePreparation />
    </div>
  );
}

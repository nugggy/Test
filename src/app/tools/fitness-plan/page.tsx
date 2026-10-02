import type { Metadata } from "next";
import ToolHero from "@/components/ToolHero";
import FitnessPlan from "@/components/fitness-plan/FitnessPlan";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";
import PrintHeader from "@/components/PrintHeader";

export const metadata: Metadata = {
  title: "Exercise & Fitness Plan - My Support Buddy",
  description:
    "Set fitness goals with steps to break them down, log each exercise session, and see your progress on a chart over time.",
};

export default function FitnessPlanPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <PrintHeader title="Exercise & Fitness Plan" />
      <ToolHero slug="fitness-plan" title={<>Exercise &amp; Fitness Plan</>}>
        <p>
        Set fitness goals and break them into steps, then log each session
        to see your progress build up on a chart over time.
        </p>
      </ToolHero>
      <HowToUse
        steps={[
          "Add a fitness goal and break it into steps.",
          "Tick off steps as you complete them.",
          "Log each exercise session - activity, duration, and how it went.",
          "Watch your progress build up on the chart.",
          "Talk to your doctor or an exercise physiologist before starting a new exercise program, especially if you have an existing health condition.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <FitnessPlan />
    </div>
  );
}

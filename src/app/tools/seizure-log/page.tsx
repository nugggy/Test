import type { Metadata } from "next";
import ToolHero from "@/components/ToolHero";
import SeizureLog from "@/components/seizure-log/SeizureLog";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import HowToUse from "@/components/HowToUse";
import PrintHeader from "@/components/PrintHeader";
import AddToHomeScreen from "@/components/AddToHomeScreen";

export const metadata: Metadata = {
  title: "Seizure Observation Log - My Support Buddy",
  description:
    "Record seizure type, duration, severity, triggers, warning signs and recovery, see the patterns on a visual dashboard, and export a CSV or PDF to share with a neurologist.",
};

export default function SeizureLogPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
      <PrintHeader title="Seizure Observation Log" />
      <ToolHero slug="seizure-log" title="Seizure Observation Log">
        <p>
        Record what happened during and after a seizure - type, duration,
        possible triggers, and what was done - to spot patterns over time and
        share accurate detail with a neurologist or GP.
        </p>
      </ToolHero>
      <HowToUse
        steps={[
          "When a seizure starts, tap the big Start timer button. Tap Stop when it ends. The time and duration fill in for you.",
          "While timing, you can note when rescue medication was given or 000 was called. Follow the person's own seizure management plan, and call 000 in an emergency.",
          "Then add the details while they are fresh.",
          "Tap a suggestion chip for seizure type, trigger and location, or type your own.",
          "Record severity, awareness, warning signs and how long recovery took.",
          "Tick off any actions taken, like first aid or rescue medication given.",
          "Open the Dashboard tab and choose a period, such as the last 3 months, to see trends and the full log for that time.",
          "Print or save a PDF of the dashboard for a neurologist or GP appointment, or download the log as a CSV.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <SeizureLog />
    </div>
  );
}

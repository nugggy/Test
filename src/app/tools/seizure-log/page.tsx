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
          "Log an entry as soon as possible after a seizure, while details are fresh.",
          "Tap a suggestion chip for seizure type, trigger and location, or type your own.",
          "Record severity, awareness, warning signs and how long recovery took.",
          "Tick off any actions taken, like first aid or rescue medication given.",
          "Open the Dashboard tab to see trends, patterns and totals build up over time.",
          "Download the log as a CSV, or print/save a PDF, to take to a specialist appointment.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <SeizureLog />
    </div>
  );
}

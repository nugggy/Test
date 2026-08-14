import type { Metadata } from "next";
import Link from "next/link";
import SeizureLog from "@/components/seizure-log/SeizureLog";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import AlliedHealthCallout from "@/components/AlliedHealthCallout";
import HowToUse from "@/components/HowToUse";
import PrintHeader from "@/components/PrintHeader";
import FavouriteToggleButton from "@/components/FavouriteToggleButton";
import AddToHomeScreen from "@/components/AddToHomeScreen";

export const metadata: Metadata = {
  title: "Seizure Observation Log - Toolkit",
  description:
    "Record seizure type, duration, severity, triggers, warning signs and recovery, see the patterns on a visual dashboard, and export a CSV or PDF to share with a neurologist.",
};

export default function SeizureLogPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
      <nav className="no-print mb-4">
        <Link
          href="/"
          className="touch-target inline-flex items-center gap-1.5 rounded-xl border-2 border-border bg-surface px-4 text-base font-semibold text-brand hover:border-brand"
        >
          ← All tools
        </Link>
      </nav>
      <PrintHeader title="Seizure Observation Log" />
      <h1 className="font-display mb-1 text-2xl sm:text-3xl font-bold">
        Seizure Observation Log
      </h1>
      <FavouriteToggleButton slug="seizure-log" />
      <p className="no-print mb-6 max-w-2xl text-muted">
        Record what happened during and after a seizure - type, duration,
        possible triggers, and what was done - to spot patterns over time and
        share accurate detail with a neurologist or GP.
      </p>
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
      <AlliedHealthCallout />
      <AddToHomeScreen />
      <SeizureLog />
    </div>
  );
}

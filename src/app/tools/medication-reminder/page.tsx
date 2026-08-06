import type { Metadata } from "next";
import Link from "next/link";
import MedicationReminder from "@/components/medication/MedicationReminder";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import AlliedHealthCallout from "@/components/AlliedHealthCallout";
import HowToUse from "@/components/HowToUse";
import PrintHeader from "@/components/PrintHeader";
import FavouriteToggleButton from "@/components/FavouriteToggleButton";
import AddToHomeScreen from "@/components/AddToHomeScreen";

export const metadata: Metadata = {
  title: "Medication Reminder — Toolkit",
  description:
    "Keep a list of medications and doses, tick off today's checklist, and export a log to share with your doctor or support worker.",
};

export default function MedicationReminderPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <nav className="no-print mb-4">
        <Link
          href="/"
          className="touch-target inline-flex items-center gap-1.5 rounded-xl border-2 border-border bg-surface px-4 text-base font-semibold text-brand hover:border-brand"
        >
          ← All tools
        </Link>
      </nav>
      <PrintHeader title="Medication Reminder" />
      <h1 className="font-display mb-1 text-2xl sm:text-3xl font-bold">
        Medication Reminder
      </h1>
      <FavouriteToggleButton slug="medication-reminder" />
      <p className="no-print mb-6 max-w-2xl text-muted">
        Keep a list of medications and doses, tick off today&apos;s checklist
        as you take them, and export a log to share with your doctor or
        support worker.
      </p>
      <HowToUse
        steps={[
          "Add each medication, its dose, and the times you take it each day.",
          "Tick off each dose in Today's checklist as you take it.",
          "Print your schedule, or download a CSV log of everything you've taken.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AlliedHealthCallout />
      <AddToHomeScreen />
      <MedicationReminder />
    </div>
  );
}

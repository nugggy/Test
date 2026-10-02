import type { Metadata } from "next";
import MedicationReminder from "@/components/medication/MedicationReminder";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import HowToUse from "@/components/HowToUse";
import PrintHeader from "@/components/PrintHeader";
import FavouriteToggleButton from "@/components/FavouriteToggleButton";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import BackToToolsLink from "@/components/BackToToolsLink";

export const metadata: Metadata = {
  title: "Medication Reminder - My Support Buddy",
  description:
    "Keep a list of medications and doses, tick off today's checklist, see an adherence dashboard, and export a CSV or PDF to share with your doctor or pharmacist.",
};

export default function MedicationReminderPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <BackToToolsLink />
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
          "Open the Dashboard tab to see adherence over the last 14 days, overall and per medication.",
          "Print your schedule, or download a CSV/PDF log to take to a doctor or pharmacist review.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <MedicationReminder />
    </div>
  );
}

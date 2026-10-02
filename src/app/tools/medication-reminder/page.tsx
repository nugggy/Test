import type { Metadata } from "next";
import ToolHero from "@/components/ToolHero";
import MedicationReminder from "@/components/medication/MedicationReminder";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import HowToUse from "@/components/HowToUse";
import PrintHeader from "@/components/PrintHeader";
import AddToHomeScreen from "@/components/AddToHomeScreen";

export const metadata: Metadata = {
  title: "Medication Reminder - My Support Buddy",
  description:
    "Keep a list of medications and doses, tick off today's checklist, see an adherence dashboard, and export a CSV or PDF to share with your doctor or pharmacist.",
};

export default function MedicationReminderPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <PrintHeader title="Medication Reminder" />
      <ToolHero slug="medication-reminder" title="Medication Reminder">
        <p>
        Keep a list of medications and doses, tick off today&apos;s checklist
        as you take them, and export a log to share with your doctor or
        support worker.
        </p>
      </ToolHero>
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

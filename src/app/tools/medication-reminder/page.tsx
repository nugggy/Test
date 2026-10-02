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
        Keep a list of medications and doses, record each dose as taken or
        not taken with one tap, and print or export the record to share with
        a doctor, pharmacist or support worker.
        </p>
      </ToolHero>
      <HowToUse
        steps={[
          "Add each medication with its dose and times, exactly as written on the label or by your doctor or pharmacist. Tick \"as needed\" for medication with no set times.",
          "In the checklist, tap Taken or Not taken for each dose. Doses whose time has passed with nothing recorded are marked Due.",
          "If a dose was not taken, pick a reason so the record is clear for the next person.",
          "On a shared device, type your name or initials in Recorded by. You can also pick an earlier date to fill in a missed record.",
          "Open the Dashboard tab to see the last 14 days, then print it or download a CSV for a doctor or pharmacist review.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <MedicationReminder />
    </div>
  );
}

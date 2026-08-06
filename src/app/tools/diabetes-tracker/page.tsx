import type { Metadata } from "next";
import Link from "next/link";
import DiabetesTracker from "@/components/diabetes-tracker/DiabetesTracker";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import AlliedHealthCallout from "@/components/AlliedHealthCallout";
import FavouriteToggleButton from "@/components/FavouriteToggleButton";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";
import PrintHeader from "@/components/PrintHeader";

export const metadata: Metadata = {
  title: "Diabetes BGL & Insulin Tracker — Toolkit",
  description:
    "Log blood glucose readings and insulin doses, see the trend over time on a chart, and export or print a log to share with your diabetes care team.",
};

export default function DiabetesTrackerPage() {
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
      <PrintHeader title="Diabetes BGL & Insulin Tracker" />
      <h1 className="font-display mb-1 text-2xl sm:text-3xl font-bold">
        Diabetes BGL &amp; Insulin Tracker
      </h1>
      <FavouriteToggleButton slug="diabetes-tracker" />
      <p className="no-print mb-3 max-w-2xl text-muted">
        Log blood glucose readings and insulin doses, see the trend over
        time, and export or print a log to share with a doctor, diabetes
        educator or support worker.
      </p>
      <p className="no-print mb-6 max-w-2xl rounded-xl border-2 border-accent bg-accent/10 px-4 py-3 text-sm">
        <strong>This is a log, not medical advice.</strong> It doesn&apos;t
        set targets, calculate doses, or replace your own diabetes
        management plan. Always follow the targets and insulin instructions
        from your own doctor or diabetes educator. If you or someone you
        support is showing signs of severe hypoglycaemia (very low blood
        sugar) or hyperglycaemia (very high blood sugar) — confusion,
        seizure, loss of consciousness, vomiting, difficulty breathing —
        call <strong>000</strong> immediately.
      </p>
      <HowToUse
        steps={[
          "Log each blood glucose reading, in mmol/L, as you take it.",
          "Add the insulin type and dose if one was given.",
          "Add any notes — how you're feeling, food, activity, anything unusual.",
          "Check the chart to spot patterns over time.",
          "Export a CSV or print the log to share with your care team.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AlliedHealthCallout />
      <AddToHomeScreen />
      <DiabetesTracker />
    </div>
  );
}

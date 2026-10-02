import type { Metadata } from "next";
import ToolHero from "@/components/ToolHero";
import DiabetesTracker from "@/components/diabetes-tracker/DiabetesTracker";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";
import PrintHeader from "@/components/PrintHeader";

export const metadata: Metadata = {
  title: "Diabetes BGL & Insulin Tracker - My Support Buddy",
  description:
    "Log blood glucose readings and insulin doses, see the trend over time on a chart, build a visual management plan from your doctor's recommendations, and export or print to share with your diabetes care team.",
};

export default function DiabetesTrackerPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <PrintHeader title="Diabetes BGL & Insulin Tracker" />
      <ToolHero slug="diabetes-tracker" title={<>Diabetes BGL &amp; Insulin Tracker</>}>
        <p>
        Log blood glucose readings and insulin doses, see the trend over
        time, build a visual management plan from your doctor&apos;s
        recommendations, and export or print to share with a doctor,
        diabetes educator or support worker.
        </p>
      </ToolHero>
      <p className="no-print mb-6 max-w-2xl rounded-xl border-2 border-accent bg-accent/10 px-4 py-3 text-sm">
        <strong>This tool doesn&apos;t set targets, calculate doses, or
        create a management plan of its own.</strong> The Management Plan
        tab only displays what you enter from your own doctor or diabetes
        educator&apos;s written plan, clearly - it never suggests numbers
        or steps itself. If you or someone you support is showing signs of
        severe hypoglycaemia (very low blood sugar) or hyperglycaemia
        (very high blood sugar) - confusion, seizure, loss of
        consciousness, vomiting, difficulty breathing - call{" "}
        <strong>000</strong> immediately.
      </p>
      <HowToUse
        steps={[
          "Log & Trend tab: log each blood glucose reading and any insulin dose, and check the chart to spot patterns.",
          "Management Plan tab: enter your doctor's target range, low/high action steps, correction scale, sick day rules and care team details.",
          "Once your own target range is entered, the chart and log show each reading as below, within or above that range. Without it, readings are not coloured.",
          "The plan builds into a clear, colour-coded visual summary you can print for the fridge, school or a support worker.",
          "Export a CSV or print the log to share with your care team.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <DiabetesTracker />
    </div>
  );
}

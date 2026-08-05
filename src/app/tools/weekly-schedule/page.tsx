import type { Metadata } from "next";
import Link from "next/link";
import WeeklySchedule from "@/components/weekly-schedule/WeeklySchedule";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import AlliedHealthCallout from "@/components/AlliedHealthCallout";

export const metadata: Metadata = {
  title: "Weekly Schedule — Toolkit",
  description:
    "Plan the whole week at a glance with picture activities for each day. Free and printable.",
};

export default function WeeklySchedulePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
      <nav className="no-print mb-4 text-sm">
        <Link href="/" className="font-semibold text-brand hover:underline">
          ← All tools
        </Link>
      </nav>
      <h1 className="font-display mb-1 text-2xl sm:text-3xl font-bold">
        Weekly Schedule
      </h1>
      <p className="no-print mb-6 max-w-2xl text-muted">
        Plan the whole week at a glance. Add pictures to each day, tick them
        off as they&apos;re done, or print the week out.
      </p>
      <MedicalDisclaimerBanner />
      <AlliedHealthCallout />
      <WeeklySchedule />
    </div>
  );
}

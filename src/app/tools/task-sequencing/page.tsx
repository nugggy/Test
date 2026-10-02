import type { Metadata } from "next";
import TaskSequencing from "@/components/task-sequencing/TaskSequencing";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import FavouriteToggleButton from "@/components/FavouriteToggleButton";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";
import BackToToolsLink from "@/components/BackToToolsLink";

export const metadata: Metadata = {
  title: "Task Sequencing Tool - My Support Buddy",
  description:
    "Break a task down into ordered picture steps, then run through it one step at a time and tick each one off as it's done.",
};

export default function TaskSequencingPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <BackToToolsLink />
      <h1 className="font-display mb-1 text-2xl sm:text-3xl font-bold">
        Task Sequencing Tool
      </h1>
      <FavouriteToggleButton slug="task-sequencing" />
      <p className="no-print mb-6 max-w-2xl text-muted">
        Break a task down into ordered picture steps, then run through it one
        step at a time and tick each one off as it&apos;s done.
      </p>
      <HowToUse
        steps={[
          "Create a sequence for a task, e.g. \"Brushing teeth\" or \"Making toast\".",
          "Add each step with a picture and a short label, in order.",
          "Tap \"Run this task\" to step through it one at a time, with a tick for each step.",
          "Reuse the same sequence again and again - \"Start again\" resets every step.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <TaskSequencing />
    </div>
  );
}

import type { Metadata } from "next";
import ToolHero from "@/components/ToolHero";
import TaskSequencing from "@/components/task-sequencing/TaskSequencing";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";

export const metadata: Metadata = {
  title: "Task Sequencing Tool - My Support Buddy",
  description:
    "Break a task down into ordered picture steps, then run through it one step at a time and tick each one off as it's done.",
};

export default function TaskSequencingPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <ToolHero slug="task-sequencing" title="Task Sequencing Tool">
        <p>
        Break a task down into ordered picture steps, then run through it one
        step at a time and tick each one off as it&apos;s done.
        </p>
      </ToolHero>
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

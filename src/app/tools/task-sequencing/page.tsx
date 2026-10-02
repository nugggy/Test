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
          "Start from an example like \"Washing hands\", or make your own sequence for any task.",
          "In \"Edit steps\", add each step with a picture and a short label. You can change the words, pictures and order at any time.",
          "Tap \"Do this task\" to see one step at a time. Tap Done after each step. \"Go back a step\" undoes a mistake.",
          "Turn on \"Read each step aloud\" to hear each step as you go.",
          "Tap \"Print steps\" for a numbered picture strip to stick up where the task happens. \"Start again\" resets every step.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <TaskSequencing />
    </div>
  );
}

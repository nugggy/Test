import type { Metadata } from "next";
import ToolHero from "@/components/ToolHero";
import { Suspense } from "react";
import FindAProvider from "@/components/provider-directory/FindAProvider";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import HowToUse from "@/components/HowToUse";
import AddToHomeScreen from "@/components/AddToHomeScreen";

export const metadata: Metadata = {
  title: "Find a Provider - My Support Buddy",
  description:
    "Search for a Support Coordinator, Plan Manager, Support Provider, or Allied Health Specialist by state and service area, or list your own service.",
};

export default function FindAProviderPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <ToolHero slug="find-a-provider" title="Find a Provider">
        <p>
        Search for a Support Coordinator, Plan Manager, Support Provider,
        or Allied Health Specialist by state and service area, or list
        your own service.
        </p>
      </ToolHero>
      <HowToUse
        steps={[
          "Choose the type of provider you're looking for.",
          "Search by state and suburb/region (and specialty, for Allied Health) to see approved listings.",
          "Tap a phone number, email or website to get in touch directly.",
          "Run a provider yourself? Switch to your category and scroll down to list your service - it'll appear here once reviewed.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <Suspense fallback={<p className="text-muted">Loading…</p>}>
        <FindAProvider />
      </Suspense>
    </div>
  );
}

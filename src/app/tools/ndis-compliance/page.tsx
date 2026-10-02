import type { Metadata } from "next";
import ToolHero from "@/components/ToolHero";
import NdisCompliance from "@/components/ndis-compliance/NdisCompliance";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";
import PrintHeader from "@/components/PrintHeader";

export const metadata: Metadata = {
  title: "NDIS Compliance & Provider Obligations - My Support Buddy",
  description:
    "A plain-language guide to what registered NDIS providers are required to do - the Code of Conduct, service agreements, cancellations, worker screening, incident management, restrictive practices and complaints - with a self-check and how to raise a concern.",
};

export default function NdisCompliancePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <PrintHeader title="NDIS Compliance & Provider Obligations" />
      <ToolHero slug="ndis-compliance" title={<>NDIS Compliance & Provider Obligations</>}>
        <p>
        Understand what your NDIS provider is actually required to do -
        the Code of Conduct, service agreements, cancellations, worker
        screening, incidents and restrictive practices, and complaints -
        with a self-check and clear next steps if something doesn&apos;t
        look right.
        </p>
      </ToolHero>
      <HowToUse
        steps={[
          "Read through each section to learn what providers are required to do.",
          "Use the checklist to check your own provider against common obligations.",
          "Save questions you want to ask your provider directly.",
          "Keep a private, dated note of anything that concerns you.",
          "If something's not right, follow the steps to raise it or contact the NDIS Commission.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <NdisCompliance />
    </div>
  );
}

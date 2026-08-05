import Link from "next/link";

export default function MedicalDisclaimerBanner() {
  return (
    <p className="no-print mb-6 rounded-xl border-2 border-border bg-surface px-4 py-3 text-sm text-muted">
      This tool is designed to help with everyday communication and support
      — it isn&apos;t medical or clinical advice and doesn&apos;t replace
      guidance from a qualified professional.{" "}
      <Link href="/disclaimer" className="font-semibold text-brand hover:underline">
        Read the full disclaimer
      </Link>
      .
    </p>
  );
}

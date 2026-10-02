import Link from "next/link";

export default function MedicalDisclaimerBanner() {
  return (
    <p className="no-print mb-6 flex items-start gap-3 rounded-xl bg-surface-2 px-4 py-3 text-sm text-muted">
      <span aria-hidden="true" className="font-display grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 border-border-strong text-xs font-semibold text-foreground">i</span>
      <span>
      This tool is designed to help with everyday communication and support
      - it isn&apos;t medical or clinical advice and doesn&apos;t replace
      guidance from a qualified professional.{" "}
      <Link href="/disclaimer" className="font-semibold text-brand hover:underline">
        Read the full disclaimer
      </Link>
      .
      </span>
    </p>
  );
}

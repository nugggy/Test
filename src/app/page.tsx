import Link from "next/link";
import { tools } from "@/lib/tools";
import ToolDirectory from "@/components/ToolDirectory";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <section className="mb-12 sm:mb-16">
        <p className="font-display font-semibold text-brand mb-3">
          Free. Forever. No sign-up.
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-bold leading-tight max-w-3xl">
          Practical tools for disability support, built to actually get used.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          Made for participants, families, support workers, educators and
          allied health professionals. Every tool is touch-friendly, works on
          a phone, tablet or iPad, and opens straight into your hands —
          nothing to install, nothing to pay for.
        </p>
        <p className="mt-3 max-w-2xl text-sm text-muted">
          These tools support everyday communication and organisation — they
          aren&apos;t medical advice. See our{" "}
          <Link href="/disclaimer" className="font-semibold text-brand hover:underline">
            full disclaimer
          </Link>
          .
        </p>
      </section>

      <ToolDirectory tools={tools} />
    </div>
  );
}

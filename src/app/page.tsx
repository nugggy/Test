import Link from "next/link";
import { tools } from "@/lib/tools";
import ToolDirectory from "@/components/ToolDirectory";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <section className="mb-12 sm:mb-16">
        <p className="font-display font-semibold text-brand mb-3">
          Free. Forever.
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-bold leading-tight max-w-3xl">
          Everyday tools that help you live more independently, your way.
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

      <section className="mb-12 sm:mb-16">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/dundaloo-hero.jpg"
          alt="A diverse group of people smiling together, including wheelchair users, a person using a guide cane, a person using a walking frame, and a support dog, under the Dundaloo Support Services banner: We Listen, We Support, We Empower, We Include, We Belong."
          className="w-full rounded-2xl border-2 border-border"
        />
      </section>

      <ToolDirectory tools={tools} />
    </div>
  );
}

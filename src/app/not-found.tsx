import Link from "next/link";
import type { Metadata } from "next";
import Buddy from "@/components/Buddy";
import Sprinkles, { SPRINKLE_SETS } from "@/components/Sprinkles";

export const metadata: Metadata = {
  title: "Page not found - My Support Buddy",
};

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-16">
      <div className="bg-dots relative overflow-hidden rounded-3xl border-2 border-border bg-surface p-8 text-center sm:p-12">
        <Sprinkles items={SPRINKLE_SETS.hero} />
        <div className="relative">
          <Buddy mood="think" className="mx-auto h-40 w-40" />
          <h1 className="font-display mt-4 text-3xl sm:text-4xl">We can&apos;t find that page</h1>
          <p className="mx-auto mt-3 max-w-md text-lg text-muted">
            It may have moved, or the link might have a typo. All the tools
            are still here.
          </p>
          <Link
            href="/"
            className="touch-target mt-8 inline-flex items-center gap-2 rounded-2xl bg-brand px-6 text-lg font-semibold text-brand-ink"
          >
            <span aria-hidden="true">←</span> Go to all tools
          </Link>
        </div>
      </div>
    </div>
  );
}

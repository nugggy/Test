import Link from "next/link";
import { tools } from "@/lib/tools";
import ToolDirectory from "@/components/ToolDirectory";
import MostFavourited from "@/components/MostFavourited";
import AndroidAppDownload from "@/components/AndroidAppDownload";
import { getTopFavouritedTools } from "@/app/actions/favourites";
import { incrementAndGetVisitCount } from "@/app/actions/visit-counter";

export default async function HomePage() {
  const [topFavourited, visitCount] = await Promise.all([
    getTopFavouritedTools(6),
    incrementAndGetVisitCount(),
  ]);
  const mostFavouritedTools = topFavourited
    .map((f) => tools.find((t) => t.slug === f.toolSlug && t.status === "live"))
    .filter((t): t is (typeof tools)[number] => Boolean(t));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14">
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
          a phone, tablet or iPad, and opens straight into your hands -
          nothing to install, nothing to pay for.
        </p>
        <p className="mt-3 max-w-2xl text-sm text-muted">
          We know tools like these could be turned into a paid product - but
          we don&apos;t think anyone should be locked out of support they
          need because of cost. Everyone deserves the right to access help,
          so this toolkit stays free, for everyone, for good.
        </p>
        <p className="mt-3 max-w-2xl text-sm text-muted">
          These tools support everyday communication and organisation - they
          aren&apos;t medical advice. See our{" "}
          <Link href="/disclaimer" className="font-semibold text-brand hover:underline">
            full disclaimer
          </Link>
          .
        </p>
        {visitCount !== null && (
          <p className="mt-4 inline-flex items-center gap-2 rounded-full border-2 border-border bg-surface px-4 py-2 text-sm font-semibold">
            <span aria-hidden="true">💜</span>
            Opened {visitCount.toLocaleString()} times by people who needed
            it - and counting
          </p>
        )}
      </section>

      <AndroidAppDownload />

      <MostFavourited tools={mostFavouritedTools} />

      <ToolDirectory tools={tools} />
    </div>
  );
}

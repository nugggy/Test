import Link from "next/link";
import { headers } from "next/headers";
import { tools } from "@/lib/tools";
import { parseInstalledVersion } from "@/lib/app-update";
import ToolDirectory from "@/components/ToolDirectory";
import MostFavourited from "@/components/MostFavourited";
import AndroidAppDownload from "@/components/AndroidAppDownload";
import TalkTile from "@/components/home/TalkTile";
import ClockTile from "@/components/home/ClockTile";
import CategoryTile from "@/components/home/CategoryTile";
import { getTopFavouritedTools } from "@/app/actions/favourites";
import { incrementAndGetVisitCount } from "@/app/actions/visit-counter";

export default async function HomePage() {
  const [topFavourited, visitCount, requestHeaders] = await Promise.all([
    getTopFavouritedTools(6),
    incrementAndGetVisitCount(),
    headers(),
  ]);
  const inApp = parseInstalledVersion(requestHeaders.get("user-agent")) !== null;
  const mostFavouritedTools = topFavourited
    .map((f) => tools.find((t) => t.slug === f.toolSlug && t.status === "live"))
    .filter((t): t is (typeof tools)[number] => Boolean(t));
  const liveCount = tools.filter((t) => t.status === "live").length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-10">
      {/* ---- Bento hero ---- */}
      <section aria-labelledby="hero-heading" className="mb-12 grid gap-3 sm:mb-16 sm:gap-4 lg:grid-cols-4">
        {/* Headline tile */}
        <div className="bg-dots relative overflow-hidden rounded-3xl border-2 border-border bg-surface p-6 sm:p-8 lg:col-span-2 lg:row-span-2">
          <div className="relative flex h-full flex-col">
            <p className="inline-flex items-center gap-2 self-start rounded-full border-2 border-border bg-surface px-3 py-1 text-sm font-semibold">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[var(--solid-living)]" />
              Free forever · No sign-up · Private to your device
            </p>
            <h1
              id="hero-heading"
              className="font-display mt-6 text-4xl leading-[1.05] sm:text-5xl xl:text-6xl"
            >
              Everyday tools that help you live life{" "}
              <span className="relative whitespace-nowrap text-brand">
                your way
                <svg
                  aria-hidden="true"
                  viewBox="0 0 200 12"
                  preserveAspectRatio="none"
                  className="absolute -bottom-2 left-0 h-3 w-full"
                >
                  <path
                    d="M2 9 C 50 2, 150 2, 198 8"
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              .
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted">
              Picture boards, visual schedules, timers, trackers and planners
              for people with disability, families, support workers and
              allied health. Touch-friendly, works offline, and nothing to
              pay for.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#tools-heading"
                className="touch-target inline-flex items-center gap-2 rounded-2xl bg-brand px-6 text-lg font-semibold text-brand-ink"
              >
                Browse {liveCount} tools <span aria-hidden="true">↓</span>
              </a>
              {!inApp && (
                <a
                  href="#android-app-heading"
                  className="touch-target inline-flex items-center gap-2 rounded-2xl border-2 border-border-strong bg-surface px-6 text-lg font-semibold hover:border-foreground"
                >
                  <span aria-hidden="true">📱</span> Get the app
                </a>
              )}
            </div>
            {visitCount !== null && (
              <p className="mt-auto pt-8 text-sm text-muted">
                <span className="font-display tabular font-semibold text-foreground">
                  {visitCount.toLocaleString()}
                </span>{" "}
                visits from people who needed it, and counting.
              </p>
            )}
          </div>
        </div>

        {/* Live demo tile */}
        <div className="lg:col-span-2">
          <TalkTile />
        </div>

        {/* Clock tile */}
        <div className="min-h-52">
          <ClockTile />
        </div>

        {/* Privacy tile */}
        <Link
          href="/privacy"
          className="group flex min-h-52 flex-col justify-between rounded-3xl bg-ink-block p-5 text-ink-block-fg sm:p-6"
        >
          <span aria-hidden="true" className="text-3xl">🔒</span>
          <span>
            <span className="font-display block text-2xl font-semibold leading-tight">
              Private by design
            </span>
            <span className="mt-2 block text-ink-block-muted">
              No accounts. What you enter stays on your device and is never
              sent to us.
            </span>
          </span>
          <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-ink-block-accent group-hover:underline">
            How we handle privacy <span aria-hidden="true">→</span>
          </span>
        </Link>

        {/* Categories tile */}
        <div className="lg:col-span-4">
          <CategoryTile tools={tools} />
        </div>
      </section>

      <MostFavourited tools={mostFavouritedTools} />

      <ToolDirectory tools={tools} />

      <div className="mt-16">
        <AndroidAppDownload />
      </div>

      <section className="mx-auto max-w-3xl space-y-3 text-center text-sm text-muted">
        <p>
          We know tools like these could be turned into a paid product. We
          don&apos;t think anyone should be locked out of support they need
          because of cost, so My Support Buddy stays free, for everyone, for
          good.
        </p>
        <p>
          These tools support everyday communication and organisation. They
          aren&apos;t medical advice. See the{" "}
          <Link href="/disclaimer" className="font-semibold text-brand hover:underline">
            full disclaimer
          </Link>
          .
        </p>
      </section>
    </div>
  );
}

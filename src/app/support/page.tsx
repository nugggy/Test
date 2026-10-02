import Link from "next/link";

export const metadata = {
  title: "Support us - My Support Buddy",
  description: "Help keep these disability support tools free, ad-free, and available to everyone.",
};

// TODO(payment-setup): replace with a real donation destination once one
// exists - e.g. a Stripe Payment Link, PayPal.me, GoFundMe or Ko-fi page -
// and swap the disabled placeholder button below for a real <a href> link.
const DONATION_URL: string | null = null;

export default function SupportPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
      <h1 className="font-display text-3xl font-bold mb-2">Support us</h1>
      <p className="text-muted mb-8">
        Every tool on this site is free, forever, with no ads and no data
        sold. Donations help cover hosting and let us keep building new
        tools.
      </p>

      <div className="space-y-6 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-2 [&_p]:mb-3">
        <section>
          <h2>Why donations matter</h2>
          <p>
            NDIS providers, schools, families and support workers use these
            tools every day at no cost. Keeping it that way - no
            subscriptions, no paywalls, no accounts required unless a tool
            genuinely needs one - relies on people who can afford to chip in
            covering the cost for everyone else.
          </p>
        </section>

        <section>
          <h2>Where it goes</h2>
          <p>
            Donations go toward hosting, the accessibility work that keeps
            every tool usable on a phone or tablet with a screen reader, and
            time spent building the next tool on the roadmap.
          </p>
        </section>
      </div>

      <div className="mt-8 rounded-2xl border-2 border-border bg-surface p-6 text-center">
        {DONATION_URL ? (
          <a
            href={DONATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="touch-target inline-flex items-center justify-center rounded-xl border-2 border-brand bg-brand px-8 font-semibold text-brand-ink"
          >
            💛 Donate
          </a>
        ) : (
          <>
            <button
              type="button"
              disabled
              className="touch-target inline-flex items-center justify-center rounded-xl border-2 border-border bg-background px-8 font-semibold text-muted opacity-60"
            >
              💛 Donate (coming soon)
            </button>
            <p className="mt-3 text-sm text-muted">
              We haven&apos;t set up a donation link yet - check back soon.
            </p>
          </>
        )}
      </div>

      <p className="mt-10 text-sm text-muted">
        <Link href="/" className="font-semibold text-brand hover:underline">
          ← Back home
        </Link>
      </p>
    </div>
  );
}

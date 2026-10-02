import Link from "next/link";

export const metadata = {
  title: "Terms of Use - My Support Buddy",
};

export default function TermsOfUsePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
      <div className="mb-8 rounded-2xl border-2 border-accent bg-accent/10 p-4 text-sm">
        <p className="font-semibold mb-1">Before you publish this</p>
        <p>
          This is a working draft, not legal advice. Have it reviewed by a
          lawyer against the Privacy Act 1988 (Cth), Australian Consumer
          Law, and any NDIS Practice Standards that apply, alongside the{" "}
          <Link href="/privacy" className="font-semibold text-brand hover:underline">
            Privacy Policy
          </Link>
          , before relying on it.
        </p>
      </div>

      <h1 className="font-display text-3xl font-bold mb-2">Terms of Use</h1>
      <p className="text-muted mb-8">Last updated: [add date before publishing]</p>

      <div className="space-y-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-2 [&_p]:mb-3 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-1">
        <section>
          <h2>1. Acceptance of these terms</h2>
          <p>
            By using this website (&quot;the Service&quot;), you agree to
            these terms. If you&apos;re creating a participant profile or
            account on behalf of someone else, you&apos;re agreeing on
            their behalf too, and confirming you&apos;re authorised to do
            so.
          </p>
        </section>

        <section>
          <h2>2. Free, forever</h2>
          <p>
            Every tool on this site is free to use, with no subscription,
            no paywalled features, and no ads. We intend to keep it that
            way. Some tools may in future require a free account, only
            where that&apos;s needed to save information across visits.
          </p>
        </section>

        <section>
          <h2>3. Not professional advice</h2>
          <p>
            These tools support everyday communication, organisation and
            planning - they are not medical, clinical, legal, or financial
            advice, and don&apos;t replace guidance from a qualified
            professional. See the full{" "}
            <Link href="/disclaimer" className="font-semibold text-brand hover:underline">
              disclaimer
            </Link>
            , including emergency contacts, before relying on any tool in a
            crisis or urgent situation.
          </p>
        </section>

        <section>
          <h2>4. Your data and your device</h2>
          <p>
            Most tools save information only in your own browser&apos;s
            local storage - it never reaches our servers, and we have no
            way to see, back up, or recover it. This means:
          </p>
          <ul>
            <li>
              Clearing your browser&apos;s site data, using a different
              device or browser, or reinstalling the app will permanently
              remove that information - there is no cloud copy to restore
              it from.
            </li>
            <li>
              You&apos;re responsible for printing, exporting (CSV/PDF), or
              otherwise backing up anything you want to keep long-term.
            </li>
            <li>
              For tools that do use an account, see the{" "}
              <Link href="/privacy" className="font-semibold text-brand hover:underline">
                Privacy Policy
              </Link>{" "}
              for how that information is stored and protected.
            </li>
          </ul>
        </section>

        <section>
          <h2>5. Acceptable use</h2>
          <p>
            Please don&apos;t use the Service to:
          </p>
          <ul>
            <li>Submit false, misleading, or harmful information through any shared feature (e.g. the provider directory or tool suggestions).</li>
            <li>Attempt to access another person&apos;s account, participant profile, or data.</li>
            <li>Interfere with the Service, scrape it at scale, or attempt to bypass its security.</li>
            <li>Use the Service for anything unlawful.</li>
          </ul>
          <p>
            We can suspend or remove access, or a submitted listing/suggestion, for any breach of these terms.
          </p>
        </section>

        <section>
          <h2>6. Provider and community listings</h2>
          <p>
            Where providers list their own service (for example, the
            support coordinator or allied health directories), those
            listings are submitted directly by the provider and are not
            verified, vetted, or endorsed by us. Always confirm
            registration and qualifications independently, for example via
            the NDIS Quality and Safeguards Commission.
          </p>
        </section>

        <section>
          <h2>7. No warranty</h2>
          <p>
            The Service is provided &quot;as is&quot;, free of charge, and
            without warranty of any kind, to the extent permitted by law.
            We don&apos;t guarantee it will be error-free, uninterrupted,
            or suitable for every purpose.
          </p>
        </section>

        <section>
          <h2>8. Limitation of liability</h2>
          <p>
            To the extent permitted by law, we aren&apos;t liable for any
            loss or damage arising from your use of, or inability to use,
            the Service - including loss of locally-stored data. Nothing
            in these terms limits any consumer guarantee that
            can&apos;t lawfully be excluded under the Australian Consumer
            Law.
          </p>
        </section>

        <section>
          <h2>9. Changes to these terms</h2>
          <p>
            We may update these terms from time to time, for example as
            new tools are added. Continuing to use the Service after a
            change means you accept the updated terms.
          </p>
        </section>

        <section>
          <h2>10. Governing law</h2>
          <p>
            These terms are governed by the laws of Australia. [Add your
            specific state/territory before publishing.]
          </p>
        </section>

        <section>
          <h2>11. Contact us</h2>
          <p>
            Questions about these terms: [add contact email before
            publishing].
          </p>
        </section>
      </div>

      <p className="mt-10 text-sm text-muted">
        <Link href="/" className="font-semibold text-brand hover:underline">
          ← Back home
        </Link>
      </p>
    </div>
  );
}

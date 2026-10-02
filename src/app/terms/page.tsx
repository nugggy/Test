import Link from "next/link";

export const metadata = {
  title: "Terms of Use - My Support Buddy",
};

export default function TermsOfUsePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:py-14">

      <h1 className="font-display text-3xl font-bold mb-2">Terms of Use</h1>
      <p className="text-muted mb-8">Last updated: 2 October 2026</p>

      <div className="space-y-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-2 [&_p]:mb-3 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-1">
        <section>
          <h2>1. Who runs My Support Buddy</h2>
          <p>
            My Support Buddy is a free, non-commercial project built and run
            privately by one person in New South Wales, Australia, to help
            people with disability, their families and the people who support
            them. It is not a company, charity or registered organisation, it
            is not an NDIS provider, and it is not connected to any service
            provider. In these terms, &quot;we&quot; and &quot;us&quot; mean
            the person who runs My Support Buddy.
          </p>
        </section>

        <section>
          <h2>2. Acceptance of these terms</h2>
          <p>
            By using this website or the My Support Buddy Android app
            (together, &quot;the Service&quot;), you agree to
            these terms. If you use a tool on behalf of someone else, please
            make sure you have their permission, or are otherwise allowed, to
            record information about them.
          </p>
        </section>

        <section>
          <h2>3. Free, forever</h2>
          <p>
            Every tool on this site is free to use, with no subscription,
            no paywalled features, and no ads. We intend to keep it that
            way. There are no accounts and nothing to sign up for.
          </p>
        </section>

        <section>
          <h2>4. Not professional advice</h2>
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
          <h2>5. Your data and your device</h2>
          <p>
            Every tool saves information only on your own device, in your
            browser&apos;s local storage or in the app. It never reaches us,
            and we have no way to see, back up, or recover it. This means:
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
              See the{" "}
              <Link href="/privacy" className="font-semibold text-brand hover:underline">
                Privacy Policy
              </Link>{" "}
              for the small amount of information that does reach us.
            </li>
          </ul>
        </section>

        <section>
          <h2>6. Acceptable use</h2>
          <p>
            Please don&apos;t use the Service to:
          </p>
          <ul>
            <li>Submit false, misleading, or harmful information through any shared feature (e.g. the provider directory or tool suggestions).</li>
            <li>Attempt to access anyone else&apos;s data.</li>
            <li>Interfere with the Service, scrape it at scale, or attempt to bypass its security.</li>
            <li>Use the Service for anything unlawful.</li>
          </ul>
          <p>
            We can suspend or remove access, or a submitted listing/suggestion, for any breach of these terms.
          </p>
        </section>

        <section>
          <h2>7. Provider and community listings</h2>
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
          <h2>8. No warranty</h2>
          <p>
            The Service is provided &quot;as is&quot;, free of charge, and
            without warranty of any kind, to the extent permitted by law.
            We don&apos;t guarantee it will be error-free, uninterrupted,
            or suitable for every purpose.
          </p>
        </section>

        <section>
          <h2>9. Limitation of liability</h2>
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
          <h2>10. Changes to these terms</h2>
          <p>
            We may update these terms from time to time, for example as
            new tools are added. Continuing to use the Service after a
            change means you accept the updated terms.
          </p>
        </section>

        <section>
          <h2>11. Governing law</h2>
          <p>
            These terms are governed by the laws of New South Wales,
            Australia, and you agree to the non-exclusive jurisdiction of
            the courts of New South Wales.
          </p>
        </section>

        <section>
          <h2>12. Contact</h2>
          <p>
            Questions about these terms: <a href="mailto:gwclissold@gmail.com" className="font-semibold text-brand hover:underline">gwclissold@gmail.com</a>.
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

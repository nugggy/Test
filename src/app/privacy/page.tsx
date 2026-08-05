import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — Toolkit",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <div className="mb-8 rounded-2xl border-2 border-accent bg-accent/10 p-4 text-sm">
        <p className="font-semibold mb-1">Before you publish this</p>
        <p>
          This is a working draft, not legal advice. Because this service can
          hold health and disability information, and information about
          participants who are not the account holder (including
          potentially children), have it reviewed by a privacy lawyer
          against the Privacy Act 1988 (Cth), the Australian Privacy
          Principles, and any NDIS Practice Standards or state-based
          disability service requirements that apply before it goes live.
        </p>
      </div>

      <h1 className="font-display text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-muted mb-8">Last updated: [add date before publishing]</p>

      <div className="space-y-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-2 [&_p]:mb-3 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-1">
        <section>
          <h2>1. Who this policy covers</h2>
          <p>
            This policy explains how [Organisation legal name] (&quot;we&quot;,
            &quot;us&quot;) handles personal information collected through
            this website (&quot;the Service&quot;). It applies to:
          </p>
          <ul>
            <li>People who create an individual or family account.</li>
            <li>
              Organisations (such as NDIS providers, schools or clinics) and
              their staff who create an account.
            </li>
            <li>
              Participants — the people receiving support — whose profiles
              are created and managed by an individual or an organisation
              account on their behalf. A participant is not required to have
              their own login.
            </li>
            <li>
              Anyone using a free tool, like the Communication Board, that
              doesn&apos;t require an account.
            </li>
          </ul>
        </section>

        <section>
          <h2>2. Tools that don&apos;t need an account</h2>
          <p>
            Most tools on this site — including the Visual Communication
            Board — work entirely on your own device. Favourites, custom
            pictures and settings are stored locally in your browser, never
            sent to our servers, and we have no way to see or recover them.
          </p>
        </section>

        <section>
          <h2>3. Information we collect for accounts</h2>
          <p>For account holders (individuals, families, and organisation staff), we collect:</p>
          <ul>
            <li>Name and email address.</li>
            <li>Account type (individual/family or organisation) and, for organisations, the organisation&apos;s name and ABN.</li>
            <li>A securely hashed password (we never store or can see your actual password).</li>
          </ul>
          <p>
            For participant profiles created by an account holder, we collect
            only what is entered into the tool: typically a name, and
            optionally a date of birth and notes. Some tools (for example
            behaviour tracking or social stories) will store further
            information specific to that tool, tied to the participant
            profile it was entered under.
          </p>
          <p>
            Some of this information — health, disability, and behavioural
            information — is &quot;sensitive information&quot; under the
            Privacy Act 1988 and is handled with extra care, as described
            below.
          </p>
        </section>

        <section>
          <h2>4. Who can see participant information</h2>
          <p>
            Access is restricted at the database level, not just in the
            app, so it cannot be bypassed by a bug in a single tool:
          </p>
          <ul>
            <li>
              A participant profile created by an individual/family account
              is visible only to that account holder.
            </li>
            <li>
              A participant profile created by an organisation is visible
              only to staff who belong to that organisation.
            </li>
            <li>Organisations cannot see another organisation&apos;s participants or staff.</li>
          </ul>
        </section>

        <section>
          <h2>5. Consent for participant profiles</h2>
          <p>
            Anyone creating a profile for another person confirms, at
            sign-up, that they are authorised to do so — for example as a
            parent, guardian, or support coordinator, or under an
            organisation&apos;s existing service agreement or consent
            process with the participant. Organisations are responsible for
            obtaining and recording any consent required by their own
            obligations (including NDIS Practice Standards) before entering
            a participant&apos;s information.
          </p>
        </section>

        <section>
          <h2>6. Where information is stored and how it&apos;s protected</h2>
          <ul>
            <li>Account and participant data is stored with Supabase, our database provider, using industry-standard encryption in transit and at rest.</li>
            <li>Every table enforces row-level security so a query can only ever return the rows a signed-in user is actually authorised to see.</li>
            <li>We do not sell personal information, and we do not use participant information for advertising.</li>
            <li>We do not use participant or account data to train third-party AI models.</li>
          </ul>
        </section>

        <section>
          <h2>7. Data retention and deletion</h2>
          <p>
            We keep account and participant information for as long as the
            account is active. You can request deletion of an account,
            organisation, or participant profile at any time by contacting
            us — see below. [Add your specific retention periods here,
            especially any minimum periods required by NDIS record-keeping
            obligations, before publishing.]
          </p>
        </section>

        <section>
          <h2>8. Your rights</h2>
          <p>
            Under the Australian Privacy Principles, you can generally
            request access to, and correction of, personal information we
            hold about you or a participant you manage. Contact us using the
            details below to make a request.
          </p>
        </section>

        <section>
          <h2>9. Cookies and local storage</h2>
          <p>
            We use essential cookies to keep you signed in securely.
            Accessibility preferences (text size, contrast, font) and
            no-account tool data (like communication board favourites) are
            stored only in your browser&apos;s local storage, on your own
            device.
          </p>
        </section>

        <section>
          <h2>10. Contact us</h2>
          <p>
            For any privacy question, or to request access to, correction
            of, or deletion of your information: [add contact email/postal
            address before publishing]. If you&apos;re not satisfied with our
            response, you can contact the Office of the Australian
            Information Commissioner (oaic.gov.au).
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

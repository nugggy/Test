import Link from "next/link";

export const metadata = {
  title: "Privacy Policy - My Support Buddy",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:py-14">

      <h1 className="font-display text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-muted mb-8">Last updated: 2 October 2026</p>

      <div className="space-y-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-2 [&_p]:mb-3 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-1">
        <section>
          <h2>1. Who runs My Support Buddy</h2>
          <p>
            My Support Buddy is a free, non-commercial project built and run
            privately by one person in New South Wales, Australia, to help people with
            disability, their families and the people who support them. It
            is not a company, charity or registered organisation, it is not
            an NDIS provider, and it is not connected to any service
            provider. There are no ads, nothing is sold, and the site does
            not make money.
          </p>
          <p>
            In this policy, &quot;we&quot; and &quot;us&quot; mean the
            person who runs My Support Buddy. It explains how personal
            information is handled on this website and in the My Support
            Buddy Android app (together, &quot;the Service&quot;). It applies
            to:
          </p>
          <ul>
            <li>Anyone using a tool that doesn&apos;t need an account.</li>
            <li>People who create an individual or family account.</li>
            <li>
              Organisations (such as NDIS providers, schools or clinics) and
              their staff who create an account.
            </li>
            <li>
              Participants - the people receiving support - whose profiles
              are created and managed by an individual or an organisation
              account on their behalf. A participant is not required to have
              their own login.
            </li>
            <li>
              Anyone who sends a tool suggestion or a provider directory
              listing through the forms on this site.
            </li>
          </ul>
        </section>

        <section>
          <h2>2. Tools that don&apos;t need an account</h2>
          <p>
            Most tools on this site work entirely on your own device. What
            you enter, plus favourites, custom pictures and settings, is
            stored locally in your browser or in the app on your phone. It
            is never sent to us, and we have no way to see or recover it. If
            you clear your browser data or uninstall the app, it is gone.
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
            Some of this information - health, disability, and behavioural
            information - is &quot;sensitive information&quot; under the
            Privacy Act 1988 and is handled with extra care, as described
            below.
          </p>
        </section>

        <section>
          <h2>4. Other information we receive</h2>
          <ul>
            <li>
              <strong>Tool suggestions:</strong> what you write, and an email
              address only if you choose to give one so we can reply.
            </li>
            <li>
              <strong>Provider directory listings:</strong> the business and
              contact details you submit, which are shown publicly in the
              directory once approved.
            </li>
            <li>
              <strong>Favourite counts:</strong> when you favourite a tool, a
              random device code (not linked to your name or account) is
              stored so the &quot;community favourites&quot; totals can be
              counted.
            </li>
            <li>
              <strong>Visit count:</strong> a single running total of how many
              times the homepage has been opened. Nothing about who opened
              it is stored.
            </li>
          </ul>
        </section>

        <section>
          <h2>5. Who can see participant information</h2>
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
          <h2>6. Consent for participant profiles</h2>
          <p>
            Anyone creating a profile for another person confirms, at
            sign-up, that they are authorised to do so - for example as a
            parent, guardian, or support coordinator, or under an
            organisation&apos;s existing service agreement or consent
            process with the participant. Organisations are responsible for
            obtaining and recording any consent required by their own
            obligations (including NDIS Practice Standards) before entering
            a participant&apos;s information.
          </p>
        </section>

        <section>
          <h2>7. Where information is stored and how it&apos;s protected</h2>
          <ul>
            <li>Account and participant data is stored with Supabase, the database service this site uses, with encryption in transit and at rest.</li>
            <li>Every table enforces row-level security so a query can only ever return the rows a signed-in user is actually authorised to see.</li>
            <li>We do not sell personal information, and we do not use it for advertising.</li>
            <li>We do not use participant or account data to train AI models.</li>
          </ul>
        </section>

        <section>
          <h2>8. Outside services the Service relies on</h2>
          <p>
            These services receive the normal technical details any website
            receives when your device connects to it, such as your IP
            address and browser type:
          </p>
          <ul>
            <li><strong>Vercel</strong> hosts the website.</li>
            <li><strong>Supabase</strong> stores account data and the form submissions described above.</li>
            <li>
              <strong>GitHub</strong> hosts the Android app download. The app
              also checks GitHub for a newer version when it opens.
            </li>
            <li>
              <strong>Open-Meteo</strong> provides forecasts for the Weather
              tool. The place you search for, or your location if you tap
              &quot;Use my location&quot;, is sent to Open-Meteo to get the
              forecast.
            </li>
          </ul>
          <p>
            Some of these services may store or process data outside
            Australia.
          </p>
        </section>

        <section>
          <h2>9. Data retention and deletion</h2>
          <p>
            We keep account and participant information for as long as the
            account is active. You can ask for an account, organisation, or
            participant profile to be deleted at any time using the contact
            details below. Organisations remain responsible for keeping their
            own copies of any records they are required to keep, such as
            under NDIS record-keeping obligations.
          </p>
        </section>

        <section>
          <h2>10. Your rights</h2>
          <p>
            You can ask to see, correct, or delete personal information we
            hold about you or a participant you manage. Use the contact
            details below to make a request.
          </p>
        </section>

        <section>
          <h2>11. Cookies and local storage</h2>
          <p>
            We use essential cookies only to keep you signed in securely.
            There are no advertising or tracking cookies. Accessibility
            preferences (text size, contrast, font) and no-account tool data
            are stored only in your browser&apos;s local storage, on your own
            device.
          </p>
        </section>

        <section>
          <h2>12. Contact</h2>
          <p>
            For any privacy question, or to ask for access to, correction
            of, or deletion of your information: <a href="mailto:gwclissold@gmail.com" className="font-semibold text-brand hover:underline">gwclissold@gmail.com</a>. If you&apos;re not satisfied with the response, you
            can contact the Office of the Australian Information
            Commissioner (oaic.gov.au).
          </p>
        </section>
      </div>

      <p className="mt-10 text-sm text-muted">
        <Link href="/" className="font-semibold text-brand hover:underline">
          ← Back home
        </Link>
        {" · "}
        <Link href="/terms" className="font-semibold text-brand hover:underline">
          Terms of Use
        </Link>
      </p>
    </div>
  );
}

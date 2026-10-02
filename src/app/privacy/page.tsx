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
            privately by one person in New South Wales, Australia, to help
            people with disability, their families and the people who support
            them. It is not a company, charity or registered organisation, it
            is not an NDIS provider, and it is not connected to any service
            provider. There are no ads, nothing is sold, and the site does
            not make money.
          </p>
          <p>
            In this policy, &quot;we&quot; and &quot;us&quot; mean the
            person who runs My Support Buddy. It explains how information is
            handled on this website and in the My Support Buddy Android app
            (together, &quot;the Service&quot;).
          </p>
        </section>

        <section>
          <h2>2. Your tool information stays on your device</h2>
          <p>
            There are no accounts and no sign-in. Everything you enter into a
            tool - including any health, disability, behaviour, medication or
            personal details - is stored only on your own device, in your
            browser&apos;s local storage or in the app on your phone. It is
            never sent to us, and we have no way to see, back up, or recover
            it.
          </p>
          <ul>
            <li>
              If you clear your browser data, use a different device or
              browser, or uninstall the app, that information is gone.
            </li>
            <li>
              Anything you print, export or share (for example as a PDF or
              CSV file) is in your control from that point on.
            </li>
            <li>
              Anyone who can use your device may be able to see what you have
              entered, so use your device&apos;s lock screen if that matters
              to you.
            </li>
          </ul>
        </section>

        <section>
          <h2>3. Information that does reach us</h2>
          <p>Only these things are ever sent to us, and only if you use them:</p>
          <ul>
            <li>
              <strong>Tool suggestions:</strong> what you write, and an email
              address only if you choose to give one so we can reply. Please
              don&apos;t include health or personal details about anyone.
            </li>
            <li>
              <strong>Provider directory listings:</strong> the business and
              contact details a provider submits, which are shown publicly in
              the directory once approved.
            </li>
            <li>
              <strong>Favourite counts:</strong> when you favourite a tool, a
              random device code (not linked to your name or anything about
              you) is stored so the community favourites totals can be
              counted.
            </li>
            <li>
              <strong>Visit count:</strong> a single running total of how many
              times the homepage has been opened. Nothing about who opened it
              is stored.
            </li>
          </ul>
          <p>
            We do not sell information, use it for advertising, or use it to
            train AI models.
          </p>
        </section>

        <section>
          <h2>4. Outside services the Service relies on</h2>
          <p>
            These services receive the normal technical details any website
            receives when your device connects to it, such as your IP address
            and browser type:
          </p>
          <ul>
            <li><strong>Vercel</strong> hosts the website.</li>
            <li>
              <strong>Supabase</strong> stores the suggestions, provider
              listings, favourite counts and visit count described above, with
              encryption in transit and at rest.
            </li>
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
          <h2>5. Keeping and deleting information</h2>
          <p>
            Suggestions and provider listings are kept for as long as they
            are useful for running the site. You can ask for a suggestion or
            listing you sent to be corrected or deleted at any time using the
            contact details below. Information in the tools on your device is
            deleted whenever you clear it, clear your browser data, or
            uninstall the app.
          </p>
        </section>

        <section>
          <h2>6. Cookies and local storage</h2>
          <p>
            The Service does not use advertising, analytics or tracking
            cookies. Your tool information and preferences (such as text
            size, contrast and font) are kept in your browser&apos;s local
            storage on your own device.
          </p>
        </section>

        <section>
          <h2>7. Changes to this policy</h2>
          <p>
            If how the Service handles information changes, this page will
            be updated and the date at the top changed.
          </p>
        </section>

        <section>
          <h2>8. Contact</h2>
          <p>
            For any privacy question, or to ask for something you sent us to
            be corrected or deleted:{" "}
            <a href="mailto:gwclissold@gmail.com" className="font-semibold text-brand hover:underline">gwclissold@gmail.com</a>.
            If you&apos;re not satisfied with the response, you can contact
            the Office of the Australian Information Commissioner
            (oaic.gov.au).
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

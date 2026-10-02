import { headers } from "next/headers";
import BrandMark from "@/components/BrandMark";
import {
  parseInstalledVersion,
  pickLatestAndroidRelease,
  RELEASES_API_URL,
  RELEASES_PAGE_URL,
} from "@/lib/app-update";

/**
 * Homepage "Get the Android app" panel. Server component: looks up the
 * latest published android-v* GitHub release (cached for an hour) so the
 * button always points at the current APK and shows its version. Falls
 * back to the releases page if GitHub can't be reached, and renders
 * nothing at all when the page is already being viewed inside the app.
 */
export default async function AndroidAppDownload() {
  const userAgent = (await headers()).get("user-agent");
  if (parseInstalledVersion(userAgent)) return null;

  let version: string | null = null;
  let href: string = RELEASES_PAGE_URL + "/latest";
  try {
    const res = await fetch(RELEASES_API_URL, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const latest = pickLatestAndroidRelease(await res.json());
      if (latest) {
        version = latest.version;
        href = latest.apkUrl;
      }
    }
  } catch {
    // GitHub unreachable or rate limited: the releases page link still works.
  }

  return (
    <section
      aria-labelledby="android-app-heading"
      className="mb-12 grid items-center gap-8 overflow-hidden rounded-3xl bg-brand-soft p-6 sm:mb-16 sm:p-10 md:grid-cols-[1.4fr_1fr]"
    >
      <div>
        <p className="inline-flex items-center gap-2 rounded-full bg-surface px-3 py-1 text-sm font-semibold">
          <span aria-hidden="true">📱</span> Android app
        </p>
        <h2 id="android-app-heading" className="font-display mt-4 scroll-mt-24 text-3xl sm:text-4xl">
          Take your buddy everywhere
        </h2>
        <p className="mt-3 max-w-xl text-lg">
          The same tools in a full-screen app with its own home-screen icon.
          Free, no account needed, and it lets you know when an update is
          ready.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <a
            href={href}
            rel="noopener noreferrer"
            className="touch-target inline-flex items-center gap-2 rounded-2xl bg-brand px-6 text-lg font-semibold text-brand-ink"
          >
            <span aria-hidden="true" className="text-xl">⬇</span>
            Download for Android
          </a>
          {version && <span className="text-sm font-semibold">Version {version}</span>}
        </div>
        <p className="mt-4 max-w-xl text-sm">
          After it downloads, open the file to install. Android may ask you
          to allow installs from your browser the first time.
        </p>
      </div>

      {/* decorative phone mock-up */}
      <div aria-hidden="true" className="mx-auto w-48 rotate-3 sm:w-56">
        <div className="rounded-[2.25rem] bg-ink-block p-2.5 shadow-xl">
          <div className="overflow-hidden rounded-[1.75rem] bg-background">
            <div className="flex items-center gap-2 border-b border-border bg-surface px-3 py-2.5">
              <BrandMark className="h-6 w-6" />
              <span className="font-display text-xs font-semibold">My Support Buddy</span>
            </div>
            <div className="grid grid-cols-2 gap-2 p-3">
              {[
                ["🗣️", "bg-[var(--tint-communication)]"],
                ["📅", "bg-[var(--tint-routines)]"],
                ["😊", "bg-[var(--tint-emotional)]"],
                ["⏱️", "bg-[var(--tint-preparation)]"],
                ["💊", "bg-[var(--tint-wellbeing)]"],
                ["🛒", "bg-[var(--tint-living)]"],
              ].map(([icon, tint]) => (
                <span key={icon} className={`grid aspect-square place-items-center rounded-xl text-2xl ${tint}`}>
                  {icon}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

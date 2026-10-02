import { headers } from "next/headers";
import BrandMark from "@/components/BrandMark";
import {
  parseInstalledVersion,
  pickLatestAndroidRelease,
  RELEASES_API_URL,
  RELEASES_PAGE_URL,
} from "@/lib/app-update";

/**
 * Homepage "Get the Android app" block. Server component: looks up the
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
      className="mb-12 flex flex-col gap-5 rounded-2xl border-2 border-border bg-surface p-6 sm:mb-16 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-start gap-4">
        <BrandMark className="h-14 w-14 sm:h-16 sm:w-16" />
        <div>
          <h2 id="android-app-heading" className="font-display text-2xl font-bold">
            Get the Android app
          </h2>
          <p className="mt-1 max-w-xl text-muted">
            The same tools in a full-screen app with its own home-screen icon.
            Free, no account needed, and it tells you when an update is ready.
            {version && <> Latest version: {version}.</>}
          </p>
          <p className="mt-2 max-w-xl text-sm text-muted">
            After it downloads, open the file to install. Android may ask you
            to allow installs from your browser the first time.
          </p>
        </div>
      </div>
      <a
        href={href}
        rel="noopener noreferrer"
        className="touch-target inline-flex shrink-0 items-center gap-2 rounded-xl bg-brand px-6 text-lg font-bold text-brand-ink shadow-md shadow-brand/30 transition-transform hover:scale-[1.03]"
      >
        <span aria-hidden="true" className="text-2xl">
          ⬇
        </span>
        Download for Android
      </a>
    </section>
  );
}

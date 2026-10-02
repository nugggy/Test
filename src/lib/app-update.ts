/**
 * Update-channel logic for the Android app shell.
 *
 * The Android app (android/) appends "ToolkitAndroid/<version>" to the
 * WebView user agent. When the site sees that token it knows it is running
 * inside the app and which APK version is installed, fetches the GitHub
 * releases for this repo, and offers a download if a newer "android-v*"
 * release exists. Everything here is pure so it can be unit tested; the
 * fetching and rendering live in components/AppUpdateChecker.tsx.
 */

export const GITHUB_REPO = "nugggy/Test";
export const RELEASES_API_URL = `https://api.github.com/repos/${GITHUB_REPO}/releases?per_page=20`;
export const RELEASES_PAGE_URL = `https://github.com/${GITHUB_REPO}/releases`;
export const ANDROID_TAG_PREFIX = "android-v";
export const USER_AGENT_TOKEN = /\bToolkitAndroid\/(\d+\.\d+\.\d+)\b/;
export const MIN_CHECK_INTERVAL_MS = 60 * 60 * 1000;

/** Only accept APK download links that GitHub itself serves for this repo. */
const ALLOWED_DOWNLOAD_PREFIX = `https://github.com/${GITHUB_REPO}/releases/download/`;

export interface AndroidRelease {
  version: string;
  tag: string;
  notes: string;
  apkUrl: string;
  pageUrl: string;
}

/** The subset of the GitHub release JSON we read. */
export interface GitHubReleaseLike {
  tag_name?: unknown;
  draft?: unknown;
  prerelease?: unknown;
  body?: unknown;
  html_url?: unknown;
  assets?: unknown;
}

/** Installed APK version from the WebView user agent, or null in a browser. */
export function parseInstalledVersion(userAgent: string | null | undefined): string | null {
  if (!userAgent) return null;
  const match = USER_AGENT_TOKEN.exec(userAgent);
  return match ? match[1] : null;
}

export function isValidVersion(value: string): boolean {
  return /^\d+\.\d+\.\d+$/.test(value);
}

/** Semantic-version compare of "major.minor.patch" strings. */
export function compareVersions(a: string, b: string): -1 | 0 | 1 {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < 3; i++) {
    const x = pa[i] ?? 0;
    const y = pb[i] ?? 0;
    if (x > y) return 1;
    if (x < y) return -1;
  }
  return 0;
}

/**
 * Pick the newest published Android release from the GitHub releases list.
 * Ignores drafts, pre-releases, non-Android tags, malformed versions and
 * releases without an .apk asset served from this repo.
 */
export function pickLatestAndroidRelease(releases: unknown): AndroidRelease | null {
  if (!Array.isArray(releases)) return null;
  let best: AndroidRelease | null = null;

  for (const raw of releases as GitHubReleaseLike[]) {
    if (!raw || typeof raw !== "object") continue;
    if (raw.draft === true || raw.prerelease === true) continue;
    if (typeof raw.tag_name !== "string" || !raw.tag_name.startsWith(ANDROID_TAG_PREFIX)) continue;

    const version = raw.tag_name.slice(ANDROID_TAG_PREFIX.length);
    if (!isValidVersion(version)) continue;

    const apkUrl = findApkUrl(raw.assets);
    if (!apkUrl) continue;

    const pageUrl =
      typeof raw.html_url === "string" && raw.html_url.startsWith(RELEASES_PAGE_URL)
        ? raw.html_url
        : `${RELEASES_PAGE_URL}/tag/${raw.tag_name}`;

    const candidate: AndroidRelease = {
      version,
      tag: raw.tag_name,
      notes: typeof raw.body === "string" ? raw.body.trim().slice(0, 2000) : "",
      apkUrl,
      pageUrl,
    };
    if (!best || compareVersions(candidate.version, best.version) > 0) best = candidate;
  }
  return best;
}

function findApkUrl(assets: unknown): string | null {
  if (!Array.isArray(assets)) return null;
  for (const asset of assets) {
    if (!asset || typeof asset !== "object") continue;
    const name = (asset as { name?: unknown }).name;
    const url = (asset as { browser_download_url?: unknown }).browser_download_url;
    if (
      typeof name === "string" &&
      name.toLowerCase().endsWith(".apk") &&
      typeof url === "string" &&
      url.startsWith(ALLOWED_DOWNLOAD_PREFIX)
    ) {
      return url;
    }
  }
  return null;
}

export interface UpdateDecisionInput {
  installedVersion: string;
  latest: AndroidRelease | null;
  /** Version the user tapped "Not now" on, if any. */
  dismissedVersion?: string | null;
}

/** Show the banner only for a strictly newer, not-yet-dismissed release. */
export function shouldOfferUpdate({ installedVersion, latest, dismissedVersion }: UpdateDecisionInput): boolean {
  if (!latest) return false;
  if (!isValidVersion(installedVersion)) return false;
  if (compareVersions(latest.version, installedVersion) <= 0) return false;
  if (dismissedVersion && compareVersions(latest.version, dismissedVersion) === 0) return false;
  return true;
}

/** Rate-limit checks so the unauthenticated GitHub API quota is never hit. */
export function isCheckDue(lastCheckedAt: number | null | undefined, now: number): boolean {
  if (typeof lastCheckedAt !== "number" || !Number.isFinite(lastCheckedAt)) return true;
  if (lastCheckedAt > now) return true; // clock went backwards; be safe and check
  return now - lastCheckedAt >= MIN_CHECK_INTERVAL_MS;
}

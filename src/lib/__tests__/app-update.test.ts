import { describe, expect, it } from "vitest";
import {
  compareVersions,
  isCheckDue,
  MIN_CHECK_INTERVAL_MS,
  parseInstalledVersion,
  pickLatestAndroidRelease,
  shouldOfferUpdate,
} from "../app-update";

const DOWNLOAD = "https://github.com/nugggy/Test/releases/download";

function release(tag: string, extra: Record<string, unknown> = {}) {
  return {
    tag_name: tag,
    draft: false,
    prerelease: false,
    body: `Notes for ${tag}`,
    html_url: `https://github.com/nugggy/Test/releases/tag/${tag}`,
    assets: [{ name: "toolkit.apk", browser_download_url: `${DOWNLOAD}/${tag}/toolkit.apk` }],
    ...extra,
  };
}

describe("parseInstalledVersion", () => {
  it("reads the version from the app user agent", () => {
    expect(parseInstalledVersion("Mozilla/5.0 (Linux; Android 14) Chrome/130 ToolkitAndroid/1.2.3")).toBe("1.2.3");
  });
  it("returns null in a normal browser", () => {
    expect(parseInstalledVersion("Mozilla/5.0 (Windows NT 10.0) Chrome/130")).toBeNull();
    expect(parseInstalledVersion(null)).toBeNull();
    expect(parseInstalledVersion("ToolkitAndroid/1.2")).toBeNull();
  });
});

describe("compareVersions", () => {
  it("compares numerically, not lexically", () => {
    expect(compareVersions("1.10.0", "1.9.0")).toBe(1);
    expect(compareVersions("1.0.0", "1.0.0")).toBe(0);
    expect(compareVersions("0.9.9", "1.0.0")).toBe(-1);
  });
});

describe("pickLatestAndroidRelease", () => {
  it("picks the highest android-v release with an apk", () => {
    const latest = pickLatestAndroidRelease([
      release("android-v1.0.0"),
      release("android-v1.2.0"),
      release("android-v1.1.5"),
    ]);
    expect(latest?.version).toBe("1.2.0");
    expect(latest?.apkUrl).toBe(`${DOWNLOAD}/android-v1.2.0/toolkit.apk`);
    expect(latest?.notes).toBe("Notes for android-v1.2.0");
  });
  it("ignores drafts, pre-releases, web tags, bad versions and foreign download hosts", () => {
    const latest = pickLatestAndroidRelease([
      release("android-v9.0.0", { draft: true }),
      release("android-v8.0.0", { prerelease: true }),
      release("v7.0.0"),
      release("android-v6.0"),
      release("android-v5.0.0", {
        assets: [{ name: "toolkit.apk", browser_download_url: "https://evil.example/t.apk" }],
      }),
      release("android-v4.0.0", {
        assets: [{ name: "notes.txt", browser_download_url: `${DOWNLOAD}/android-v4.0.0/notes.txt` }],
      }),
      release("android-v1.0.0"),
    ]);
    expect(latest?.version).toBe("1.0.0");
  });
  it("copes with garbage input", () => {
    expect(pickLatestAndroidRelease(null)).toBeNull();
    expect(pickLatestAndroidRelease({})).toBeNull();
    expect(pickLatestAndroidRelease([null, 42, "x", {}])).toBeNull();
  });
});

describe("shouldOfferUpdate", () => {
  const latest = pickLatestAndroidRelease([release("android-v1.1.0")]);
  it("offers a strictly newer release", () => {
    expect(shouldOfferUpdate({ installedVersion: "1.0.0", latest })).toBe(true);
  });
  it("stays quiet when up to date or ahead", () => {
    expect(shouldOfferUpdate({ installedVersion: "1.1.0", latest })).toBe(false);
    expect(shouldOfferUpdate({ installedVersion: "2.0.0", latest })).toBe(false);
  });
  it("respects a dismissed version until a newer one appears", () => {
    expect(shouldOfferUpdate({ installedVersion: "1.0.0", latest, dismissedVersion: "1.1.0" })).toBe(false);
    expect(shouldOfferUpdate({ installedVersion: "1.0.0", latest, dismissedVersion: "1.0.5" })).toBe(true);
  });
  it("handles missing data", () => {
    expect(shouldOfferUpdate({ installedVersion: "1.0.0", latest: null })).toBe(false);
    expect(shouldOfferUpdate({ installedVersion: "nope", latest })).toBe(false);
  });
});

describe("isCheckDue", () => {
  const now = 1_700_000_000_000;
  it("is due on first run and after the interval", () => {
    expect(isCheckDue(null, now)).toBe(true);
    expect(isCheckDue(now - MIN_CHECK_INTERVAL_MS, now)).toBe(true);
  });
  it("is not due inside the interval", () => {
    expect(isCheckDue(now - 1000, now)).toBe(false);
  });
  it("treats a future timestamp as due", () => {
    expect(isCheckDue(now + 5000, now)).toBe(true);
  });
});

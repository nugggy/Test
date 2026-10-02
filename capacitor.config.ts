import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Android shell for the My Support Buddy website.
 *
 * The app is a native WebView that loads the live site, so sign-in cookies,
 * server actions, the service worker cache and localStorage all behave
 * exactly as they do in a browser. `mobile/www` holds only the local
 * offline page shown if the very first load fails with no network.
 *
 * The APK's own version lives in android/app/build.gradle (versionName /
 * versionCode), independent of the website version in package.json. See
 * docs/android-release.md.
 */
const config: CapacitorConfig = {
  appId: "cc.dunns.tools",
  appName: "My Support Buddy",
  webDir: "mobile/www",
  server: {
    url: "https://tools.dunns.cc",
    errorPath: "offline.html",
    androidScheme: "https",
  },
  android: {
    allowMixedContent: false,
    backgroundColor: "#f4f7f5",
  },
};

export default config;

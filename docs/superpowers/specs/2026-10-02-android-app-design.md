# Android app shell with update channel

Date: 02/10/2026. Status: approved in conversation, implemented in the same session.

## Goal

Ship the Toolkit website as an installable Android app, distributed as a direct APK
download (not the Play Store), that saves data on the device and checks for a newer
APK every time it starts.

## Decisions

- Distribution: direct APK download, sideloaded.
- Hosting: GitHub Releases on the public repo nugggy/Test, tagged `android-vX.Y.Z`.
- Site URL loaded by the app: https://tools.dunns.cc
- App name: Toolkit. Package ID: cc.dunns.tools (permanent once installed).
- Offline: open what the service worker has cached; silent skip of the update check;
  a local offline page for a failed first load.

## Approach

Capacitor shell (`android/`) whose WebView loads the live site. No static export,
because the site is server-rendered (proxy, server actions, Supabase cookies).

1. Android project: `capacitor.config.ts` at the repo root, native project in
   `android/`, `mobile/www/` holds only the offline page.
2. Update channel: APK version lives in `android/app/build.gradle` (independent of
   `package.json`). A client component in the root layout runs only inside the app:
   reads the installed version from the native side, fetches the GitHub releases list,
   picks the newest `android-v*` tag, and shows an accessible banner with release
   notes, a Download button (opens the APK asset in the system browser) and a Not now
   button (hides that version). Checks are capped at once per hour. Failures are silent.
3. Printing: WebViews cannot run `window.print()`. A small native plugin calls the
   Android print manager; `PrintButton` uses it inside the app, browser print elsewhere.
4. Data: localStorage in the app's private storage; Android auto-backup left on.
5. Build and release: gitignored release keystore, Gradle signing config, npm scripts
   for sync/debug/release builds, `docs/android-release.md` for the release steps.
6. Tests: Vitest for the pure version-compare and banner-decision logic.

## Out of scope

Play Store listing, push notifications, forced or minimum-version updates, iOS.

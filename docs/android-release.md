# Android app: building and releasing

The Android app is a thin native shell (Capacitor) whose WebView loads the live
site at https://tools.dunns.cc. There is no separate mobile codebase: every tool,
sign-in, server action and localStorage save behaves exactly as it does in a phone
browser. The shell only needs a new APK when the shell itself changes (icon,
splash, native plugins, Capacitor upgrade). Website changes reach the app the
moment they are deployed.

Download link for users: https://github.com/nugggy/Test/releases/latest

## What lives where

| Path | Purpose |
| --- | --- |
| `capacitor.config.ts` | App ID `cc.dunns.tools`, name, site URL, offline page |
| `android/` | Native Android project (Gradle). Commit it. |
| `android/app/build.gradle` | `versionCode` / `versionName` of the APK, release signing |
| `android/app/src/main/java/cc/dunns/tools/MainActivity.java` | Appends `ToolkitAndroid/<version>` to the user agent, registers the print plugin |
| `android/app/src/main/java/cc/dunns/tools/PrinterPlugin.java` | Native print dialog (WebViews have no `window.print()`) |
| `mobile/www/` | Only the local offline page shown if the first load fails |
| `src/lib/app-update.ts` | Pure update-channel logic (unit tested) |
| `src/components/AppUpdateChecker.tsx` | Banner shown inside the app when a newer release exists |
| `src/lib/native-app.ts` | `isAndroidApp()` and `printPage()` helpers |
| `android/keystore/` and `android/keystore.properties` | Release signing key and passwords. Gitignored. Back them up. |

## How the update channel works

1. The app's WebView sends the user agent token `ToolkitAndroid/1.0.0` (the
   `versionName` from `build.gradle`).
2. On load, `AppUpdateChecker` sees that token, fetches
   `https://api.github.com/repos/nugggy/Test/releases` (at most once an hour) and
   picks the newest published release whose tag starts with `android-v` and that
   has an `.apk` asset hosted by GitHub for this repo.
3. If that version is newer than the installed one, a banner offers a Download
   button (opens the APK in the system browser, which downloads it and offers to
   install) and a Not now button (hides that version until a newer one appears).
4. Anything that fails is silent. In a normal browser the component renders nothing.

Drafts and pre-releases are ignored, so you can prepare a release safely before
publishing it.

## Prerequisites (already on this machine)

- Android Studio with SDK platform 36 and build-tools 36. The SDK path is in the
  gitignored `android/local.properties` (`sdk.dir=...`).
- JDK 21. Capacitor 8 needs it. Android Studio bundles one at
  `C:\Program Files\Android\Android Studio\jbr`. Set `JAVA_HOME` to that for the
  Gradle commands below if your default Java is older.

## Releasing a new APK

1. Bump the version in `android/app/build.gradle`: increase `versionCode` by one
   and set `versionName` to the new semantic version, e.g. `1.1.0`.
2. Build and sign:

   ```powershell
   $env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
   npm run android:release
   ```

   The signed APK is written to `android/app/build/outputs/apk/release/app-release.apk`.
   Check it: `apksigner verify --print-certs <apk>` from `build-tools/36.0.0`.
3. Rename it to `toolkit-<versionName>.apk`.
4. Commit and push, then create a GitHub release on nugggy/Test:
   - Tag: `android-v<versionName>` (exactly, e.g. `android-v1.1.0`).
   - Title: `Toolkit Android v<versionName>`.
   - Body: plain-text release notes. The app shows them under "What's new".
   - Attach the renamed APK. Publish (not draft, not pre-release).
5. Open the previous version of the app. The update banner appears within the hour
   (immediately on a fresh install).

The signing key must stay the same for every release. Android refuses to install
an update signed with a different key, so users would have to uninstall and lose
local data. Keep `android/keystore/toolkit-release.jks` and
`android/keystore.properties` backed up somewhere safe outside the repo.

## Installing on a phone

Users download the APK from the releases page, open it, and allow "install
unknown apps" for their browser the first time Android asks. Debug builds for
testing: `npm run android:debug`, then
`adb install -r android/app/build/outputs/apk/debug/app-debug.apk`.

## Known limitations

- The app needs internet on first launch. After that, the service worker serves
  the shell and any tool already opened, and the update check is skipped offline.
- Speech recognition (microphone input) is not available in Android WebViews.
  Text-to-speech works.
- The launcher icon is Capacitor's default. Replace it with
  `npx @capacitor/assets generate --android` once real icons exist (see the
  `manifest.json` note in CLAUDE.md).

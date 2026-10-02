"use client";

import { registerPlugin } from "@capacitor/core";
import { parseInstalledVersion } from "@/lib/app-update";

/**
 * Small bridge to the Android app shell (android/). Every helper here is a
 * no-op in a normal browser so the website never has to care where it runs.
 */

interface PrinterPlugin {
  print(options: { name?: string }): Promise<void>;
}

const Printer = registerPlugin<PrinterPlugin>("Printer");

/** True when the page is running inside the Android app's WebView. */
export function isAndroidApp(): boolean {
  if (typeof navigator === "undefined") return false;
  return parseInstalledVersion(navigator.userAgent) !== null;
}

/**
 * Print the current page. Android WebViews have no window.print(), so inside
 * the app this hands the page to the system print dialog via the native
 * Printer plugin; everywhere else it is plain window.print().
 */
export async function printPage(): Promise<void> {
  if (isAndroidApp()) {
    try {
      await Printer.print({ name: document.title || "Toolkit" });
      return;
    } catch {
      // Fall through to window.print(); on a WebView that is a harmless no-op.
    }
  }
  window.print();
}

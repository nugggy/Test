import type { Metadata, Viewport } from "next";
import "@fontsource/atkinson-hyperlegible/400.css";
import "@fontsource/atkinson-hyperlegible/700.css";
import "@fontsource/lexend/400.css";
import "@fontsource/lexend/500.css";
import "@fontsource/lexend/600.css";
import "@fontsource/lexend/700.css";
import { AccessibilityProvider } from "@/lib/accessibility-context";
import { TimezoneProvider } from "@/lib/timezone-context";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import CookieConsentBanner from "@/components/CookieConsentBanner";
import AppUpdateChecker from "@/components/AppUpdateChecker";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Support Buddy - Free disability support tools",
  description:
    "A free collection of practical tools for people with disability, families, support workers, educators, therapists and NDIS providers.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#c23b37",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <AccessibilityProvider>
          <TimezoneProvider>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-brand focus:text-brand-ink focus:px-4 focus:py-2 focus:rounded-lg"
            >
              Skip to main content
            </a>
            <AppUpdateChecker />
            <SiteHeader />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <SiteFooter />
            <ServiceWorkerRegister />
            <CookieConsentBanner />
          </TimezoneProvider>
        </AccessibilityProvider>
      </body>
    </html>
  );
}

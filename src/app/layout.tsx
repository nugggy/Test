import type { Metadata, Viewport } from "next";
import "@fontsource/atkinson-hyperlegible/400.css";
import "@fontsource/atkinson-hyperlegible/700.css";
import "@fontsource/baloo-2/500.css";
import "@fontsource/baloo-2/600.css";
import "@fontsource/baloo-2/700.css";
import "@fontsource/baloo-2/800.css";
import "@fontsource/lexend/400.css";
import "@fontsource/lexend/500.css";
import "@fontsource/lexend/600.css";
import "@fontsource/lexend/700.css";
import { AccessibilityProvider } from "@/lib/accessibility-context";
import { TimezoneProvider } from "@/lib/timezone-context";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import "./globals.css";

export const metadata: Metadata = {
  title: "Toolkit — Free disability support tools",
  description:
    "A free, no-signup collection of practical tools for people with disability, families, support workers, educators, therapists and NDIS providers.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f6e67",
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
            <SiteHeader />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <SiteFooter />
            <ServiceWorkerRegister />
          </TimezoneProvider>
        </AccessibilityProvider>
      </body>
    </html>
  );
}

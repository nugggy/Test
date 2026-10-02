import Link from "next/link";
import AccessibilityControls from "@/components/AccessibilityControls";
import ReadPageAloudButton from "@/components/ReadPageAloudButton";
import BrandMark from "@/components/BrandMark";

export default function SiteHeader() {
  return (
    <header className="no-print sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2.5 sm:py-3">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5 rounded-xl text-foreground sm:gap-3"
        >
          <BrandMark className="sticker h-10 w-10 sm:h-11 sm:w-11" />
          <span className="font-display text-lg font-semibold tracking-tight sm:text-xl">
            My Support Buddy
          </span>
        </Link>
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <ReadPageAloudButton />
          <AccessibilityControls />
        </div>
      </div>
    </header>
  );
}

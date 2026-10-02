import Link from "next/link";
import AccessibilityControls from "@/components/AccessibilityControls";
import ReadPageAloudButton from "@/components/ReadPageAloudButton";
import BrandMark from "@/components/BrandMark";

export default function SiteHeader() {
  return (
    <header className="no-print sticky top-0 z-30 border-b-2 border-border bg-surface">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-3 py-2.5 sm:px-4 sm:py-3">
        <Link
          href="/"
          className="font-display flex shrink-0 items-center gap-2 text-lg font-bold text-foreground sm:gap-2.5 sm:text-xl md:text-2xl"
        >
          <BrandMark className="h-9 w-9 sm:h-10 sm:w-10" />
          My Support Buddy
        </Link>
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <ReadPageAloudButton />
          <AccessibilityControls />
        </div>
      </div>
    </header>
  );
}

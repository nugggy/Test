import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="no-print border-t-2 border-border bg-surface py-6">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 text-sm text-muted">
        <p>Free, forever. No ads, no data sold.</p>
        <nav className="flex flex-wrap gap-4">
          <Link href="/suggestions" className="font-semibold text-brand hover:underline">
            Suggest a tool
          </Link>
          <Link href="/support" className="font-semibold text-brand hover:underline">
            Support us
          </Link>
          <Link href="/disclaimer" className="font-semibold text-brand hover:underline">
            Disclaimer
          </Link>
          <Link href="/terms" className="font-semibold text-brand hover:underline">
            Terms of Use
          </Link>
          <Link href="/privacy" className="font-semibold text-brand hover:underline">
            Privacy Policy
          </Link>
        </nav>
      </div>
    </footer>
  );
}

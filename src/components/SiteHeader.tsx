import Link from "next/link";
import AccessibilityControls from "@/components/AccessibilityControls";
import ReadPageAloudButton from "@/components/ReadPageAloudButton";
import { createClient } from "@/lib/supabase/server";

export default async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="no-print sticky top-0 z-30 border-b-2 border-border bg-surface">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-3 py-2.5 sm:px-4 sm:py-3">
        <Link
          href="/"
          className="font-display flex shrink-0 items-center gap-2 text-lg font-bold text-foreground sm:gap-2.5 sm:text-xl md:text-2xl"
        >
          <span
            aria-hidden="true"
            className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-lg text-brand-ink sm:h-10 sm:w-10 sm:text-xl"
          >
            ✦
          </span>
          Toolkit
        </Link>
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <Link
            href={user ? "/account" : "/sign-in"}
            className="touch-target hidden items-center rounded-xl border-2 border-border bg-surface px-4 font-semibold hover:border-brand sm:flex"
          >
            {user ? "My account" : "Sign in"}
          </Link>
          <ReadPageAloudButton />
          <AccessibilityControls />
        </div>
      </div>
    </header>
  );
}

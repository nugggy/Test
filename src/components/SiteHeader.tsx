import Link from "next/link";
import AccessibilityControls from "@/components/AccessibilityControls";
import { createClient } from "@/lib/supabase/server";

export default async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="no-print border-b-2 border-border bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link
          href="/"
          className="font-display text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2"
        >
          <span
            aria-hidden="true"
            className="grid h-10 w-10 place-items-center rounded-xl bg-brand text-brand-ink text-xl"
          >
            ✦
          </span>
          Toolkit
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href={user ? "/account" : "/sign-in"}
            className="touch-target hidden items-center rounded-xl border-2 border-border bg-surface px-4 font-semibold hover:border-brand sm:flex"
          >
            {user ? "My account" : "Sign in"}
          </Link>
          <AccessibilityControls />
        </div>
      </div>
    </header>
  );
}

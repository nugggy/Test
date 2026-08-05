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
    <header className="no-print border-b-2 border-border bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link
          href="/"
          className="font-display text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2.5"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/dundaloo-logo.svg"
            alt="Dundaloo"
            className="h-8 w-auto sm:h-9"
          />
          <span className="border-l-2 border-border pl-2.5">Toolkit</span>
        </Link>
        <div className="flex items-center gap-2">
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

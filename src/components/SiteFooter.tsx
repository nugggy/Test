import Link from "next/link";
import BrandMark from "@/components/BrandMark";

const GROUPS = [
  {
    heading: "Get involved",
    links: [
      { href: "/suggestions", label: "Suggest a tool" },
      { href: "/support", label: "Support us" },
    ],
  },
  {
    heading: "The fine print",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Use" },
      { href: "/disclaimer", label: "Disclaimer" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="no-print mt-16 bg-ink-block text-ink-block-fg">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <BrandMark className="h-11 w-11" />
            <span className="font-display text-xl font-semibold tracking-tight">My Support Buddy</span>
          </div>
          <p className="mt-4 max-w-sm text-ink-block-muted">
            Free, practical tools for people with disability, families and
            the people who support them. Everything you enter stays on your
            own device.
          </p>
        </div>
        {GROUPS.map((group) => (
          <nav key={group.heading} aria-label={group.heading}>
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-ink-block-accent">
              {group.heading}
            </h2>
            <ul className="mt-3 space-y-1">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-11 items-center text-ink-block-fg underline-offset-4 hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-ink-block-muted/20">
        <p className="mx-auto max-w-7xl px-4 py-5 text-sm text-ink-block-muted">
          Free, forever. No ads, no accounts, no data sold. Made with care in
          New South Wales, Australia.
        </p>
      </div>
    </footer>
  );
}

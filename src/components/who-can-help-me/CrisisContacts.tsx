import Link from "next/link";
import { SERVICES } from "@/lib/who-can-help-data";

interface CrisisContactsProps {
  /** Service ids from SERVICES, in the order to show them. Numbers always
   * come from who-can-help-data.ts so there is one place to keep them right. */
  ids?: string[];
  title?: string;
  /** Show a link to the full Who Can Help Me? directory underneath. */
  showDirectoryLink?: boolean;
  className?: string;
}

const DEFAULT_IDS = ["emergency", "lifeline", "kids-helpline", "13yarn", "beyond-blue"];

/**
 * A compact, tappable list of Australian crisis and support lines, reused by
 * the emotions and wellbeing tools wherever someone might need help quickly.
 * Prints as plain text so a printed plan still shows the numbers.
 */
export default function CrisisContacts({
  ids = DEFAULT_IDS,
  title = "Need to talk to someone now?",
  showDirectoryLink = true,
  className = "",
}: CrisisContactsProps) {
  const services = ids
    .map((id) => SERVICES.find((s) => s.id === id))
    .filter((s): s is (typeof SERVICES)[number] => Boolean(s));

  return (
    <section
      aria-label={title}
      className={`print-avoid-break rounded-2xl border-2 border-accent bg-accent-soft p-4 ${className}`}
    >
      <h3 className="font-display text-base font-bold">{title}</h3>
      <p className="mb-3 text-sm">
        If you or someone else is in danger right now, call{" "}
        <a href="tel:000" className="font-bold underline">
          000
        </a>
        .
      </p>
      <ul className="grid gap-2 sm:grid-cols-2">
        {services.map((service) => (
          <li key={service.id}>
            <a
              href={`tel:${service.phone.replace(/\s/g, "")}`}
              className="touch-target flex flex-col justify-center rounded-xl border-2 border-border bg-surface px-4 py-2 hover:border-brand"
            >
              <span className="font-bold">
                <span aria-hidden="true">📞 </span>
                {service.name}: {service.phone}
              </span>
              <span className="text-sm text-muted">
                {service.hours}
                {service.id === "kids-helpline" ? ", ages 5 to 25" : ""}
                {service.id === "13yarn"
                  ? ", for Aboriginal and Torres Strait Islander people"
                  : ""}
              </span>
            </a>
          </li>
        ))}
      </ul>
      {showDirectoryLink && (
        <p className="no-print mt-3 text-sm">
          <Link
            href="/tools/who-can-help-me"
            className="font-semibold text-brand underline hover:no-underline"
          >
            See more services on Who Can Help Me?
          </Link>
        </p>
      )}
    </section>
  );
}

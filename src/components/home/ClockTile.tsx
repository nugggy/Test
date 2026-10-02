"use client";

import Link from "next/link";
import { useClockTime } from "@/lib/use-clock-time";
import { useTimezone } from "@/lib/timezone-context";

function partOfDay(hour: number): { label: string; icon: string } {
  if (hour < 5) return { label: "Night time", icon: "🌙" };
  if (hour < 12) return { label: "Morning", icon: "🌅" };
  if (hour < 17) return { label: "Afternoon", icon: "☀️" };
  if (hour < 21) return { label: "Evening", icon: "🌇" };
  return { label: "Night time", icon: "🌙" };
}

/**
 * Homepage bento tile: a live, easy-read clock (a taste of the Easy-Read
 * Clock tool). Shows nothing time-specific until mounted, so server and
 * client markup always match.
 */
export default function ClockTile() {
  const { timezone } = useTimezone();
  const t = useClockTime(timezone);
  const ready = t.weekday !== "";
  const hour12 = t.hour % 12 === 0 ? 12 : t.hour % 12;
  const ampm = t.hour < 12 ? "am" : "pm";
  const pod = partOfDay(t.hour);

  return (
    <Link
      href="/tools/easy-read-clock"
      className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl bg-accent p-5 text-accent-ink sm:p-6"
      aria-label={ready ? `It is ${hour12}:${String(t.minute).padStart(2, "0")} ${ampm}, ${t.weekday} ${pod.label}. Open the Easy-Read Clock.` : "Open the Easy-Read Clock"}
    >
      <AnalogFace hour={t.hour} minute={t.minute} ready={ready} />
      <p className="relative text-sm font-semibold uppercase tracking-wider">Right now</p>
      <div aria-hidden="true" className="relative">
        <p className="font-display tabular mt-2 text-5xl font-semibold tracking-tight sm:text-6xl">
          {ready ? (
            <>
              {hour12}:{String(t.minute).padStart(2, "0")}
              <span className="ml-1 text-2xl">{ampm}</span>
            </>
          ) : (
            "--:--"
          )}
        </p>
        <p className="mt-1 text-lg font-semibold">
          {ready ? (
            <>
              <span className="mr-1">{pod.icon}</span>
              {t.weekday} {pod.label.toLowerCase()}
            </>
          ) : (
            " "
          )}
        </p>
      </div>
      <span className="relative mt-3 inline-flex items-center gap-1 text-sm font-semibold group-hover:underline">
        Easy-Read Clock <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}

/** Decorative clock face in the tile's corner, hands set to the real time. */
function AnalogFace({ hour, minute, ready }: { hour: number; minute: number; ready: boolean }) {
  const minuteDeg = ready ? minute * 6 : 0;
  const hourDeg = ready ? (hour % 12) * 30 + minute * 0.5 : 300;
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      className="deco pointer-events-none absolute -right-5 -top-5 h-32 w-32 transition-transform duration-500 group-hover:rotate-6 sm:h-36 sm:w-36"
    >
      <circle cx="50" cy="50" r="44" fill="var(--accent-ink)" opacity="0.08" />
      <circle cx="50" cy="50" r="36" fill="#ffffff" opacity="0.55" />
      {Array.from({ length: 12 }, (_, i) => (
        <rect
          key={i}
          x="49"
          y="17"
          width="2"
          height={i % 3 === 0 ? 7 : 4}
          rx="1"
          fill="var(--accent-ink)"
          transform={`rotate(${i * 30} 50 50)`}
        />
      ))}
      <path
        d="M50 50 V31"
        stroke="var(--accent-ink)"
        strokeWidth="5"
        strokeLinecap="round"
        transform={`rotate(${hourDeg} 50 50)`}
      />
      <path
        d="M50 50 V22"
        stroke="var(--brand)"
        strokeWidth="3"
        strokeLinecap="round"
        transform={`rotate(${minuteDeg} 50 50)`}
      />
      <circle cx="50" cy="50" r="4" fill="var(--accent-ink)" />
    </svg>
  );
}

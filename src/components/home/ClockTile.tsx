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
      className="group flex h-full flex-col justify-between rounded-3xl bg-accent p-5 text-accent-ink sm:p-6"
      aria-label={ready ? `It is ${hour12}:${String(t.minute).padStart(2, "0")} ${ampm}, ${t.weekday} ${pod.label}. Open the Easy-Read Clock.` : "Open the Easy-Read Clock"}
    >
      <p className="text-sm font-semibold uppercase tracking-wider">Right now</p>
      <div aria-hidden="true">
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
      <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold group-hover:underline">
        Easy-Read Clock <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}

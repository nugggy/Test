interface CategoryBreakdownChartProps {
  data: {
    label: string;
    count: number;
    color?: string;
    /** Overrides the trailing number shown (e.g. "92%") - the bar's width
     * still comes from `count`. */
    displayValue?: string;
    /** Overrides the auto-generated aria-label for the bar. */
    ariaLabel?: string;
  }[];
  emptyMessage: string;
  unit?: string;
}

/**
 * Horizontal bar breakdown - reused across dashboards (seizure type/
 * trigger/severity, medication adherence, ...). Each bar carries a visible
 * value label so it never depends on colour alone.
 */
export default function CategoryBreakdownChart({
  data,
  emptyMessage,
  unit = "entry",
}: CategoryBreakdownChartProps) {
  if (data.length === 0) {
    return (
      <p className="rounded-xl border-2 border-dashed border-border p-6 text-center text-muted">
        {emptyMessage}
      </p>
    );
  }

  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="flex flex-col gap-3">
      {data.map(({ label, count, color, displayValue, ariaLabel }) => (
        <div key={label} className="flex items-center gap-3">
          <span className="w-24 shrink-0 truncate text-sm font-semibold sm:w-36" title={label}>
            {label}
          </span>
          <div
            className="h-6 flex-1 overflow-hidden rounded-full bg-background"
            role="img"
            aria-label={ariaLabel ?? `${label}: ${count} ${count === 1 ? unit : `${unit}s`}`}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.max((count / max) * 100, 6)}%`,
                backgroundColor: color ?? "var(--brand)",
              }}
            />
          </div>
          <span className="w-10 shrink-0 text-right text-sm font-bold text-muted">
            {displayValue ?? count}
          </span>
        </div>
      ))}
    </div>
  );
}

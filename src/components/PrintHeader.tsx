interface PrintHeaderProps {
  title: string;
}

/**
 * A letterhead block that only appears when a tool page is printed / saved
 * as a PDF - invisible on screen, so it doesn't duplicate the on-screen
 * <h1>. Give every printable tool page a consistent, professional-looking
 * header instead of the raw print-out of app chrome.
 */
export default function PrintHeader({ title }: PrintHeaderProps) {
  const generatedOn = new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="mb-4 hidden items-center justify-between border-b-2 border-black pb-3 print:flex">
      <div className="flex items-center gap-2.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/dundaloo-logo.svg" alt="Dundaloo" className="h-8 w-auto" />
        <span className="text-lg font-bold">{title}</span>
      </div>
      <span className="text-xs">Generated {generatedOn}</span>
    </div>
  );
}

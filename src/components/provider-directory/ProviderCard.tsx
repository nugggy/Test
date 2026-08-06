import type { ProviderListing } from "@/lib/provider-directory-data";

interface ProviderCardProps {
  listing: ProviderListing;
}

export default function ProviderCard({ listing }: ProviderCardProps) {
  return (
    <div className="print-avoid-break rounded-2xl border-2 border-border bg-surface p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="font-display text-lg font-bold">{listing.businessName}</h3>
        <span className="rounded-full bg-background px-2.5 py-0.5 text-xs font-semibold text-muted">
          {listing.state}
        </span>
      </div>
      {listing.contactName && <p className="text-sm text-muted">{listing.contactName}</p>}
      <p className="mt-1 text-sm">
        <span className="font-semibold">Service area: </span>
        {listing.serviceArea}
      </p>
      {listing.specialties.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {listing.specialties.map((s) => (
            <span
              key={s}
              className="rounded-full border-2 border-border bg-background px-2.5 py-0.5 text-xs font-semibold"
            >
              {s}
            </span>
          ))}
        </div>
      )}
      {listing.description && <p className="mt-2 text-sm">{listing.description}</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        {listing.phone && (
          <a
            href={`tel:${listing.phone.replace(/\s/g, "")}`}
            className="touch-target inline-flex items-center rounded-xl border-2 border-brand bg-brand px-4 text-sm font-bold text-brand-ink"
          >
            📞 {listing.phone}
          </a>
        )}
        {listing.email && (
          <a
            href={`mailto:${listing.email}`}
            className="touch-target inline-flex items-center rounded-xl border-2 border-border bg-background px-4 text-sm font-semibold hover:border-brand"
          >
            ✉️ Email
          </a>
        )}
        {listing.website && (
          <a
            href={listing.website.startsWith("http") ? listing.website : `https://${listing.website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="touch-target inline-flex items-center rounded-xl border-2 border-border bg-background px-4 text-sm font-semibold hover:border-brand"
          >
            🔗 Website
          </a>
        )}
      </div>
    </div>
  );
}

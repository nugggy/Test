"use client";

import { useFavourites } from "@/lib/favourites-storage";
import { tools } from "@/lib/tools";

interface FavouriteToggleButtonProps {
  slug: string;
}

export default function FavouriteToggleButton({ slug }: FavouriteToggleButtonProps) {
  const { favourites, toggleFavourite } = useFavourites();
  const tool = tools.find((t) => t.slug === slug);
  const favourited = favourites.has(slug);

  return (
    <button
      type="button"
      onClick={() => toggleFavourite(slug)}
      aria-pressed={favourited}
      aria-label={
        favourited
          ? `Remove ${tool?.name ?? "this tool"} from favourites`
          : `Add ${tool?.name ?? "this tool"} to favourites`
      }
      className="no-print touch-target group inline-flex items-center justify-center rounded-full"
    >
      {/* Visible pill is 44px tall; the tappable area stays the full 88px. */}
      <span
        className={`inline-flex h-11 items-center gap-2 rounded-full border-2 px-5 text-sm font-semibold transition-colors ${
          favourited ? "border-brand bg-brand-soft text-foreground" : "border-border-strong bg-surface group-hover:border-brand"
        }`}
      >
        <span aria-hidden="true">{favourited ? "❤️" : "🤍"}</span>
        {favourited ? "Favourited" : "Add to favourites"}
      </span>
    </button>
  );
}

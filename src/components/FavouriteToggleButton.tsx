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
      className={`no-print touch-target mb-4 inline-flex items-center gap-2 rounded-xl border-2 px-4 text-sm font-semibold ${
        favourited ? "border-brand bg-brand text-brand-ink" : "border-border bg-surface"
      }`}
    >
      <span aria-hidden="true">{favourited ? "❤️" : "🤍"}</span>
      {favourited ? "Favourited" : "Add to favourites"}
    </button>
  );
}

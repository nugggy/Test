interface FavouriteHeartProps {
  favourited: boolean;
  /** Increments on each tap, so the pop replays only when someone taps
   * (never when saved favourites load in). 0 means "not tapped yet". */
  popKey: number;
}

/**
 * The heart inside a favourite button. Tapping it on gives a springy pop
 * and a ring bursting outwards (switched off by the motion settings).
 */
export default function FavouriteHeart({ favourited, popKey }: FavouriteHeartProps) {
  const popping = favourited && popKey > 0;
  return (
    <span aria-hidden="true" className="relative inline-grid place-items-center">
      {popping && (
        <span
          key={`ring-${popKey}`}
          className="deco heart-ring pointer-events-none absolute inset-[-6px] rounded-full border-2 border-brand"
        />
      )}
      <span key={popKey} className={popping ? "heart-pop inline-block" : "inline-block"}>
        {favourited ? "❤️" : "🤍"}
      </span>
    </span>
  );
}

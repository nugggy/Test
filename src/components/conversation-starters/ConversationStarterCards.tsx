"use client";

import { useMemo, useState } from "react";
import {
  CARD_CATEGORIES,
  DEFAULT_CARDS,
  type CardCategoryId,
  type ConversationCard,
} from "@/lib/conversation-starter-data";
import { useCustomCards, useFavouriteCards } from "@/lib/conversation-starter-storage";
import { useSpeech } from "@/lib/use-speech";

type FilterId = CardCategoryId | "all" | "favourites-only";

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function ConversationStarterCards() {
  const { speak, supported: speechSupported } = useSpeech();
  const { favourites, toggleFavourite, isFavourite } = useFavouriteCards();
  const { customCards, addCustomCard, removeCustomCard } = useCustomCards();

  const allCards = useMemo(() => [...DEFAULT_CARDS, ...customCards], [customCards]);

  const [filter, setFilter] = useState<FilterId>("all");
  const [order, setOrder] = useState<string[]>(() => allCards.map((c) => c.id));
  const [index, setIndex] = useState(0);
  const [newText, setNewText] = useState("");
  const [newCategory, setNewCategory] = useState<CardCategoryId>("interests");
  const [addedMessage, setAddedMessage] = useState("");

  const filteredCards = useMemo(() => {
    const source =
      filter === "all"
        ? allCards
        : filter === "favourites-only"
          ? allCards.filter((c) => favourites.includes(c.id))
          : allCards.filter((c) => c.categoryId === filter);
    const byId = new Map(source.map((c) => [c.id, c]));
    // Keep the current shuffled order where possible, then append anything
    // new that order doesn't know about yet.
    const ordered = order.map((id) => byId.get(id)).filter((c): c is ConversationCard => Boolean(c));
    const missing = source.filter((c) => !order.includes(c.id));
    return [...ordered, ...missing];
  }, [allCards, favourites, filter, order]);

  const total = filteredCards.length;
  const position = total > 0 ? ((index % total) + total) % total : 0;
  const currentCard = total > 0 ? filteredCards[position] : null;
  const currentCategory = currentCard
    ? CARD_CATEGORIES.find((c) => c.id === currentCard.categoryId)
    : undefined;

  function handleFilterChange(next: FilterId) {
    setFilter(next);
    setIndex(0);
  }

  function handleShuffle() {
    setOrder(shuffle(allCards.map((c) => c.id)));
    setIndex(0);
  }

  function handleNext() {
    setIndex((i) => i + 1);
  }

  function handlePrevious() {
    setIndex((i) => i - 1);
  }

  function handleAddCard(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = newText.trim();
    if (!trimmed) return;
    const card: ConversationCard = {
      id: `custom-${Date.now()}`,
      text: trimmed,
      categoryId: newCategory,
      custom: true,
    };
    addCustomCard(card);
    setOrder((prev) => [...prev, card.id]);
    setNewText("");
    const categoryName = CARD_CATEGORIES.find((c) => c.id === newCategory)?.name ?? "";
    setAddedMessage(`Card added to ${categoryName}.`);
  }

  return (
    <div className="flex flex-col gap-6">
      <div role="group" aria-label="Filter by category" className="no-print flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => handleFilterChange("all")}
          aria-pressed={filter === "all"}
          className={`touch-target rounded-full border-2 px-4 text-sm font-semibold ${
            filter === "all" ? "border-brand bg-brand text-brand-ink" : "border-border bg-background"
          }`}
        >
          All
        </button>
        {CARD_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => handleFilterChange(cat.id)}
            aria-pressed={filter === cat.id}
            className={`touch-target rounded-full border-2 px-4 text-sm font-semibold ${
              filter === cat.id ? "border-brand bg-brand text-brand-ink" : "border-border bg-background"
            }`}
          >
            <span aria-hidden="true">{cat.icon}</span> {cat.name}
          </button>
        ))}
        <button
          type="button"
          onClick={() => handleFilterChange("favourites-only")}
          aria-pressed={filter === "favourites-only"}
          className={`touch-target rounded-full border-2 px-4 text-sm font-semibold ${
            filter === "favourites-only"
              ? "border-brand bg-brand text-brand-ink"
              : "border-border bg-background"
          }`}
        >
          ⭐ My favourites
        </button>
      </div>

      {!currentCard ? (
        <p className="rounded-xl border-2 border-dashed border-border p-10 text-center text-muted">
          {filter === "favourites-only"
            ? "No favourites yet. Tap Save to favourites on a card to keep it here."
            : "No cards in this category yet."}
        </p>
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-2xl border-2 border-brand bg-surface p-6 text-center sm:p-8">
          <div aria-live="polite" className="flex flex-col items-center gap-3">
            <span className="text-sm font-semibold text-muted">
              Card {position + 1} of {total}
              {currentCategory ? ` · ${currentCategory.name}` : ""}
            </span>
            {currentCategory && (
              <span aria-hidden="true" className="text-6xl leading-none">
                {currentCategory.icon}
              </span>
            )}
            <p className="font-display text-2xl font-bold sm:text-3xl">{currentCard.text}</p>
          </div>
          <div className="no-print flex flex-wrap justify-center gap-2">
            {speechSupported && (
              <button
                type="button"
                onClick={() => speak(currentCard.text)}
                className="touch-target rounded-xl border-2 border-brand bg-brand px-4 font-semibold text-brand-ink"
              >
                🔊 Hear this
              </button>
            )}
            {speechSupported && (
              <button
                type="button"
                onClick={() => speak("What about you?")}
                className="touch-target rounded-xl border-2 border-border bg-background px-4 font-semibold"
              >
                🔁 Ask back: &quot;What about you?&quot;
              </button>
            )}
            <button
              type="button"
              onClick={() => toggleFavourite(currentCard.id)}
              aria-pressed={isFavourite(currentCard.id)}
              className="touch-target rounded-xl border-2 border-border bg-background px-4 text-sm font-semibold"
            >
              {isFavourite(currentCard.id) ? "⭐ Saved" : "☆ Save to favourites"}
            </button>
            {currentCard.custom && (
              <button
                type="button"
                onClick={() => {
                  if (!window.confirm("Delete this card? This can't be undone.")) return;
                  removeCustomCard(currentCard.id);
                  setOrder((prev) => prev.filter((id) => id !== currentCard.id));
                }}
                className="touch-target rounded-xl border-2 border-border bg-background px-4 text-sm font-semibold"
              >
                🗑️ Delete
              </button>
            )}
          </div>
          <div className="no-print flex w-full flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={total < 2}
              className="touch-target rounded-xl border-2 border-border bg-background px-4 font-semibold disabled:opacity-40"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={handleShuffle}
              className="touch-target rounded-xl border-2 border-border bg-background px-4 font-semibold"
            >
              🔀 Shuffle
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={total < 2}
              className="touch-target rounded-xl border-2 border-brand bg-brand px-6 font-bold text-brand-ink disabled:opacity-40"
            >
              Next card →
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={handleAddCard}
        className="no-print flex flex-col gap-3 rounded-2xl border-2 border-dashed border-border p-4"
      >
        <h2 className="font-display text-lg font-bold">Add your own card</h2>
        <label htmlFor="new-card-text" className="text-sm font-semibold">
          Your question
        </label>
        <textarea
          id="new-card-text"
          value={newText}
          onChange={(e) => {
            setNewText(e.target.value);
            setAddedMessage("");
          }}
          placeholder="e.g. What's the best trip you've ever been on?"
          rows={2}
          maxLength={200}
          className="w-full rounded-xl border-2 border-border bg-background px-4 py-3"
        />
        <span id="new-card-category-label" className="text-sm font-semibold">
          Which group does it go in?
        </span>
        <div role="group" aria-labelledby="new-card-category-label" className="flex flex-wrap gap-2">
          {CARD_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setNewCategory(cat.id)}
              aria-pressed={newCategory === cat.id}
              className={`touch-target rounded-full border-2 px-4 text-sm font-semibold ${
                newCategory === cat.id ? "border-brand bg-brand text-brand-ink" : "border-border bg-background"
              }`}
            >
              <span aria-hidden="true">{cat.icon}</span> {cat.name}
            </button>
          ))}
        </div>
        <button
          type="submit"
          disabled={!newText.trim()}
          className="touch-target self-start rounded-xl border-2 border-brand bg-brand px-4 font-semibold text-brand-ink disabled:opacity-40"
        >
          + Add card
        </button>
        <p aria-live="polite" className="min-h-[1.25rem] text-sm text-muted">
          {addedMessage}
        </p>
      </form>
    </div>
  );
}

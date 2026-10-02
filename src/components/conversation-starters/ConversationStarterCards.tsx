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

  const currentCard = filteredCards[index % Math.max(filteredCards.length, 1)] ?? null;

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
            ? "No favourites yet - tap the star on a card to save it here."
            : "No cards in this category yet."}
        </p>
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-2xl border-2 border-brand bg-surface p-8 text-center">
          <span className="text-sm font-semibold text-muted">
            {CARD_CATEGORIES.find((c) => c.id === currentCard.categoryId)?.name}
          </span>
          <p className="font-display text-2xl font-bold">{currentCard.text}</p>
          <div className="no-print flex flex-wrap justify-center gap-2">
            {speechSupported && (
              <button
                type="button"
                onClick={() => speak(currentCard.text)}
                className="touch-target rounded-xl border-2 border-border bg-background px-4 text-sm font-semibold"
              >
                🔊 Hear this
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
                  removeCustomCard(currentCard.id);
                  setOrder((prev) => prev.filter((id) => id !== currentCard.id));
                }}
                className="touch-target rounded-xl border-2 border-border bg-background px-4 text-sm font-semibold"
              >
                🗑️ Delete
              </button>
            )}
          </div>
          <div className="no-print flex gap-2">
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
              className="touch-target rounded-xl border-2 border-brand bg-brand px-6 font-bold text-brand-ink"
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
        <textarea
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="e.g. What's the best trip you've ever been on?"
          rows={2}
          maxLength={200}
          className="w-full rounded-xl border-2 border-border bg-background px-4 py-3"
        />
        <div className="flex flex-wrap gap-2">
          {CARD_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setNewCategory(cat.id)}
              aria-pressed={newCategory === cat.id}
              className={`rounded-full border-2 px-3 py-1 text-xs font-semibold ${
                newCategory === cat.id ? "border-brand bg-brand text-brand-ink" : "border-border bg-background"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
        <button
          type="submit"
          className="touch-target self-start rounded-xl border-2 border-brand bg-brand px-4 font-semibold text-brand-ink"
        >
          + Add card
        </button>
      </form>
    </div>
  );
}

"use client";

import { useMemo, useRef, useState } from "react";
import {
  CATEGORIES,
  DEFAULT_ITEMS,
  type BoardItem,
  type CategoryId,
} from "@/lib/communication-board-data";
import {
  useCustomItems,
  useFavourites,
} from "@/lib/communication-board-storage";
import { useSpeech } from "@/lib/use-speech";
import BoardTile from "@/components/communication-board/BoardTile";
import PrintButton from "@/components/PrintButton";
import AddItemDialog from "@/components/communication-board/AddItemDialog";

type TabId = CategoryId | "favourites";

export default function CommunicationBoard() {
  const { speak, supported: speechSupported } = useSpeech();
  const { favourites, toggleFavourite, isFavourite } = useFavourites();
  const { customItems, addCustomItem, removeCustomItem } = useCustomItems();

  const [activeTab, setActiveTab] = useState<TabId>("food");
  const [message, setMessage] = useState<BoardItem[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);

  const allItems = useMemo(
    () => [...DEFAULT_ITEMS, ...customItems],
    [customItems]
  );

  const visibleItems = useMemo(() => {
    if (activeTab === "favourites") {
      return allItems.filter((item) => favourites.includes(item.id));
    }
    return allItems.filter((item) => item.categoryId === activeTab);
  }, [activeTab, allItems, favourites]);

  function handleTileSpeak(item: BoardItem) {
    speak(item.label);
    setMessage((prev) => [...prev, item]);
  }

  function handleSpeakMessage() {
    if (message.length === 0) return;
    speak(message.map((m) => m.label).join(", "));
  }

  function handleClearMessage() {
    setMessage([]);
  }

  async function toggleFullscreen() {
    if (!boardRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await boardRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {
      // Full-screen isn't available on some browsers/devices (e.g. some
      // iPad Safari contexts) — the tool still works at normal size.
    }
  }

  function handleAddItem(data: {
    label: string;
    emoji: string;
    categoryId: CategoryId;
  }) {
    addCustomItem({
      id: `custom-${Date.now()}`,
      label: data.label,
      emoji: data.emoji,
      categoryId: data.categoryId,
      custom: true,
    });
    setActiveTab(data.categoryId);
    setDialogOpen(false);
  }

  const activeCategory = CATEGORIES.find((c) => c.id === activeTab);
  const activeColorVar =
    activeTab === "favourites" ? "cat-favourites" : activeCategory?.colorVar ?? "cat-food";

  return (
    <div
      ref={boardRef}
      className="flex min-h-[70vh] flex-col rounded-2xl bg-background"
      style={isFullscreen ? { padding: "1rem" } : undefined}
    >
      {!speechSupported && (
        <p className="no-print mb-3 rounded-xl border-2 border-accent bg-accent/10 px-4 py-2 text-sm">
          This browser can&apos;t speak out loud, but you can still tap
          pictures and read the message strip.
        </p>
      )}

      {/* Message strip */}
      <div className="no-print mb-4 flex flex-wrap items-center gap-2 rounded-2xl border-2 border-border bg-surface p-3">
        <div
          className="flex min-h-[3.5rem] flex-1 flex-wrap items-center gap-2"
          aria-live="polite"
        >
          {message.length === 0 ? (
            <span className="text-muted">
              Tap pictures below to build a message…
            </span>
          ) : (
            message.map((item, i) => (
              <span
                key={`${item.id}-${i}`}
                className="flex items-center gap-1 rounded-full bg-background px-3 py-1.5 font-semibold"
              >
                <span aria-hidden="true">{item.emoji}</span>
                {item.label}
              </span>
            ))
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSpeakMessage}
            disabled={message.length === 0}
            className="touch-target rounded-xl border-2 border-brand bg-brand px-4 font-semibold text-brand-ink disabled:opacity-40"
          >
            🔊 Speak
          </button>
          <button
            type="button"
            onClick={handleClearMessage}
            disabled={message.length === 0}
            className="touch-target rounded-xl border-2 border-border bg-background px-4 font-semibold disabled:opacity-40"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="no-print mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setDialogOpen(true)}
          className="touch-target flex items-center gap-2 rounded-xl border-2 border-border bg-surface px-4 font-semibold hover:border-brand"
        >
          <span aria-hidden="true">➕</span> Add picture
        </button>
        <button
          type="button"
          onClick={toggleFullscreen}
          className="touch-target flex items-center gap-2 rounded-xl border-2 border-border bg-surface px-4 font-semibold hover:border-brand"
        >
          <span aria-hidden="true">{isFullscreen ? "🡼" : "⛶"}</span>{" "}
          {isFullscreen ? "Exit full screen" : "Full screen"}
        </button>
        <PrintButton label="Print board" />
      </div>

      {/* Category tabs */}
      <div
        role="tablist"
        aria-label="Board categories"
        className="no-print mb-4 flex gap-2 overflow-x-auto pb-1"
      >
        <button
          role="tab"
          aria-selected={activeTab === "favourites"}
          onClick={() => setActiveTab("favourites")}
          className="touch-target shrink-0 rounded-xl border-2 px-4 font-semibold"
          style={{
            borderColor:
              activeTab === "favourites" ? "var(--cat-favourites)" : "var(--border)",
            background:
              activeTab === "favourites" ? "var(--cat-favourites)" : "var(--surface)",
            color:
              activeTab === "favourites" ? "var(--cat-favourites-ink)" : "var(--foreground)",
          }}
        >
          ⭐ Favourites
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            role="tab"
            aria-selected={activeTab === cat.id}
            onClick={() => setActiveTab(cat.id)}
            className="touch-target shrink-0 rounded-xl border-2 px-4 font-semibold"
            style={{
              borderColor:
                activeTab === cat.id ? `var(--${cat.colorVar})` : "var(--border)",
              background:
                activeTab === cat.id ? `var(--${cat.colorVar})` : "var(--surface)",
              color:
                activeTab === cat.id
                  ? `var(--${cat.colorVar}-ink)`
                  : "var(--foreground)",
            }}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div
        role="tabpanel"
        className="grid flex-1 grid-cols-3 gap-3 content-start sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6"
      >
        {visibleItems.length === 0 ? (
          <p className="col-span-full py-10 text-center text-muted">
            {activeTab === "favourites"
              ? "No favourites yet — tap the star on any picture to add it here."
              : "No pictures in this category yet."}
          </p>
        ) : (
          visibleItems.map((item) => (
            <BoardTile
              key={item.id}
              item={item}
              colorVar={activeTab === "favourites" ? activeColorVar : (CATEGORIES.find(c => c.id === item.categoryId)?.colorVar ?? "cat-food")}
              isFavourite={isFavourite(item.id)}
              onSpeak={handleTileSpeak}
              onToggleFavourite={toggleFavourite}
              onRemove={item.custom ? removeCustomItem : undefined}
            />
          ))
        )}
      </div>

      <AddItemDialog
        open={dialogOpen}
        defaultCategoryId={activeTab === "favourites" ? "food" : activeTab}
        onClose={() => setDialogOpen(false)}
        onSave={handleAddItem}
      />
    </div>
  );
}

"use client";

import { useMemo, useRef, useState } from "react";
import {
  CATEGORIES,
  DEFAULT_ITEMS,
  QUICK_ITEM_IDS,
  type BoardItem,
  type CategoryId,
} from "@/lib/communication-board-data";
import {
  useCustomItems,
  useFavourites,
} from "@/lib/communication-board-storage";
import { useSpeech } from "@/lib/use-speech";
import { useFullscreenDisplay } from "@/lib/visual-timer-display";
import BoardTile from "@/components/communication-board/BoardTile";
import PrintButton from "@/components/PrintButton";
import AddItemDialog from "@/components/communication-board/AddItemDialog";

type TabId = CategoryId | "favourites";

const QUICK_ITEMS: BoardItem[] = QUICK_ITEM_IDS.map((id) =>
  DEFAULT_ITEMS.find((item) => item.id === id)
).filter((item): item is BoardItem => Boolean(item));

function colorVarFor(item: BoardItem) {
  return CATEGORIES.find((c) => c.id === item.categoryId)?.colorVar ?? "cat-food";
}

export default function CommunicationBoard() {
  const { speak, supported: speechSupported } = useSpeech();
  const { favourites, toggleFavourite, isFavourite } = useFavourites();
  const { customItems, addCustomItem, removeCustomItem } = useCustomItems();

  const [activeTab, setActiveTab] = useState<TabId>("food");
  const [message, setMessage] = useState<BoardItem[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);
  // Shared full-screen helper: native full screen where the browser
  // supports it, otherwise a page-covering overlay (iPhone Safari and the
  // Android app WebView), and it keeps the label right after Esc/back.
  const { isFullscreen, isOverlay, toggle: toggleFullscreen } = useFullscreenDisplay(boardRef);

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

  function handleUndo() {
    setMessage((prev) => prev.slice(0, -1));
  }

  function handleClearMessage() {
    setMessage([]);
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
      className={`flex min-h-[70vh] flex-col overflow-y-auto bg-background ${
        isOverlay ? "fixed inset-0 z-50 p-4" : "rounded-2xl"
      }`}
      style={isFullscreen && !isOverlay ? { padding: "1rem" } : undefined}
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
              Tap pictures below to build a message.
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
        <div className="flex flex-wrap gap-2">
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
            onClick={handleUndo}
            disabled={message.length === 0}
            aria-label="Undo the last picture in the message"
            className="touch-target rounded-xl border-2 border-border bg-background px-4 font-semibold disabled:opacity-40"
          >
            <span aria-hidden="true">⌫</span> Undo
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

      {/* Quick words: always in the same place, whatever tab is open, so
          the most urgent messages are never more than one tap away. */}
      <div className="no-print mb-4">
        <h2 className="mb-2 text-sm font-bold text-muted">Quick words</h2>
        <div className="grid grid-cols-4 gap-2">
          {QUICK_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleTileSpeak(item)}
              className="touch-target flex flex-col items-center justify-center gap-1 rounded-2xl border-2 border-black/10 p-2 text-center shadow-sm active:scale-95 transition-transform motion-reduce:transition-none motion-reduce:active:scale-100"
              style={{
                background: `var(--${colorVarFor(item)})`,
                color: `var(--${colorVarFor(item)}-ink)`,
              }}
            >
              <span aria-hidden="true" className="text-3xl leading-none">
                {item.emoji}
              </span>
              <span className="font-display text-sm font-bold leading-tight sm:text-base">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="no-print mb-2 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setEditing((v) => !v)}
          aria-pressed={editing}
          className={`touch-target flex items-center gap-2 rounded-xl border-2 px-4 font-semibold ${
            editing
              ? "border-brand bg-brand text-brand-ink"
              : "border-border bg-surface hover:border-brand"
          }`}
        >
          <span aria-hidden="true">{editing ? "✅" : "✏️"}</span>{" "}
          {editing ? "Finish editing" : "Edit board"}
        </button>
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
      <p aria-live="polite" className="no-print mb-2 min-h-[1.25rem] text-sm text-muted">
        {editing
          ? "Editing is on. Use the buttons under each picture to add favourites or delete your own pictures. Tap Finish editing when you are done."
          : ""}
      </p>

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
        aria-label={activeTab === "favourites" ? "Favourites" : activeCategory?.name}
        className="grid flex-1 grid-cols-3 gap-3 content-start sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6"
      >
        {visibleItems.length === 0 ? (
          <p className="col-span-full py-10 text-center text-muted">
            {activeTab === "favourites"
              ? "No favourites yet. Tap Edit board, then Add to favourites under any picture."
              : "No pictures in this category yet."}
          </p>
        ) : (
          visibleItems.map((item) => (
            <BoardTile
              key={item.id}
              item={item}
              colorVar={activeTab === "favourites" ? activeColorVar : colorVarFor(item)}
              isFavourite={isFavourite(item.id)}
              editing={editing}
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

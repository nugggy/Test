"use client";

import { useState } from "react";
import { convertToEasyRead, countWords, LONG_LINE_WORDS } from "@/lib/easy-read-convert";
import { makeLineId, useEasyReadDraft, type EasyReadLine } from "@/lib/easy-read-storage";
import { useSpeech } from "@/lib/use-speech";
import EmojiPicker from "@/components/EmojiPicker";
import PrintButton from "@/components/PrintButton";

const AI_LINKS = [
  { name: "Claude", url: "https://claude.ai" },
  { name: "ChatGPT", url: "https://chatgpt.com" },
  { name: "Microsoft Copilot", url: "https://copilot.microsoft.com" },
];

function buildAiPrompt(text: string) {
  return `Please rewrite the following text in Easy Read format, using Australian English: short, simple sentences, plain everyday words instead of jargon, one idea per line, and suggest a simple emoji for each line where it helps.\n\nText:\n${text}`;
}

function linesToPlainText(lines: EasyReadLine[]) {
  return lines
    .filter((l) => l.text.trim())
    .map((l) => (l.emoji ? `${l.emoji} ${l.text.trim()}` : l.text.trim()))
    .join("\n");
}

export default function EasyReadConverter() {
  const {
    draft,
    setInput,
    setLines,
    updateLine,
    removeLine,
    moveLine,
    addLineAfter,
    clearDraft,
  } = useEasyReadDraft();
  const { speak, stop, speaking, supported: speechSupported } = useSpeech();
  const [status, setStatus] = useState("");
  const [pickerFor, setPickerFor] = useState<string | null>(null);

  const { input, lines } = draft;
  const filledLines = lines.filter((l) => l.text.trim());

  function handleConvert(e: React.FormEvent) {
    e.preventDefault();
    if (
      lines.length > 0 &&
      !window.confirm("Convert again? This replaces the Easy Read lines below, including any changes you made.")
    ) {
      return;
    }
    const points = convertToEasyRead(input);
    setLines(points.map((p) => ({ id: makeLineId(), text: p.text, emoji: p.emoji })));
    setPickerFor(null);
    setStatus(`Made ${points.length} Easy Read ${points.length === 1 ? "line" : "lines"}. Check each one below.`);
  }

  async function copyText(text: string, doneMessage: string) {
    try {
      await navigator.clipboard.writeText(text);
      setStatus(doneMessage);
    } catch {
      // Clipboard access can fail (permissions, insecure context) - the
      // text is still visible on screen so it can be copied by hand.
      setStatus("Could not copy. You can select the text and copy it yourself.");
    }
  }

  function handleStartAgain() {
    if (!window.confirm("Start again? This clears your pasted text and the Easy Read lines.")) return;
    stop();
    clearDraft();
    setPickerFor(null);
    setStatus("Cleared.");
  }

  function handleAddLine(afterId: string | null) {
    addLineAfter(afterId);
    setStatus("New empty line added.");
  }

  return (
    <div className="flex flex-col gap-4">
      <form
        onSubmit={handleConvert}
        className="no-print rounded-2xl border-2 border-border bg-surface p-4"
      >
        <label htmlFor="easy-read-input" className="mb-1 block text-lg font-bold font-display">
          Paste your text
        </label>
        <textarea
          id="easy-read-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={8}
          maxLength={4000}
          placeholder="Paste or type the text you want to turn into Easy Read"
          className="w-full rounded-xl border-2 border-border bg-background px-4 py-3 text-base touch-target"
        />
        <p className="mt-1 text-sm text-muted">
          Your text stays on this device. It is saved here so you can come back to it.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={!input.trim()}
            className="touch-target rounded-xl border-2 border-brand bg-brand px-6 font-semibold text-brand-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            Convert to Easy Read
          </button>
          {(input || lines.length > 0) && (
            <button
              type="button"
              onClick={handleStartAgain}
              className="touch-target rounded-xl border-2 border-border bg-background px-4 font-semibold"
            >
              ↺ Start again
            </button>
          )}
        </div>
      </form>

      <p aria-live="polite" className="no-print min-h-[1.25rem] text-sm font-semibold">
        {status}
      </p>

      {lines.length > 0 && (
        <div className="rounded-2xl border-2 border-border bg-surface p-4">
          <div className="no-print mb-3 flex flex-col gap-3">
            <div>
              <h2 className="font-display text-lg font-bold">Check and edit your Easy Read</h2>
              <p className="text-sm text-muted">
                The automatic version is a starting point. Read each line, fix anything that
                doesn&apos;t make sense, and change or remove pictures. Aim for one idea per line.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {speechSupported && (
                <button
                  type="button"
                  onClick={() => (speaking ? stop() : speak(filledLines.map((l) => l.text).join("\n")))}
                  disabled={filledLines.length === 0}
                  className="touch-target rounded-xl border-2 border-border bg-background px-4 font-semibold disabled:opacity-40"
                >
                  {speaking ? "⏹️ Stop reading" : "🔊 Read all aloud"}
                </button>
              )}
              <button
                type="button"
                onClick={() => void copyText(linesToPlainText(lines), "Easy Read text copied.")}
                disabled={filledLines.length === 0}
                className="touch-target rounded-xl border-2 border-border bg-background px-4 font-semibold disabled:opacity-40"
              >
                📋 Copy text
              </button>
              <PrintButton disabled={filledLines.length === 0} />
            </div>
          </div>

          {/* On-screen editor */}
          <ol className="no-print flex flex-col gap-3">
            {lines.map((line, index) => {
              const words = countWords(line.text);
              const inputId = `easy-read-line-${line.id}`;
              return (
                <li
                  key={line.id}
                  className="flex flex-col gap-2 rounded-xl border-2 border-border bg-background p-3"
                >
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => setPickerFor(pickerFor === line.id ? null : line.id)}
                      aria-expanded={pickerFor === line.id}
                      aria-label={
                        line.emoji
                          ? `Change picture for line ${index + 1}`
                          : `Add a picture to line ${index + 1}`
                      }
                      className="touch-target grid shrink-0 place-items-center rounded-xl border-2 border-dashed border-border bg-surface text-4xl"
                    >
                      <span aria-hidden="true">{line.emoji ?? "➕"}</span>
                    </button>
                    <div className="flex-1">
                      <label htmlFor={inputId} className="mb-1 block text-sm font-semibold text-muted">
                        Line {index + 1}
                      </label>
                      <textarea
                        id={inputId}
                        value={line.text}
                        onChange={(e) => updateLine(line.id, { text: e.target.value })}
                        rows={2}
                        maxLength={300}
                        className="w-full rounded-xl border-2 border-border bg-surface px-3 py-2 text-lg"
                      />
                      {words > LONG_LINE_WORDS && (
                        <p className="mt-1 text-sm text-muted">
                          This line has {words} words. Try splitting it into two shorter lines.
                        </p>
                      )}
                    </div>
                  </div>

                  {pickerFor === line.id && (
                    <div className="rounded-xl border-2 border-border bg-surface p-3">
                      <EmojiPicker
                        value={line.emoji ?? ""}
                        onChange={(emoji) => updateLine(line.id, { emoji: emoji || null })}
                        label={`Picture for line ${index + 1}`}
                      />
                      <div className="mt-2 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            updateLine(line.id, { emoji: null });
                            setPickerFor(null);
                          }}
                          className="touch-target rounded-xl border-2 border-border bg-background px-4 text-sm font-semibold"
                        >
                          No picture
                        </button>
                        <button
                          type="button"
                          onClick={() => setPickerFor(null)}
                          className="touch-target rounded-xl border-2 border-brand bg-brand px-4 text-sm font-semibold text-brand-ink"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {speechSupported && (
                      <button
                        type="button"
                        onClick={() => speak(line.text)}
                        disabled={!line.text.trim()}
                        aria-label={`Read line ${index + 1} aloud`}
                        className="touch-target rounded-xl border-2 border-border bg-surface px-3 text-sm font-semibold disabled:opacity-40"
                      >
                        🔊 Hear
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => moveLine(line.id, "up")}
                      disabled={index === 0}
                      aria-label={`Move line ${index + 1} up`}
                      className="touch-target rounded-xl border-2 border-border bg-surface px-3 text-sm font-semibold disabled:opacity-40"
                    >
                      ▲ Up
                    </button>
                    <button
                      type="button"
                      onClick={() => moveLine(line.id, "down")}
                      disabled={index === lines.length - 1}
                      aria-label={`Move line ${index + 1} down`}
                      className="touch-target rounded-xl border-2 border-border bg-surface px-3 text-sm font-semibold disabled:opacity-40"
                    >
                      ▼ Down
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddLine(line.id)}
                      aria-label={`Add a new line after line ${index + 1}`}
                      className="touch-target rounded-xl border-2 border-border bg-surface px-3 text-sm font-semibold"
                    >
                      ➕ Line below
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        removeLine(line.id);
                        setStatus(`Line ${index + 1} deleted.`);
                      }}
                      aria-label={`Delete line ${index + 1}`}
                      className="touch-target rounded-xl border-2 border-border bg-surface px-3 text-sm font-semibold"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </li>
              );
            })}
          </ol>
          <button
            type="button"
            onClick={() => handleAddLine(null)}
            className="no-print touch-target mt-3 w-full rounded-xl border-2 border-dashed border-border bg-background font-semibold hover:border-brand"
          >
            ➕ Add a line at the end
          </button>

          {/* Clean version for printing */}
          <ul className="hidden flex-col gap-3 print:flex">
            {filledLines.map((line) => (
              <li
                key={line.id}
                className="print-avoid-break flex items-center gap-4 border-b border-border py-3"
              >
                <span aria-hidden="true" className="w-16 shrink-0 text-center text-5xl">
                  {line.emoji ?? ""}
                </span>
                <span className="text-xl">{line.text.trim()}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="no-print rounded-2xl border-2 border-border bg-surface p-4">
        <h2 className="font-display mb-2 text-lg font-bold">
          Want a better rewrite? Ask an AI
        </h2>
        <p className="mb-3 text-sm text-muted">
          This tool&apos;s conversion is simple word-swapping and sentence
          splitting, done entirely on your device. A general-purpose AI can
          do a much better job of genuine plain-English rewriting. Copy a
          ready-made prompt below, then paste it into whichever one you use.
          Remove names, addresses and other personal details first, because
          the text leaves your device when you paste it into an AI.
        </p>
        <button
          type="button"
          onClick={() => void copyText(buildAiPrompt(input), "AI prompt copied. Paste it into your AI tool.")}
          disabled={!input.trim()}
          className="touch-target mb-3 rounded-xl border-2 border-brand bg-brand px-4 text-sm font-semibold text-brand-ink disabled:cursor-not-allowed disabled:opacity-50"
        >
          📋 Copy prompt for AI
        </button>
        <div className="flex flex-wrap gap-2">
          {AI_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="touch-target inline-flex items-center rounded-xl border-2 border-border bg-background px-4 text-sm font-semibold hover:border-brand"
            >
              Open {link.name} ↗
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

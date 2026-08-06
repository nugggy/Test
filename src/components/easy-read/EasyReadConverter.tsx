"use client";

import { useMemo, useState } from "react";
import { convertToEasyRead } from "@/lib/easy-read-convert";
import PrintButton from "@/components/PrintButton";

const AI_LINKS = [
  { name: "Claude", url: "https://claude.ai" },
  { name: "ChatGPT", url: "https://chatgpt.com" },
  { name: "Microsoft Copilot", url: "https://copilot.microsoft.com" },
];

function buildAiPrompt(text: string) {
  return `Please rewrite the following text in Easy Read format: short, simple sentences, plain everyday words instead of jargon, one idea per line, and suggest a simple emoji for each line where it helps.\n\nText:\n${text}`;
}

export default function EasyReadConverter() {
  const [input, setInput] = useState("");
  const [convertedInput, setConvertedInput] = useState("");
  const [copied, setCopied] = useState(false);

  const points = useMemo(() => convertToEasyRead(convertedInput), [convertedInput]);

  function handleConvert(e: React.FormEvent) {
    e.preventDefault();
    setConvertedInput(input);
  }

  async function handleCopyPrompt() {
    try {
      await navigator.clipboard.writeText(buildAiPrompt(input));
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Clipboard access can fail (permissions, insecure context) — the
      // text is still visible on screen so it can be copied by hand.
    }
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
        <button
          type="submit"
          disabled={!input.trim()}
          className="touch-target mt-3 rounded-xl border-2 border-brand bg-brand px-6 font-semibold text-brand-ink disabled:cursor-not-allowed disabled:opacity-50"
        >
          Convert to Easy Read
        </button>
      </form>

      {points.length > 0 && (
        <div className="rounded-2xl border-2 border-border bg-surface p-4">
          <div className="no-print mb-3 flex justify-end">
            <PrintButton />
          </div>
          <ul className="flex flex-col gap-3">
            {points.map((point, i) => (
              <li
                key={i}
                className="print-avoid-break flex items-center gap-3 rounded-xl border-2 border-border bg-background p-4"
              >
                {point.emoji && (
                  <span aria-hidden="true" className="text-3xl">
                    {point.emoji}
                  </span>
                )}
                <span className="text-lg">{point.text}</span>
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
          do a much better job of genuine plain-English rewriting — copy a
          ready-made prompt below, then paste it into whichever one you use.
        </p>
        <button
          type="button"
          onClick={handleCopyPrompt}
          disabled={!input.trim()}
          className="touch-target mb-3 rounded-xl border-2 border-brand bg-brand px-4 text-sm font-semibold text-brand-ink disabled:cursor-not-allowed disabled:opacity-50"
        >
          {copied ? "Copied!" : "📋 Copy prompt for AI"}
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

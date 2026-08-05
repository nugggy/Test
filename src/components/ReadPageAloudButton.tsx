"use client";

import { useSpeech } from "@/lib/use-speech";

export default function ReadPageAloudButton() {
  const { speak, stop, speaking, supported } = useSpeech();

  if (!supported) return null;

  function handleClick() {
    if (speaking) {
      stop();
      return;
    }
    const main = document.getElementById("main-content");
    const text = main?.innerText?.trim();
    if (text) speak(text);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={speaking}
      aria-label={speaking ? "Stop reading this page aloud" : "Read this page aloud"}
      className="touch-target flex items-center gap-2 rounded-xl border-2 border-border bg-surface px-4 py-2 font-semibold hover:border-brand"
    >
      <span aria-hidden="true" className="text-xl">
        {speaking ? "⏹️" : "🔊"}
      </span>
      <span className="hidden sm:inline">
        {speaking ? "Stop reading" : "Read aloud"}
      </span>
    </button>
  );
}

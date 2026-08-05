"use client";

import { useCallback, useEffect, useState } from "react";

export function useSpeech() {
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    // Feature detection must happen client-side; window/speechSynthesis
    // don't exist during server rendering.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!supported) return;
      try {
        window.speechSynthesis.cancel(); // don't queue/overlap taps
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        window.speechSynthesis.speak(utterance);
      } catch {
        // Speech synthesis can fail silently on some browsers/devices —
        // the tile label is still visible, so communication isn't lost.
      }
    },
    [supported]
  );

  return { speak, supported };
}

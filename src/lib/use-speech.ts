"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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

function getSpeechRecognitionConstructor() {
  if (typeof window === "undefined") return undefined;
  return window.SpeechRecognition ?? window.webkitSpeechRecognition;
}

/**
 * Dictate short text (e.g. a custom board label) via the Web Speech API's
 * SpeechRecognition. Only Chrome/Edge/Safari support this today, so callers
 * must check `supported` and fall back to typing.
 */
export function useSpeechToText() {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSupported(Boolean(getSpeechRecognitionConstructor()));
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  const start = useCallback((onResult: (text: string) => void) => {
    const SpeechRecognitionCtor = getSpeechRecognitionConstructor();
    if (!SpeechRecognitionCtor) return;

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = "en-AU";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1]?.[0]?.transcript;
      if (transcript) onResult(transcript.trim());
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    try {
      recognition.start();
      setListening(true);
    } catch {
      // start() throws if a recognition session is already active — safe
      // to ignore, the existing session keeps running.
    }
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  return { supported, listening, start, stop };
}

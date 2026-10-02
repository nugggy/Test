"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { isAndroidApp, NativeSpeech } from "@/lib/native-app";

// Mobile browsers (particularly iOS Safari) have two well-known
// speechSynthesis bugs that mainly bite on longer text: the utterance can
// be silently garbage-collected mid-speech if nothing keeps a reference to
// it, and very long single utterances can just stop partway through or
// never start. Splitting into short, sentence-sized chunks queued as
// separate utterances - and keeping a ref to all of them - works around
// both. Short single-word/phrase speech (like the communication board)
// rarely hits either bug, which is why it can work while whole-page
// reading doesn't.
const MAX_CHUNK_LENGTH = 200;

function chunkText(text: string, maxLength = MAX_CHUNK_LENGTH): string[] {
  const sentences = text.match(/[^.!?\n]+[.!?]*\s*/g) ?? [text];
  const chunks: string[] = [];
  let current = "";
  for (const sentence of sentences) {
    if (current && (current.length + sentence.length) > maxLength) {
      chunks.push(current.trim());
      current = sentence;
    } else {
      current += sentence;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks.length > 0 ? chunks : [text];
}

/**
 * Text-to-speech for every "tap to speak" feature. In a browser it uses the
 * Web Speech API. Inside the Android app it uses the phone's own speech
 * engine through the native Speech plugin, because Android WebViews don't
 * implement window.speechSynthesis at all.
 */
export function useSpeech() {
  const [supported, setSupported] = useState(false);
  const [native, setNative] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const utterancesRef = useRef<SpeechSynthesisUtterance[]>([]);

  useEffect(() => {
    // Feature detection must happen client-side; window/speechSynthesis
    // don't exist during server rendering.
    const inApp = isAndroidApp();
    /* eslint-disable react-hooks/set-state-in-effect */
    setNative(inApp);
    setSupported(inApp || (typeof window !== "undefined" && "speechSynthesis" in window));
    /* eslint-enable react-hooks/set-state-in-effect */
    if (!inApp) return;

    const handles: Array<{ remove: () => Promise<void> }> = [];
    let cancelled = false;
    void Promise.all([
      NativeSpeech.addListener("speechStart", () => setSpeaking(true)),
      NativeSpeech.addListener("speechEnd", () => setSpeaking(false)),
    ])
      .then((hs) => {
        if (cancelled) hs.forEach((h) => void h.remove());
        else handles.push(...hs);
      })
      .catch(() => {
        // Older app versions without the plugin: speech just won't play.
      });
    return () => {
      cancelled = true;
      handles.forEach((h) => void h.remove());
    };
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!supported) return;
      if (native) {
        NativeSpeech.speak({ text, rate: 0.95 }).catch(() => setSpeaking(false));
        return;
      }
      try {
        window.speechSynthesis.cancel(); // don't queue/overlap taps

        const chunks = chunkText(text);
        const utterances = chunks.map((chunk, i) => {
          const utterance = new SpeechSynthesisUtterance(chunk);
          utterance.rate = 0.95;
          if (i === 0) utterance.onstart = () => setSpeaking(true);
          if (i === chunks.length - 1) utterance.onend = () => setSpeaking(false);
          utterance.onerror = () => setSpeaking(false);
          return utterance;
        });
        // Keep a live reference to every utterance for as long as they're
        // queued/speaking - some mobile browsers stop speech early if the
        // utterance object is garbage-collected first.
        utterancesRef.current = utterances;
        for (const utterance of utterances) window.speechSynthesis.speak(utterance);
      } catch {
        // Speech synthesis can fail silently on some browsers/devices -
        // the tile label is still visible, so communication isn't lost.
      }
    },
    [supported, native]
  );

  const stop = useCallback(() => {
    if (!supported) return;
    if (native) {
      NativeSpeech.stop().catch(() => undefined);
      setSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    utterancesRef.current = [];
    setSpeaking(false);
  }, [supported, native]);

  return { speak, stop, speaking, supported };
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
      // start() throws if a recognition session is already active - safe
      // to ignore, the existing session keeps running.
    }
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  return { supported, listening, start, stop };
}

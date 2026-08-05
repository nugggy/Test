"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type TextSize = "default" | "large" | "xl";
export type Contrast = "default" | "high";
export type FontChoice = "default" | "dyslexia";

interface AccessibilitySettings {
  textSize: TextSize;
  contrast: Contrast;
  font: FontChoice;
}

interface AccessibilityContextValue extends AccessibilitySettings {
  setTextSize: (v: TextSize) => void;
  setContrast: (v: Contrast) => void;
  setFont: (v: FontChoice) => void;
  reset: () => void;
}

const STORAGE_KEY = "dt:accessibility-settings:v1";

const DEFAULTS: AccessibilitySettings = {
  textSize: "default",
  contrast: "default",
  font: "default",
};

const AccessibilityContext = createContext<AccessibilityContextValue | null>(
  null
);

function readStoredSettings(): AccessibilitySettings {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULTS, ...parsed };
  } catch {
    // Corrupt or inaccessible storage — fall back to defaults rather than throwing.
    return DEFAULTS;
  }
}

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULTS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Reading localStorage must happen after mount (it doesn't exist on the
    // server), so this intentionally syncs client-only state on first paint.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSettings(readStoredSettings());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const root = document.documentElement;
    root.setAttribute("data-text-size", settings.textSize);
    root.setAttribute("data-contrast", settings.contrast);
    root.setAttribute("data-font", settings.font);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Storage may be unavailable (private browsing etc). Settings still
      // apply for this session via the DOM attributes above.
    }
  }, [settings, hydrated]);

  const value: AccessibilityContextValue = {
    ...settings,
    setTextSize: (textSize) => setSettings((s) => ({ ...s, textSize })),
    setContrast: (contrast) => setSettings((s) => ({ ...s, contrast })),
    setFont: (font) => setSettings((s) => ({ ...s, font })),
    reset: () => setSettings(DEFAULTS),
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) {
    throw new Error(
      "useAccessibility must be used within an AccessibilityProvider"
    );
  }
  return ctx;
}

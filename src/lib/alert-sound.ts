"use client";

/**
 * A short, generated three-beep alert - no audio file to fetch/bundle, so
 * it works fully offline like the rest of the app. Safe to call even where
 * the Web Audio API is unsupported or blocked (e.g. autoplay policies
 * before any user gesture) - it just silently does nothing.
 */
export function playAlertBeep() {
  try {
    const Ctor = window.AudioContext ?? window.webkitAudioContext;
    if (!Ctor) return;
    const ctx = new Ctor();
    const beepTimes = [0, 0.35, 0.7];
    for (const offset of beepTimes) {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = 880;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime + offset);
      gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + offset + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + offset + 0.25);
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start(ctx.currentTime + offset);
      oscillator.stop(ctx.currentTime + offset + 0.3);
    }
    // Close the context once the last beep finishes, rather than leaving it
    // open indefinitely.
    setTimeout(() => ctx.close().catch(() => {}), 1200);
  } catch {
    // Autoplay restrictions or an unsupported browser - the visual alert
    // (the timer reaching zero) still communicates that time is up.
  }
}

export function vibrateAlert() {
  try {
    navigator.vibrate?.([200, 100, 200, 100, 200]);
  } catch {
    // Vibration API isn't available on this device/browser - no-op.
  }
}

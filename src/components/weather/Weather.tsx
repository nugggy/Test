"use client";

import { useEffect, useState } from "react";
import { useWeatherSettings } from "@/lib/weather-storage";
import {
  getWeatherInfo,
  weatherTips,
  uvCategory,
  BACKGROUND_PRESETS,
  TEXT_COLOR_PRESETS,
  type ForecastData,
} from "@/lib/weather-data";
import { useTimezone } from "@/lib/timezone-context";
import { formatTime } from "@/lib/datetime";
import { useSpeech } from "@/lib/use-speech";
import LocationSearch from "./LocationSearch";

/** How often the forecast refreshes itself while the page stays open (for
 * a tablet used as a wall display). */
const REFRESH_MS = 30 * 60 * 1000;

function dayLabel(dateStr: string, index: number) {
  if (index === 0) return "Today";
  if (index === 1) return "Tomorrow";
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString("en-AU", { weekday: "short" });
}

const CHECKBOX_LABEL =
  "touch-target flex items-center gap-3 rounded-xl border-2 border-border bg-background px-3 text-sm font-semibold";

function SwatchRow({
  colours,
  value,
  onChange,
  labelPrefix,
}: {
  colours: string[];
  value: string;
  onChange: (c: string) => void;
  labelPrefix: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {colours.map((colour) => (
        <button
          key={colour}
          type="button"
          onClick={() => onChange(colour)}
          aria-label={`${labelPrefix} ${colour}`}
          aria-pressed={value === colour}
          className={`touch-target grid shrink-0 place-items-center rounded-xl border-2 ${
            value === colour ? "border-brand bg-brand-soft" : "border-border bg-background"
          }`}
        >
          <span
            aria-hidden="true"
            className="block h-10 w-10 rounded-full border-2 border-border"
            style={{ backgroundColor: colour }}
          />
        </button>
      ))}
      <label className="touch-target grid shrink-0 cursor-pointer place-items-center rounded-xl border-2 border-border bg-background px-2 text-center text-xs font-semibold">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={`${labelPrefix}: choose any colour`}
          className="h-10 w-10 cursor-pointer rounded-full border-2 border-border"
        />
        Other
      </label>
    </div>
  );
}

export default function Weather() {
  const { settings, updateField, resetStyle } = useWeatherSettings();
  const { timezone } = useTimezone();
  const { speak, stop, speaking, supported: speechSupported } = useSpeech();
  const [loaded, setLoaded] = useState<{ key: string; data: ForecastData } | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);

  // Which place/unit/length a forecast belongs to. A background refresh
  // keeps the old forecast on screen, but a new place or unit never shows
  // the previous one (that would be misleading).
  const requestKey = settings.location
    ? `${settings.location.latitude},${settings.location.longitude},${settings.unit},${settings.forecastDays}`
    : "";
  const forecast = loaded && loaded.key === requestKey ? loaded.data : null;

  // Refresh on a timer, and when the screen is shown again after a while,
  // so a forecast left open overnight doesn't go stale.
  useEffect(() => {
    if (!settings.location) return;
    const id = setInterval(() => setRefreshTick((t) => t + 1), REFRESH_MS);
    function handleVisibility() {
      if (
        document.visibilityState === "visible" &&
        fetchedAt &&
        Date.now() - new Date(fetchedAt).getTime() > REFRESH_MS
      ) {
        setRefreshTick((t) => t + 1);
      }
    }
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [settings.location, fetchedAt]);

  useEffect(() => {
    if (!settings.location) return;
    let cancelled = false;
    // Kicking off a fetch is exactly what this effect is for; the loading
    // flag just mirrors that fetch's state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatus("loading");
    const { latitude, longitude } = settings.location;
    const params = new URLSearchParams({
      latitude: String(latitude),
      longitude: String(longitude),
      current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m",
      daily:
        "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max",
      timezone: "auto",
      forecast_days: String(settings.forecastDays),
      temperature_unit: settings.unit,
      wind_speed_unit: "kmh",
    });
    fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Forecast request failed");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        const uv: unknown[] = Array.isArray(data.daily?.uv_index_max) ? data.daily.uv_index_max : [];
        setLoaded({
          key: `${latitude},${longitude},${settings.unit},${settings.forecastDays}`,
          data: {
          current: {
            temperature: data.current.temperature_2m,
            apparentTemperature: data.current.apparent_temperature,
            humidity: data.current.relative_humidity_2m,
            weatherCode: data.current.weather_code,
            windSpeedKmh: data.current.wind_speed_10m,
          },
          daily: data.daily.time.map((date: string, i: number) => ({
            date,
            weatherCode: data.daily.weather_code[i],
            maxTemp: data.daily.temperature_2m_max[i],
            minTemp: data.daily.temperature_2m_min[i],
            precipitationChance: data.daily.precipitation_probability_max[i] ?? 0,
            uvIndexMax: typeof uv[i] === "number" ? (uv[i] as number) : null,
          })),
          },
        });
        setFetchedAt(new Date().toISOString());
        setStatus("idle");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [settings.location, settings.forecastDays, settings.unit, refreshTick]);

  const unitSymbol = settings.unit === "celsius" ? "°C" : "°F";
  const today = forecast?.daily[0];
  const tips = today && settings.showTips ? weatherTips(today, settings.unit) : [];

  function speakForecast() {
    if (speaking) {
      stop();
      return;
    }
    if (!forecast || !settings.location) return;
    const info = getWeatherInfo(forecast.current.weatherCode);
    const degrees = settings.unit === "celsius" ? "degrees" : "degrees Fahrenheit";
    let phrase = `Weather in ${settings.location.name}. Right now it's ${info.label.toLowerCase()}, ${Math.round(
      forecast.current.temperature
    )} ${degrees}.`;
    if (today) {
      phrase += ` Today's top is ${Math.round(today.maxTemp)} and the low is ${Math.round(
        today.minTemp
      )}. The chance of rain is ${today.precipitationChance} percent.`;
    }
    if (tips.length > 0) phrase += ` ${tips.map((t) => t.text).join(" ")}`;
    const tomorrow = forecast.daily[1];
    if (tomorrow) {
      phrase += ` Tomorrow: ${getWeatherInfo(tomorrow.weatherCode).label.toLowerCase()}, top of ${Math.round(
        tomorrow.maxTemp
      )}.`;
    }
    speak(phrase);
  }

  const fs = (n: number) => ({ fontSize: `${n * settings.fontScale}rem` });

  return (
    <div className="flex flex-col gap-4">
      <LocationSearch onSelect={(location) => updateField("location", location)} />

      <div
        className="flex flex-col items-center gap-4 rounded-2xl border-2 border-border p-6 sm:p-8"
        style={{ backgroundColor: settings.backgroundColor, color: settings.textColor }}
      >
        {!settings.location ? (
          <p className="text-center" style={fs(1.1)}>
            Search for a suburb or town above, or use your location, to see the weather.
          </p>
        ) : status === "loading" && !forecast ? (
          <p aria-live="polite" className="text-center" style={fs(1.1)}>
            Loading weather for {settings.location.name}...
          </p>
        ) : status === "error" && !forecast ? (
          <div className="flex flex-col items-center gap-3 text-center">
            <p aria-live="polite" style={fs(1.1)}>
              Couldn&apos;t load the weather right now. Check your internet connection and
              try again.
            </p>
            <button
              type="button"
              onClick={() => setRefreshTick((t) => t + 1)}
              className="touch-target rounded-xl border-2 px-4 font-semibold"
              style={{ borderColor: settings.textColor, color: settings.textColor }}
            >
              Try again
            </button>
          </div>
        ) : forecast ? (
          <>
            <p className="font-semibold" style={fs(1.2)}>
              {settings.location.name}
              {settings.location.admin1 ? `, ${settings.location.admin1}` : ""}
            </p>
            <div className="text-center" style={{ ...fs(3.5), lineHeight: 1 }} aria-hidden="true">
              {getWeatherInfo(forecast.current.weatherCode).emoji}
            </div>
            <p
              className="font-display text-center font-extrabold tabular-nums"
              style={{ ...fs(3), lineHeight: 1 }}
            >
              {Math.round(forecast.current.temperature)}
              {unitSymbol}
            </p>
            <p className="text-center" style={fs(1.2)}>
              {getWeatherInfo(forecast.current.weatherCode).label}
            </p>
            {today && (
              <p className="text-center font-semibold" style={fs(1)}>
                Today: top {Math.round(today.maxTemp)}
                {unitSymbol}, low {Math.round(today.minTemp)}
                {unitSymbol}
              </p>
            )}

            <div
              className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-center"
              style={fs(0.95)}
            >
              {settings.showFeelsLike && (
                <span>
                  Feels like {Math.round(forecast.current.apparentTemperature)}
                  {unitSymbol}
                </span>
              )}
              {settings.showHumidity && <span>💧 {forecast.current.humidity}% humidity</span>}
              {settings.showWind && <span>💨 {Math.round(forecast.current.windSpeedKmh)} km/h wind</span>}
              {today && typeof today.uvIndexMax === "number" && (
                <span>
                  🔆 UV {uvCategory(today.uvIndexMax).toLowerCase()} ({Math.round(today.uvIndexMax)})
                </span>
              )}
            </div>

            {tips.length > 0 && (
              <div
                className="w-full max-w-xl rounded-xl border-2 p-3"
                style={{ borderColor: settings.textColor + "66" }}
              >
                <p className="font-display mb-2 font-bold" style={fs(1.05)}>
                  What to wear or bring today
                </p>
                <ul className="flex flex-col gap-1.5" style={fs(1)}>
                  {tips.map((tip) => (
                    <li key={tip.text} className="flex items-start gap-2">
                      <span aria-hidden="true">{tip.emoji}</span>
                      <span>{tip.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-2 grid w-full grid-cols-3 gap-2 sm:grid-cols-5">
              {forecast.daily.map((day, i) => (
                <div
                  key={day.date}
                  className="flex flex-col items-center gap-1 rounded-xl border p-2"
                  style={{ borderColor: settings.textColor + "40" }}
                >
                  <span className="font-semibold" style={fs(0.85)}>
                    {dayLabel(day.date, i)}
                  </span>
                  <span aria-hidden="true" style={fs(1.4)}>
                    {getWeatherInfo(day.weatherCode).emoji}
                  </span>
                  <span className="sr-only">{getWeatherInfo(day.weatherCode).label}.</span>
                  <span style={fs(0.85)}>
                    <span className="sr-only">Top </span>
                    {Math.round(day.maxTemp)}°
                    <span aria-hidden="true"> / </span>
                    <span className="sr-only">, low </span>
                    {Math.round(day.minTemp)}°
                  </span>
                  <span style={fs(0.75)}>
                    <span aria-hidden="true">☔</span>
                    <span className="sr-only">Chance of rain </span> {day.precipitationChance}%
                  </span>
                </div>
              ))}
            </div>

            <div className="no-print flex flex-wrap items-center justify-center gap-2">
              {speechSupported && (
                <button
                  type="button"
                  onClick={speakForecast}
                  aria-pressed={speaking}
                  className="touch-target rounded-xl border-2 px-4 font-semibold"
                  style={{ borderColor: settings.textColor, color: settings.textColor }}
                >
                  <span aria-hidden="true">{speaking ? "⏹️" : "🔊"}</span>{" "}
                  {speaking ? "Stop" : "Read the weather out loud"}
                </button>
              )}
              <button
                type="button"
                onClick={() => setRefreshTick((t) => t + 1)}
                disabled={status === "loading"}
                className="touch-target rounded-xl border-2 px-4 font-semibold disabled:opacity-50"
                style={{ borderColor: settings.textColor, color: settings.textColor }}
              >
                <span aria-hidden="true">↻</span> Update now
              </button>
            </div>
            <p aria-live="polite" className="text-center" style={fs(0.8)}>
              {status === "loading"
                ? "Updating..."
                : status === "error"
                  ? `Couldn't update just now.${fetchedAt ? ` Showing the weather from ${formatTime(fetchedAt, timezone)}.` : ""}`
                  : fetchedAt
                    ? `Updated at ${formatTime(fetchedAt, timezone)}`
                    : ""}
            </p>
          </>
        ) : null}
      </div>

      <div className="no-print rounded-2xl border-2 border-border bg-surface p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-lg font-bold">Customise</h2>
          <button
            type="button"
            onClick={resetStyle}
            className="touch-target rounded-xl border-2 border-border bg-background px-3 text-sm font-semibold"
          >
            Reset style
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <fieldset>
            <legend className="mb-1.5 block text-sm font-semibold">Temperature unit</legend>
            <div className="flex gap-2">
              {(["celsius", "fahrenheit"] as const).map((unit) => (
                <button
                  key={unit}
                  type="button"
                  onClick={() => updateField("unit", unit)}
                  aria-pressed={settings.unit === unit}
                  className={`touch-target flex-1 rounded-lg border-2 px-3 text-sm font-semibold ${
                    settings.unit === unit
                      ? "border-brand bg-brand text-brand-ink"
                      : "border-border bg-background"
                  }`}
                >
                  {unit === "celsius" ? "°C" : "°F"}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-1.5 block text-sm font-semibold">Forecast length</legend>
            <div className="flex gap-2">
              {[3, 5, 7].map((days) => (
                <button
                  key={days}
                  type="button"
                  onClick={() => updateField("forecastDays", days)}
                  aria-pressed={settings.forecastDays === days}
                  className={`touch-target flex-1 rounded-lg border-2 px-3 text-sm font-semibold ${
                    settings.forecastDays === days
                      ? "border-brand bg-brand text-brand-ink"
                      : "border-border bg-background"
                  }`}
                >
                  {days} days
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-1.5 block text-sm font-semibold">Text size</legend>
            <div className="flex gap-2">
              {[1, 1.3, 1.6].map((scale) => (
                <button
                  key={scale}
                  type="button"
                  onClick={() => updateField("fontScale", scale)}
                  aria-pressed={settings.fontScale === scale}
                  className={`touch-target flex-1 rounded-lg border-2 px-3 text-sm font-semibold ${
                    settings.fontScale === scale
                      ? "border-brand bg-brand text-brand-ink"
                      : "border-border bg-background"
                  }`}
                >
                  {scale === 1 ? "Standard" : scale === 1.3 ? "Large" : "Extra large"}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="flex flex-col gap-2">
            <label className={CHECKBOX_LABEL}>
              <input
                type="checkbox"
                checked={settings.showTips}
                onChange={(e) => updateField("showTips", e.target.checked)}
                className="h-6 w-6 shrink-0 accent-brand"
              />
              Show &quot;what to wear or bring&quot; tips
            </label>
            <label className={CHECKBOX_LABEL}>
              <input
                type="checkbox"
                checked={settings.showFeelsLike}
                onChange={(e) => updateField("showFeelsLike", e.target.checked)}
                className="h-6 w-6 shrink-0 accent-brand"
              />
              Show &quot;feels like&quot;
            </label>
            <label className={CHECKBOX_LABEL}>
              <input
                type="checkbox"
                checked={settings.showHumidity}
                onChange={(e) => updateField("showHumidity", e.target.checked)}
                className="h-6 w-6 shrink-0 accent-brand"
              />
              Show humidity
            </label>
            <label className={CHECKBOX_LABEL}>
              <input
                type="checkbox"
                checked={settings.showWind}
                onChange={(e) => updateField("showWind", e.target.checked)}
                className="h-6 w-6 shrink-0 accent-brand"
              />
              Show wind speed
            </label>
          </div>

          <div>
            <span className="mb-1.5 block text-sm font-semibold">Background colour</span>
            <SwatchRow
              colours={BACKGROUND_PRESETS}
              value={settings.backgroundColor}
              onChange={(c) => updateField("backgroundColor", c)}
              labelPrefix="Background colour"
            />
          </div>

          <div>
            <span className="mb-1.5 block text-sm font-semibold">Text colour</span>
            <SwatchRow
              colours={TEXT_COLOR_PRESETS}
              value={settings.textColor}
              onChange={(c) => updateField("textColor", c)}
              labelPrefix="Text colour"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

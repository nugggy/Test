"use client";

import { useEffect, useState } from "react";
import {
  useWeatherSettings,
} from "@/lib/weather-storage";
import {
  getWeatherInfo,
  BACKGROUND_PRESETS,
  TEXT_COLOR_PRESETS,
  type ForecastData,
} from "@/lib/weather-data";
import LocationSearch from "./LocationSearch";

function dayLabel(dateStr: string, index: number) {
  if (index === 0) return "Today";
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString("en-AU", { weekday: "short" });
}

export default function Weather() {
  const { settings, updateField, resetStyle } = useWeatherSettings();
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

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
      daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
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
        setForecast({
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
            precipitationChance: data.daily.precipitation_probability_max[i],
          })),
        });
        setStatus("idle");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [settings.location, settings.forecastDays, settings.unit]);

  const unitSymbol = settings.unit === "celsius" ? "°C" : "°F";

  return (
    <div className="flex flex-col gap-4">
      <LocationSearch onSelect={(location) => updateField("location", location)} />

      <div
        className="flex flex-col items-center gap-4 rounded-2xl border-2 border-border p-6 sm:p-8"
        style={{ backgroundColor: settings.backgroundColor, color: settings.textColor }}
      >
        {!settings.location ? (
          <p className="text-center" style={{ fontSize: `${1.1 * settings.fontScale}rem` }}>
            Search for a suburb or town above, or use your location, to see the weather.
          </p>
        ) : status === "loading" && !forecast ? (
          <p className="text-center" style={{ fontSize: `${1.1 * settings.fontScale}rem` }}>
            Loading weather for {settings.location.name}...
          </p>
        ) : status === "error" ? (
          <p className="text-center" style={{ fontSize: `${1.1 * settings.fontScale}rem` }}>
            Couldn&apos;t load the weather right now — check your internet connection and try
            again.
          </p>
        ) : forecast ? (
          <>
            <p className="font-semibold" style={{ fontSize: `${1.2 * settings.fontScale}rem` }}>
              {settings.location.name}
              {settings.location.admin1 ? `, ${settings.location.admin1}` : ""}
            </p>
            <div
              className="text-center"
              style={{ fontSize: `${3.5 * settings.fontScale}rem`, lineHeight: 1 }}
              aria-hidden="true"
            >
              {getWeatherInfo(forecast.current.weatherCode).emoji}
            </div>
            <p
              className="font-display text-center font-extrabold tabular-nums"
              style={{ fontSize: `${3 * settings.fontScale}rem`, lineHeight: 1 }}
            >
              {Math.round(forecast.current.temperature)}
              {unitSymbol}
            </p>
            <p className="text-center" style={{ fontSize: `${1.2 * settings.fontScale}rem` }}>
              {getWeatherInfo(forecast.current.weatherCode).label}
            </p>

            <div
              className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-center"
              style={{ fontSize: `${0.95 * settings.fontScale}rem` }}
            >
              {settings.showFeelsLike && (
                <span>
                  Feels like {Math.round(forecast.current.apparentTemperature)}
                  {unitSymbol}
                </span>
              )}
              {settings.showHumidity && <span>💧 {forecast.current.humidity}% humidity</span>}
              {settings.showWind && <span>💨 {Math.round(forecast.current.windSpeedKmh)} km/h</span>}
            </div>

            <div className="mt-2 grid w-full grid-cols-3 gap-2 sm:grid-cols-5">
              {forecast.daily.map((day, i) => (
                <div
                  key={day.date}
                  className="flex flex-col items-center gap-1 rounded-xl border p-2"
                  style={{ borderColor: settings.textColor + "40" }}
                >
                  <span className="font-semibold" style={{ fontSize: `${0.85 * settings.fontScale}rem` }}>
                    {dayLabel(day.date, i)}
                  </span>
                  <span aria-hidden="true" style={{ fontSize: `${1.4 * settings.fontScale}rem` }}>
                    {getWeatherInfo(day.weatherCode).emoji}
                  </span>
                  <span style={{ fontSize: `${0.85 * settings.fontScale}rem` }}>
                    {Math.round(day.maxTemp)}° / {Math.round(day.minTemp)}°
                  </span>
                  <span style={{ fontSize: `${0.75 * settings.fontScale}rem` }}>
                    ☔ {day.precipitationChance}%
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : null}
      </div>

      <div className="no-print rounded-2xl border-2 border-border bg-surface p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Customise</h2>
          <button
            type="button"
            onClick={resetStyle}
            className="text-sm font-semibold text-muted hover:text-foreground"
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
                  className={`touch-target flex-1 rounded-lg border-2 px-3 text-sm font-semibold capitalize ${
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
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                checked={settings.showFeelsLike}
                onChange={(e) => updateField("showFeelsLike", e.target.checked)}
                className="h-5 w-5 accent-brand"
              />
              Show &quot;feels like&quot;
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                checked={settings.showHumidity}
                onChange={(e) => updateField("showHumidity", e.target.checked)}
                className="h-5 w-5 accent-brand"
              />
              Show humidity
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                checked={settings.showWind}
                onChange={(e) => updateField("showWind", e.target.checked)}
                className="h-5 w-5 accent-brand"
              />
              Show wind speed
            </label>
          </div>

          <div>
            <span className="mb-1.5 block text-sm font-semibold">Background colour</span>
            <div className="flex flex-wrap items-center gap-1.5">
              {BACKGROUND_PRESETS.map((colour) => (
                <button
                  key={colour}
                  type="button"
                  onClick={() => updateField("backgroundColor", colour)}
                  aria-label={`Background colour ${colour}`}
                  aria-pressed={settings.backgroundColor === colour}
                  className={`h-8 w-8 shrink-0 rounded-full border-2 ${
                    settings.backgroundColor === colour ? "border-brand" : "border-border"
                  }`}
                  style={{ backgroundColor: colour }}
                />
              ))}
              <input
                type="color"
                value={settings.backgroundColor}
                onChange={(e) => updateField("backgroundColor", e.target.value)}
                aria-label="Custom background colour"
                className="h-8 w-8 shrink-0 rounded-full border-2 border-border"
              />
            </div>
          </div>

          <div>
            <span className="mb-1.5 block text-sm font-semibold">Text colour</span>
            <div className="flex flex-wrap items-center gap-1.5">
              {TEXT_COLOR_PRESETS.map((colour) => (
                <button
                  key={colour}
                  type="button"
                  onClick={() => updateField("textColor", colour)}
                  aria-label={`Text colour ${colour}`}
                  aria-pressed={settings.textColor === colour}
                  className={`h-8 w-8 shrink-0 rounded-full border-2 ${
                    settings.textColor === colour ? "border-brand" : "border-border"
                  }`}
                  style={{ backgroundColor: colour }}
                />
              ))}
              <input
                type="color"
                value={settings.textColor}
                onChange={(e) => updateField("textColor", e.target.value)}
                aria-label="Custom text colour"
                className="h-8 w-8 shrink-0 rounded-full border-2 border-border"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

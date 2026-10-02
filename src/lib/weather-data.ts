export interface WeatherLocation {
  name: string;
  admin1?: string;
  country?: string;
  latitude: number;
  longitude: number;
}

interface WeatherCodeInfo {
  label: string;
  emoji: string;
}

// World Meteorological Organization weather codes, as returned by the
// Open-Meteo API (https://open-meteo.com/en/docs) - free, no API key
// required, and explicitly supports direct browser requests.
const WEATHER_CODES: Record<number, WeatherCodeInfo> = {
  0: { label: "Clear sky", emoji: "☀️" },
  1: { label: "Mainly clear", emoji: "🌤️" },
  2: { label: "Partly cloudy", emoji: "⛅" },
  3: { label: "Overcast", emoji: "☁️" },
  45: { label: "Fog", emoji: "🌫️" },
  48: { label: "Freezing fog", emoji: "🌫️" },
  51: { label: "Light drizzle", emoji: "🌦️" },
  53: { label: "Drizzle", emoji: "🌦️" },
  55: { label: "Heavy drizzle", emoji: "🌦️" },
  56: { label: "Freezing drizzle", emoji: "🌦️" },
  57: { label: "Freezing drizzle", emoji: "🌦️" },
  61: { label: "Light rain", emoji: "🌧️" },
  63: { label: "Rain", emoji: "🌧️" },
  65: { label: "Heavy rain", emoji: "🌧️" },
  66: { label: "Freezing rain", emoji: "🌧️" },
  67: { label: "Freezing rain", emoji: "🌧️" },
  71: { label: "Light snow", emoji: "🌨️" },
  73: { label: "Snow", emoji: "🌨️" },
  75: { label: "Heavy snow", emoji: "🌨️" },
  77: { label: "Snow grains", emoji: "🌨️" },
  80: { label: "Light rain showers", emoji: "🌦️" },
  81: { label: "Rain showers", emoji: "🌦️" },
  82: { label: "Heavy rain showers", emoji: "🌦️" },
  85: { label: "Snow showers", emoji: "🌨️" },
  86: { label: "Heavy snow showers", emoji: "🌨️" },
  95: { label: "Thunderstorm", emoji: "⛈️" },
  96: { label: "Thunderstorm with hail", emoji: "⛈️" },
  99: { label: "Thunderstorm with hail", emoji: "⛈️" },
};

export function getWeatherInfo(code: number): WeatherCodeInfo {
  return WEATHER_CODES[code] ?? { label: "Unknown", emoji: "🌡️" };
}

export interface ForecastData {
  current: {
    temperature: number;
    apparentTemperature: number;
    humidity: number;
    weatherCode: number;
    windSpeedKmh: number;
  };
  daily: {
    date: string;
    weatherCode: number;
    maxTemp: number;
    minTemp: number;
    precipitationChance: number;
    /** Highest UV index for the day. Missing in forecasts saved or fetched
     * before UV was added. */
    uvIndexMax?: number | null;
  }[];
}

export interface WeatherTip {
  emoji: string;
  text: string;
}

/** Standard UV index categories (World Health Organization), used by the
 * Bureau of Meteorology and SunSmart. */
export function uvCategory(uv: number): string {
  if (uv < 3) return "Low";
  if (uv < 6) return "Moderate";
  if (uv < 8) return "High";
  if (uv < 11) return "Very high";
  return "Extreme";
}

/**
 * Plain-language "what to wear or bring" tips for one day of the forecast.
 * These are everyday suggestions only. The sun protection tip follows the
 * SunSmart guidance of protecting your skin when the UV index is 3 or
 * above. Temperatures are converted, so the same tips work in Fahrenheit.
 */
export function weatherTips(
  day: ForecastData["daily"][number],
  unit: "celsius" | "fahrenheit"
): WeatherTip[] {
  const toC = (t: number) => (unit === "fahrenheit" ? ((t - 32) * 5) / 9 : t);
  const max = toC(day.maxTemp);
  const min = toC(day.minTemp);
  const tips: WeatherTip[] = [];

  if (day.weatherCode >= 95) {
    tips.push({
      emoji: "⛈️",
      text: "Storms are possible. Check the Bureau of Meteorology for any warnings.",
    });
  }
  if (day.precipitationChance >= 50) {
    tips.push({ emoji: "☂️", text: "Rain is likely. Take an umbrella or raincoat." });
  } else if (day.precipitationChance >= 30) {
    tips.push({ emoji: "🌂", text: "It might rain. A raincoat could be handy." });
  }
  if (max >= 30) {
    tips.push({ emoji: "🥤", text: "A hot day. Wear light clothes and take water with you." });
  } else if (max <= 16 || min <= 8) {
    tips.push({ emoji: "🧥", text: "A cool or cold day. Take a warm jacket." });
  }
  if (typeof day.uvIndexMax === "number" && day.uvIndexMax >= 3) {
    tips.push({
      emoji: "🧢",
      text: `UV is ${uvCategory(day.uvIndexMax).toLowerCase()} (${Math.round(
        day.uvIndexMax
      )}). Wear a hat, sunscreen and sunglasses when outside.`,
    });
  }
  return tips;
}

export const BACKGROUND_PRESETS = [
  "#1a2b4c", "#0b3d2e", "#241a38", "#3a1c00", "#0a0a0a", "#4c8df2", "#ffffff", "#f6f2fb",
];

export const TEXT_COLOR_PRESETS = [
  "#ffffff", "#ffe066", "#9b6fe8", "#4caf6d", "#f2c230", "#241a38", "#000000",
];

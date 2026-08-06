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
  }[];
}

export const BACKGROUND_PRESETS = [
  "#1a2b4c", "#0b3d2e", "#241a38", "#3a1c00", "#0a0a0a", "#4c8df2", "#ffffff", "#f6f2fb",
];

export const TEXT_COLOR_PRESETS = [
  "#ffffff", "#ffe066", "#9b6fe8", "#4caf6d", "#f2c230", "#241a38", "#000000",
];

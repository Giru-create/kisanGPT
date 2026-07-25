// ─────────────────────────────────────────────────────────────────────────────
// weather.constants.ts
// KisanGPT — Weather Intelligence feature constants
// ─────────────────────────────────────────────────────────────────────────────

import type { WeatherCondition, RecommendationSeverity } from "../types/weather.types";

// ---------------------------------------------------------------------------
// Condition → display label
// ---------------------------------------------------------------------------

export const WEATHER_LABELS: Record<WeatherCondition, string> = {
  sunny: "Clear & Sunny",
  "partly-cloudy": "Partly Cloudy",
  cloudy: "Cloudy",
  rain: "Light Rain",
  "heavy-rain": "Heavy Rain",
  thunderstorm: "Thunderstorm",
  fog: "Foggy",
  snow: "Snowfall",
  windy: "Windy",
  heatwave: "Heatwave",
};

// ---------------------------------------------------------------------------
// Condition → Lucide icon name (resolved in WeatherIcon component)
// ---------------------------------------------------------------------------

export const WEATHER_ICON_NAMES: Record<WeatherCondition, string> = {
  sunny: "Sun",
  "partly-cloudy": "CloudSun",
  cloudy: "Cloud",
  rain: "CloudRain",
  "heavy-rain": "CloudRainWind",
  thunderstorm: "Zap",
  fog: "CloudFog",
  snow: "Snowflake",
  windy: "Wind",
  heatwave: "Flame",
};

// ---------------------------------------------------------------------------
// Condition → icon color class (Tailwind)
// ---------------------------------------------------------------------------

export const WEATHER_ICON_COLORS: Record<WeatherCondition, string> = {
  sunny: "text-amber-400",
  "partly-cloudy": "text-amber-300",
  cloudy: "text-slate-400",
  rain: "text-blue-400",
  "heavy-rain": "text-blue-600",
  thunderstorm: "text-purple-500",
  fog: "text-slate-400",
  snow: "text-sky-300",
  windy: "text-teal-400",
  heatwave: "text-orange-500",
};

// ---------------------------------------------------------------------------
// Severity → styling
// ---------------------------------------------------------------------------

export const SEVERITY_LABEL: Record<RecommendationSeverity, string> = {
  none: "",
  low: "Low Advisory",
  moderate: "Moderate Advisory",
  high: "High Alert",
  extreme: "Extreme Alert",
};

export const SEVERITY_BADGE_VARIANT: Record<
  RecommendationSeverity,
  "success" | "info" | "warning" | "error" | "default"
> = {
  none: "success",
  low: "info",
  moderate: "warning",
  high: "warning",
  extreme: "error",
};

// UV index ranges
export const UV_LABELS: Array<{ max: number; label: string; color: string }> = [
  { max: 2, label: "Low", color: "text-emerald-600 dark:text-emerald-400" },
  { max: 5, label: "Moderate", color: "text-amber-600 dark:text-amber-400" },
  { max: 7, label: "High", color: "text-orange-600 dark:text-orange-400" },
  { max: 10, label: "Very High", color: "text-red-600 dark:text-red-400" },
  { max: Infinity, label: "Extreme", color: "text-purple-600 dark:text-purple-400" },
];

export function getUVLabel(uvIndex: number): { label: string; color: string } {
  const match = UV_LABELS.find((r) => uvIndex <= r.max);
  return match ?? UV_LABELS[UV_LABELS.length - 1] ?? { label: "Unknown", color: "text-muted-foreground" };
}

// ---------------------------------------------------------------------------
// Mock data — used until the real API is wired in a later milestone
// ---------------------------------------------------------------------------

import type { WeatherData } from "../types/weather.types";

const today = new Date();
const makeDate = (offsetDays: number): Date => {
  const d = new Date(today);
  d.setDate(d.getDate() + offsetDays);
  return d;
};

export const MOCK_WEATHER_DATA: WeatherData = {
  location: {
    village: "Karnal",
    district: "Karnal",
    state: "Haryana",
    lat: 29.6857,
    lng: 76.9905,
  },
  current: {
    condition: "partly-cloudy",
    temperatureC: 32,
    feelsLikeC: 36,
    humidity: 74,
    windSpeedKmh: 12,
    uvIndex: 8,
    sunriseTime: "06:02",
    sunsetTime: "19:14",
    updatedAt: new Date(Date.now() - 2 * 60 * 1000), // 2 min ago
  },
  forecast: [
    { date: makeDate(0), condition: "partly-cloudy", highC: 33, lowC: 24, rainChancePercent: 10 },
    { date: makeDate(1), condition: "cloudy", highC: 30, lowC: 23, rainChancePercent: 35 },
    { date: makeDate(2), condition: "rain", highC: 27, lowC: 21, rainChancePercent: 70 },
    { date: makeDate(3), condition: "heavy-rain", highC: 25, lowC: 20, rainChancePercent: 85 },
    { date: makeDate(4), condition: "rain", highC: 26, lowC: 21, rainChancePercent: 60 },
    { date: makeDate(5), condition: "cloudy", highC: 29, lowC: 22, rainChancePercent: 25 },
    { date: makeDate(6), condition: "sunny", highC: 34, lowC: 24, rainChancePercent: 5 },
  ],
  recommendation: {
    severity: "high",
    alertMessage:
      "35°C expected tomorrow. Avoid field work between 11 AM – 4 PM to protect yourself and your crops.",
    irrigationWindow: { start: "06:00", end: "08:00" },
    cropTip:
      "Wheat: Apply the second irrigation within the next 2 days before the rain window closes.",
    chatContextPayload:
      "Weather alert for my farm in Karnal, Haryana: High heat tomorrow (35°C) followed by heavy rain. What should I do with my wheat crop?",
  },
};

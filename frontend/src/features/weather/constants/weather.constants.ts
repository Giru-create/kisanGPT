// ─────────────────────────────────────────────────────────────────────────────
// weather.constants.ts
// KisanGPT — Weather Intelligence feature constants
// ─────────────────────────────────────────────────────────────────────────────

import type {
  WeatherCondition,
  RecommendationSeverity,
  RiskType,
  RiskSeverity,
  FarmImpactArea,
  FarmImpactLevel,
  WeatherData,
} from "../types/weather.types";

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
  {
    max: Infinity,
    label: "Extreme",
    color: "text-purple-600 dark:text-purple-400",
  },
];

export function getUVLabel(uvIndex: number): { label: string; color: string } {
  const match = UV_LABELS.find((r) => uvIndex <= r.max);
  return (
    match ??
    UV_LABELS[UV_LABELS.length - 1] ?? {
      label: "Unknown",
      color: "text-muted-foreground",
    }
  );
}

// ---------------------------------------------------------------------------
// Risk type → display info
// ---------------------------------------------------------------------------

export const RISK_TYPE_LABELS: Record<RiskType, string> = {
  "heavy-rain": "Heavy Rain",
  heatwave: "Heat Wave",
  frost: "Frost",
  "strong-wind": "Strong Wind",
  storm: "Storm Warning",
  "high-uv": "High UV",
  fog: "Dense Fog",
};

export const RISK_SEVERITY_COLORS: Record<RiskSeverity, string> = {
  low: "bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-300",
  moderate:
    "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300",
  high: "bg-orange-500/10 border-orange-500/30 text-orange-700 dark:text-orange-300",
  extreme: "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300",
};

export const RISK_SEVERITY_BADGE: Record<
  RiskSeverity,
  "info" | "warning" | "error"
> = {
  low: "info",
  moderate: "warning",
  high: "warning",
  extreme: "error",
};

// ---------------------------------------------------------------------------
// Farm impact area → display info
// ---------------------------------------------------------------------------

export const FARM_IMPACT_LABELS: Record<FarmImpactArea, string> = {
  "crop-health": "Crop Health",
  "soil-moisture": "Soil Moisture",
  "pest-risk": "Pest Risk",
  irrigation: "Irrigation",
  harvest: "Harvest",
};

export const FARM_IMPACT_ICONS: Record<FarmImpactArea, string> = {
  "crop-health": "Sprout",
  "soil-moisture": "Droplets",
  "pest-risk": "Bug",
  irrigation: "Droplets",
  harvest: "Calendar",
};

export const FARM_IMPACT_COLORS: Record<FarmImpactLevel, string> = {
  positive: "text-emerald-600 dark:text-emerald-400",
  neutral: "text-muted-foreground",
  negative: "text-amber-600 dark:text-amber-400",
  critical: "text-red-600 dark:text-red-400",
};

export const FARM_IMPACT_BG_COLORS: Record<FarmImpactLevel, string> = {
  positive: "bg-emerald-500/10",
  neutral: "bg-muted/50",
  negative: "bg-amber-500/10",
  critical: "bg-red-500/10",
};

// ---------------------------------------------------------------------------
// Mock data — used until the real API is wired
// ---------------------------------------------------------------------------

const today = new Date();
const makeDate = (offsetDays: number): Date => {
  const d = new Date(today);
  d.setDate(d.getDate() + offsetDays);
  return d;
};

const makeHour = (hourOffset: number): number => {
  const now = new Date();
  return (now.getHours() + hourOffset) % 24;
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
    windDirection: "SE",
    uvIndex: 8,
    rainChancePercent: 25,
    visibility: 10,
    pressure: 1013,
    sunriseTime: "06:02",
    sunsetTime: "19:14",
    airQuality: {
      aqi: 85,
      label: "Moderate",
      color: "text-amber-600 dark:text-amber-400",
      description:
        "Air quality is acceptable. Sensitive groups may experience minor effects.",
    },
    updatedAt: new Date(Date.now() - 2 * 60 * 1000),
  },
  hourly: [
    {
      hour: makeHour(0),
      temperatureC: 32,
      condition: "partly-cloudy",
      rainChancePercent: 10,
      humidity: 70,
      windSpeedKmh: 10,
    },
    {
      hour: makeHour(1),
      temperatureC: 33,
      condition: "partly-cloudy",
      rainChancePercent: 15,
      humidity: 68,
      windSpeedKmh: 11,
    },
    {
      hour: makeHour(2),
      temperatureC: 34,
      condition: "sunny",
      rainChancePercent: 5,
      humidity: 65,
      windSpeedKmh: 12,
    },
    {
      hour: makeHour(3),
      temperatureC: 35,
      condition: "sunny",
      rainChancePercent: 5,
      humidity: 62,
      windSpeedKmh: 13,
    },
    {
      hour: makeHour(4),
      temperatureC: 34,
      condition: "partly-cloudy",
      rainChancePercent: 20,
      humidity: 65,
      windSpeedKmh: 12,
    },
    {
      hour: makeHour(5),
      temperatureC: 33,
      condition: "cloudy",
      rainChancePercent: 35,
      humidity: 70,
      windSpeedKmh: 14,
    },
    {
      hour: makeHour(6),
      temperatureC: 31,
      condition: "cloudy",
      rainChancePercent: 50,
      humidity: 75,
      windSpeedKmh: 15,
    },
    {
      hour: makeHour(7),
      temperatureC: 29,
      condition: "rain",
      rainChancePercent: 70,
      humidity: 80,
      windSpeedKmh: 18,
    },
    {
      hour: makeHour(8),
      temperatureC: 27,
      condition: "rain",
      rainChancePercent: 80,
      humidity: 85,
      windSpeedKmh: 20,
    },
    {
      hour: makeHour(9),
      temperatureC: 26,
      condition: "heavy-rain",
      rainChancePercent: 90,
      humidity: 88,
      windSpeedKmh: 22,
    },
    {
      hour: makeHour(10),
      temperatureC: 25,
      condition: "heavy-rain",
      rainChancePercent: 85,
      humidity: 90,
      windSpeedKmh: 20,
    },
    {
      hour: makeHour(11),
      temperatureC: 24,
      condition: "rain",
      rainChancePercent: 60,
      humidity: 85,
      windSpeedKmh: 16,
    },
  ],
  forecast: [
    {
      date: makeDate(0),
      condition: "partly-cloudy",
      highC: 33,
      lowC: 24,
      rainChancePercent: 25,
      humidity: 74,
      windSpeedKmh: 12,
    },
    {
      date: makeDate(1),
      condition: "cloudy",
      highC: 30,
      lowC: 23,
      rainChancePercent: 55,
      humidity: 78,
      windSpeedKmh: 15,
    },
    {
      date: makeDate(2),
      condition: "rain",
      highC: 27,
      lowC: 21,
      rainChancePercent: 80,
      humidity: 85,
      windSpeedKmh: 18,
    },
    {
      date: makeDate(3),
      condition: "heavy-rain",
      highC: 25,
      lowC: 20,
      rainChancePercent: 90,
      humidity: 90,
      windSpeedKmh: 22,
    },
    {
      date: makeDate(4),
      condition: "rain",
      highC: 26,
      lowC: 21,
      rainChancePercent: 65,
      humidity: 82,
      windSpeedKmh: 16,
    },
    {
      date: makeDate(5),
      condition: "cloudy",
      highC: 29,
      lowC: 22,
      rainChancePercent: 30,
      humidity: 72,
      windSpeedKmh: 12,
    },
    {
      date: makeDate(6),
      condition: "sunny",
      highC: 34,
      lowC: 24,
      rainChancePercent: 5,
      humidity: 60,
      windSpeedKmh: 8,
    },
  ],
  recommendation: {
    severity: "high",
    alertMessage:
      "Heavy rain expected in 48 hours. Complete any pending field operations today and tomorrow morning.",
    irrigationWindow: { start: "06:00", end: "08:00" },
    fertilizerTiming:
      "Apply fertilizer today before rain. Rain will help dissolve nutrients naturally.",
    sprayingAdvice:
      "Avoid spraying for the next 3 days due to rain. Spray only on clear days for best results.",
    harvestGuidance:
      "If wheat is ready, harvest immediately before rain starts to prevent grain damage.",
    cropTip:
      "Wheat: Apply the second irrigation within the next 2 days before the rain window closes. Ensure proper drainage in low-lying areas.",
    confidence: 87,
    reasoning:
      "Based on 7-day forecast showing heavy rain on Day 3-4 with 90% probability, combined with current soil moisture data and crop growth stage.",
    chatContextPayload:
      "Weather alert for my farm in Karnal, Haryana: Heavy rain expected in 48 hours followed by continued rain. What should I do with my wheat crop?",
  },
  riskAlerts: [
    {
      id: "risk-1",
      type: "heavy-rain",
      severity: "high",
      title: "Heavy Rain Alert",
      description:
        "Expected rainfall: 45-65mm over 24 hours starting Day 3. Potential for waterlogging in low-lying fields.",
      action:
        "Clear drainage channels, move harvested crops to safe storage, avoid field operations during peak rain.",
      validFrom: makeDate(2).toISOString(),
      validUntil: makeDate(3).toISOString(),
    },
    {
      id: "risk-2",
      type: "strong-wind",
      severity: "moderate",
      title: "Strong Wind Advisory",
      description:
        "Wind speeds up to 25 km/h expected during the rain period. May cause lodging in tall crops.",
      action:
        "Provide support to tall crops, secure loose structures, avoid spraying operations.",
      validFrom: makeDate(2).toISOString(),
      validUntil: makeDate(3).toISOString(),
    },
    {
      id: "risk-3",
      type: "fog",
      severity: "low",
      title: "Morning Fog Warning",
      description:
        "Dense fog expected on mornings after the rain clears. Visibility may drop below 200m.",
      action:
        "Delay early morning field operations until fog clears. Use fog lights if traveling.",
      validFrom: makeDate(4).toISOString(),
      validUntil: makeDate(5).toISOString(),
    },
  ],
  farmImpact: [
    {
      area: "crop-health",
      level: "negative",
      title: "Stress Risk for Wheat",
      description:
        "Heavy rain may cause waterlogging stress. Ensure proper drainage to prevent root rot.",
      action: "Open field drains and check for standing water.",
    },
    {
      area: "soil-moisture",
      level: "positive",
      title: "Moisture Recharge Expected",
      description:
        "Rain will replenish soil moisture levels. Currently at 45%, expected to reach 80%.",
      action: "No irrigation needed for the next 5-7 days after rain.",
    },
    {
      area: "pest-risk",
      level: "negative",
      title: "Fungal Disease Risk High",
      description:
        "High humidity and wet conditions create ideal environment for rust and blight.",
      action:
        "Apply preventive fungicide before rain starts. Monitor for symptoms after rain.",
    },
    {
      area: "irrigation",
      level: "positive",
      title: "Irrigation Not Needed",
      description:
        "Natural rainfall will meet crop water requirements for the next week.",
      action: "Skip scheduled irrigation for 5-7 days.",
    },
    {
      area: "harvest",
      level: "negative",
      title: "Harvest Window Closing",
      description:
        "If crop is ready, harvest immediately before rain. Delayed harvest may cause grain sprouting.",
      action: "Prioritize harvesting mature crops today and tomorrow.",
    },
  ],
  summary: {
    text: "Heavy rain is expected in 48 hours with 90% probability. Complete all field operations today. Apply fertilizer now for best absorption. Avoid spraying for 3 days. Harvest ready crops immediately.",
    confidence: 87,
    generatedAt: new Date(),
  },
  history: [
    {
      date: makeDate(-7),
      highC: 35,
      lowC: 25,
      rainfall: 0,
      humidity: 65,
    },
    {
      date: makeDate(-6),
      highC: 36,
      lowC: 26,
      rainfall: 0,
      humidity: 62,
    },
    {
      date: makeDate(-5),
      highC: 34,
      lowC: 24,
      rainfall: 5,
      humidity: 70,
    },
    {
      date: makeDate(-4),
      highC: 32,
      lowC: 23,
      rainfall: 12,
      humidity: 78,
    },
    {
      date: makeDate(-3),
      highC: 30,
      lowC: 22,
      rainfall: 8,
      humidity: 82,
    },
    {
      date: makeDate(-2),
      highC: 31,
      lowC: 23,
      rainfall: 0,
      humidity: 72,
    },
    {
      date: makeDate(-1),
      highC: 33,
      lowC: 24,
      rainfall: 0,
      humidity: 68,
    },
  ],
};

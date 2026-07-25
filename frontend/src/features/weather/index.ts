// ─────────────────────────────────────────────────────────────────────────────
// index.ts
// KisanGPT — Weather Intelligence feature barrel export
// ─────────────────────────────────────────────────────────────────────────────

// Page
export { WeatherPage } from "./components/WeatherPage";

// Individual components (for future composability)
export { CurrentWeatherCard } from "./components/CurrentWeatherCard";
export { ForecastStrip } from "./components/ForecastStrip";
export { ForecastDayCard } from "./components/ForecastDayCard";
export { FarmingRecommendationCard } from "./components/FarmingRecommendationCard";
export { WeatherIcon } from "./components/WeatherIcon";
export { WeatherStatBadge } from "./components/WeatherStatBadge";
export { WeatherSkeleton } from "./components/WeatherSkeleton";
export { WeatherError } from "./components/WeatherError";
export { WeatherEmpty } from "./components/WeatherEmpty";

// Hook
export { useWeather, convertTemp, unitSymbol, relativeTime } from "./hooks/useWeather";

// Store
export { useWeatherStore } from "./store/weatherStore";

// Types
export type {
  WeatherCondition,
  WeatherData,
  CurrentWeather,
  ForecastDay,
  FarmingRecommendation,
  FarmLocation,
  TemperatureUnit,
  RecommendationSeverity,
  WeatherUIState,
} from "./types/weather.types";

// ─────────────────────────────────────────────────────────────────────────────
// index.ts
// KisanGPT — Weather Intelligence feature barrel export
// ─────────────────────────────────────────────────────────────────────────────

// Page
export { WeatherPage } from "./components/WeatherPage";

// Individual components
export { CurrentWeatherCard } from "./components/CurrentWeatherCard";
export { HourlyForecast } from "./components/HourlyForecast";
export { ForecastStrip } from "./components/ForecastStrip";
export { ForecastDayCard } from "./components/ForecastDayCard";
export { ForecastDetail } from "./components/ForecastDetail";
export { FarmingRecommendationCard } from "./components/FarmingRecommendationCard";
export { RiskAlerts } from "./components/RiskAlerts";
export { FarmImpact } from "./components/FarmImpact";
export { WeatherHistory } from "./components/WeatherHistory";
export { WeatherIcon } from "./components/WeatherIcon";
export { WeatherStatBadge } from "./components/WeatherStatBadge";
export { WeatherSkeleton } from "./components/WeatherSkeleton";
export { WeatherError } from "./components/WeatherError";
export { WeatherEmpty } from "./components/WeatherEmpty";

// Hook
export {
  useWeather,
  convertTemp,
  unitSymbol,
  relativeTime,
} from "./hooks/useWeather";

// Store
export {
  useWeatherStore,
  selectLocation,
  selectUnit,
  selectToggleUnit,
} from "./store/weatherStore";

// Types — alias HourlyForecast component to avoid collision with the type
export type {
  WeatherCondition,
  WeatherData,
  CurrentWeather,
  ForecastDay,
  HourlyForecast as HourlyForecastData,
  FarmingRecommendation,
  FarmLocation,
  TemperatureUnit,
  RecommendationSeverity,
  WeatherUIState,
  RiskAlert,
  RiskType,
  RiskSeverity,
  FarmImpactItem,
  FarmImpactArea,
  FarmImpactLevel,
  WeatherSummary,
  AirQuality,
  WeatherHistoryDay,
} from "./types/weather.types";

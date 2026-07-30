// ─────────────────────────────────────────────────────────────────────────────
// weatherService.ts
// KisanGPT — Weather Intelligence Unified Service Abstraction
// Aggregates /current, /forecast, /advice into a single WeatherData object
// ─────────────────────────────────────────────────────────────────────────────

import { weatherApi } from "./weatherApi";
import { weatherMockService } from "./weatherMock";
import type {
  WeatherData,
  WeatherCondition,
  FarmLocation,
  CurrentWeather,
  ForecastDay,
  FarmingRecommendation,
  RecommendationSeverity,
} from "../types/weather.types";
import type {
  BackendCurrentWeather,
  BackendForecastResponse,
  BackendWeatherAdviceResponse,
} from "./weatherApi";

export interface IWeatherService {
  getWeatherData: (options?: {
    lat?: number;
    lon?: number;
    city?: string;
  }) => Promise<WeatherData>;
}

function isMockMode(): boolean {
  return (
    process.env.NEXT_PUBLIC_USE_MOCK_API === undefined ||
    process.env.NEXT_PUBLIC_USE_MOCK_API === "true"
  );
}

// ---------------------------------------------------------------------------
// Mapping helpers — backend snake_case → frontend camelCase
// ---------------------------------------------------------------------------

const CONDITION_MAP: Record<string, WeatherCondition> = {
  clear: "sunny",
  sunny: "sunny",
  clouds: "cloudy",
  "few clouds": "partly-cloudy",
  "scattered clouds": "partly-cloudy",
  "broken clouds": "cloudy",
  "overcast clouds": "cloudy",
  rain: "rain",
  "light rain": "rain",
  "moderate rain": "rain",
  "heavy rain": "heavy-rain",
  "very heavy rain": "heavy-rain",
  drizzle: "rain",
  thunderstorm: "thunderstorm",
  snow: "snow",
  mist: "fog",
  fog: "fog",
  haze: "fog",
  smoke: "fog",
  dust: "fog",
};

function mapCondition(
  conditions: { main: string; description: string }[],
): WeatherCondition {
  if (conditions.length === 0) return "partly-cloudy";
  const first = conditions[0];
  if (!first) return "partly-cloudy";
  const desc = first.description.toLowerCase();
  const mapped = CONDITION_MAP[desc];
  if (mapped) return mapped;
  const main = first.main.toLowerCase();
  return CONDITION_MAP[main] ?? "partly-cloudy";
}

function mapBackendLocation(
  city: string,
  country: string,
  coords: { latitude: number; longitude: number },
): FarmLocation {
  return {
    district: city || "Unknown",
    state: country || "",
    lat: coords.latitude,
    lng: coords.longitude,
  };
}

function mapBackendCurrent(data: BackendCurrentWeather): CurrentWeather {
  const sunriseTime = "06:02";
  const sunsetTime = "19:14";

  return {
    condition: mapCondition(data.conditions),
    temperatureC: data.temperature,
    feelsLikeC: data.feels_like,
    humidity: data.humidity,
    windSpeedKmh: data.wind_speed * 3.6,
    uvIndex: 5,
    sunriseTime,
    sunsetTime,
    updatedAt: new Date(),
  };
}

function mapBackendForecast(data: BackendForecastResponse): ForecastDay[] {
  return data.daily.map((day) => ({
    date: new Date(day.date),
    condition: mapCondition(day.conditions),
    highC: day.temp_max,
    lowC: day.temp_min,
    rainChancePercent: Math.round(day.pop * 100),
  }));
}

function mapBackendAdvice(
  data: BackendWeatherAdviceResponse,
): FarmingRecommendation {
  const advice = data.advice ?? [];
  const firstAdvice = advice[0];

  let severity: RecommendationSeverity = "none";
  if (firstAdvice) {
    const s = firstAdvice.severity.toLowerCase();
    if (s === "danger") severity = "extreme";
    else if (s === "warning") severity = "high";
    else if (s === "info") severity = "low";
  }

  const alertAdvice = advice.find(
    (a) => a.severity === "warning" || a.severity === "danger",
  );

  return {
    severity,
    alertMessage: alertAdvice?.message,
    irrigationWindow: { start: "06:00", end: "08:00" },
    cropTip: firstAdvice?.message,
    chatContextPayload: data.current_summary,
  };
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

export const weatherService: IWeatherService = {
  getWeatherData: async (options) => {
    if (isMockMode()) return weatherMockService.getWeatherData();
    try {
      const [currentRes, forecastRes, adviceRes] = await Promise.all([
        weatherApi.getCurrent(options),
        weatherApi.getForecast(options),
        weatherApi.getAdvice(options),
      ]);

      const location = mapBackendLocation(
        currentRes.city,
        currentRes.country,
        currentRes.coordinates,
      );
      const current = mapBackendCurrent(currentRes);
      const forecast = mapBackendForecast(forecastRes);
      const recommendation = mapBackendAdvice(adviceRes);

      return { location, current, forecast, recommendation };
    } catch (err) {
      console.warn("Weather API error, falling back to mock:", err);
      return weatherMockService.getWeatherData();
    }
  },
};

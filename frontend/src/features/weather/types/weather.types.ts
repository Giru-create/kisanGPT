// ─────────────────────────────────────────────────────────────────────────────
// weather.types.ts
// KisanGPT — Weather Intelligence feature types
// ─────────────────────────────────────────────────────────────────────────────

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

export type WeatherCondition =
  | "sunny"
  | "partly-cloudy"
  | "cloudy"
  | "rain"
  | "heavy-rain"
  | "thunderstorm"
  | "fog"
  | "snow"
  | "windy"
  | "heatwave";

export type RecommendationSeverity =
  | "none"
  | "low"
  | "moderate"
  | "high"
  | "extreme";

export type TemperatureUnit = "celsius" | "fahrenheit";

// ---------------------------------------------------------------------------
// Location
// ---------------------------------------------------------------------------

export interface FarmLocation {
  village?: string;
  district: string;
  state: string;
  lat: number;
  lng: number;
}

// ---------------------------------------------------------------------------
// Current conditions
// ---------------------------------------------------------------------------

export interface CurrentWeather {
  condition: WeatherCondition;
  temperatureC: number;
  feelsLikeC: number;
  humidity: number; // percentage 0–100
  windSpeedKmh: number;
  uvIndex: number;
  sunriseTime: string; // "06:02"
  sunsetTime: string; // "19:14"
  updatedAt: Date;
}

// ---------------------------------------------------------------------------
// 7-day forecast
// ---------------------------------------------------------------------------

export interface ForecastDay {
  date: Date;
  condition: WeatherCondition;
  highC: number;
  lowC: number;
  rainChancePercent: number; // 0–100
}

// ---------------------------------------------------------------------------
// Farming recommendations
// ---------------------------------------------------------------------------

export interface IrrigationWindow {
  start: string; // "06:00"
  end: string; // "08:00"
}

export interface FarmingRecommendation {
  severity: RecommendationSeverity;
  alertMessage?: string;
  irrigationWindow?: IrrigationWindow;
  cropTip?: string;
  /** Pre-filled text to send to /chat when the CTA is clicked */
  chatContextPayload?: string;
}

// ---------------------------------------------------------------------------
// Aggregated weather data
// ---------------------------------------------------------------------------

export interface WeatherData {
  location: FarmLocation;
  current: CurrentWeather;
  forecast: ForecastDay[]; // exactly 7 items
  recommendation: FarmingRecommendation;
}

// ---------------------------------------------------------------------------
// UI state (discriminated union — drives loading / success / error rendering)
// ---------------------------------------------------------------------------

export type WeatherUIState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: WeatherData }
  | { status: "error"; message: string };

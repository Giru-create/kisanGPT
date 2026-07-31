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
  "none" | "low" | "moderate" | "high" | "extreme";

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
// Air Quality
// ---------------------------------------------------------------------------

export interface AirQuality {
  aqi: number;
  label: string;
  color: string;
  description: string;
}

// ---------------------------------------------------------------------------
// Current conditions
// ---------------------------------------------------------------------------

export interface CurrentWeather {
  condition: WeatherCondition;
  temperatureC: number;
  feelsLikeC: number;
  humidity: number;
  windSpeedKmh: number;
  windDirection: string;
  uvIndex: number;
  rainChancePercent: number;
  visibility: number;
  pressure: number;
  sunriseTime: string;
  sunsetTime: string;
  airQuality?: AirQuality;
  updatedAt: Date;
}

// ---------------------------------------------------------------------------
// Hourly forecast
// ---------------------------------------------------------------------------

export interface HourlyForecast {
  hour: number;
  temperatureC: number;
  condition: WeatherCondition;
  rainChancePercent: number;
  humidity: number;
  windSpeedKmh: number;
}

// ---------------------------------------------------------------------------
// 7-day forecast
// ---------------------------------------------------------------------------

export interface ForecastDay {
  date: Date;
  condition: WeatherCondition;
  highC: number;
  lowC: number;
  rainChancePercent: number;
  humidity: number;
  windSpeedKmh: number;
}

// ---------------------------------------------------------------------------
// Risk alerts
// ---------------------------------------------------------------------------

export type RiskType =
  | "heavy-rain"
  | "heatwave"
  | "frost"
  | "strong-wind"
  | "storm"
  | "high-uv"
  | "fog";

export type RiskSeverity = "low" | "moderate" | "high" | "extreme";

export interface RiskAlert {
  id: string;
  type: RiskType;
  severity: RiskSeverity;
  title: string;
  description: string;
  action: string;
  validFrom: string;
  validUntil: string;
}

// ---------------------------------------------------------------------------
// Farm impact
// ---------------------------------------------------------------------------

export type FarmImpactArea =
  "crop-health" | "soil-moisture" | "pest-risk" | "irrigation" | "harvest";

export type FarmImpactLevel = "positive" | "neutral" | "negative" | "critical";

export interface FarmImpactItem {
  area: FarmImpactArea;
  level: FarmImpactLevel;
  title: string;
  description: string;
  action?: string;
}

// ---------------------------------------------------------------------------
// AI Weather summary
// ---------------------------------------------------------------------------

export interface WeatherSummary {
  text: string;
  confidence: number;
  generatedAt: Date;
}

// ---------------------------------------------------------------------------
// Farming recommendations
// ---------------------------------------------------------------------------

export interface IrrigationWindow {
  start: string;
  end: string;
}

export interface FarmingRecommendation {
  severity: RecommendationSeverity;
  alertMessage?: string;
  irrigationWindow?: IrrigationWindow;
  fertilizerTiming?: string;
  sprayingAdvice?: string;
  harvestGuidance?: string;
  cropTip?: string;
  confidence: number;
  reasoning?: string;
  chatContextPayload?: string;
}

// ---------------------------------------------------------------------------
// Weather history
// ---------------------------------------------------------------------------

export interface WeatherHistoryDay {
  date: Date;
  highC: number;
  lowC: number;
  rainfall: number;
  humidity: number;
}

// ---------------------------------------------------------------------------
// Aggregated weather data
// ---------------------------------------------------------------------------

export interface WeatherData {
  location: FarmLocation;
  current: CurrentWeather;
  hourly: HourlyForecast[];
  forecast: ForecastDay[];
  recommendation: FarmingRecommendation;
  riskAlerts: RiskAlert[];
  farmImpact: FarmImpactItem[];
  summary: WeatherSummary;
  history: WeatherHistoryDay[];
}

// ---------------------------------------------------------------------------
// UI state (discriminated union)
// ---------------------------------------------------------------------------

export type WeatherUIState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: WeatherData }
  | { status: "error"; message: string };

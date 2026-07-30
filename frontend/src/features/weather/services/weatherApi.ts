// ─────────────────────────────────────────────────────────────────────────────
// weatherApi.ts
// KisanGPT — Weather Intelligence API Client
// Maps frontend services to FastAPI /api/v1/weather REST endpoints
// ─────────────────────────────────────────────────────────────────────────────

import { apiClient } from "@/lib/apiClient";

// ---------------------------------------------------------------------------
// Backend response shapes (snake_case from Pydantic)
// ---------------------------------------------------------------------------

export interface BackendCoordinates {
  latitude: number;
  longitude: number;
}

export interface BackendWeatherCondition {
  main: string;
  description: string;
  icon: string;
}

export interface BackendCurrentWeather {
  temperature: number;
  feels_like: number;
  humidity: number;
  pressure: number;
  wind_speed: number;
  wind_deg: number;
  visibility: number;
  clouds: number;
  conditions: BackendWeatherCondition[];
  dt: string;
  city: string;
  country: string;
  coordinates: BackendCoordinates;
}

export interface BackendDailyForecast {
  date: string;
  temp_min: number;
  temp_max: number;
  humidity: number;
  wind_speed: number;
  conditions: BackendWeatherCondition[];
  pop: number;
  summary: string;
}

export interface BackendForecastResponse {
  city: string;
  country: string;
  coordinates: BackendCoordinates;
  daily: BackendDailyForecast[];
}

export interface BackendFarmingAdvice {
  category: string;
  title: string;
  message: string;
  severity: string;
}

export interface BackendWeatherAdviceResponse {
  location: string;
  generated_at: string;
  current_summary: string;
  advice: BackendFarmingAdvice[];
}

// ---------------------------------------------------------------------------
// API methods
// ---------------------------------------------------------------------------

export const weatherApi = {
  getCurrent: async (options?: {
    lat?: number;
    lon?: number;
    city?: string;
  }): Promise<BackendCurrentWeather> => {
    return apiClient.get<BackendCurrentWeather>("/weather/current", {
      params: options,
    });
  },

  getForecast: async (
    options?: { lat?: number; lon?: number; city?: string },
    days: number = 7,
  ): Promise<BackendForecastResponse> => {
    return apiClient.get<BackendForecastResponse>("/weather/forecast", {
      params: { ...options, days },
    });
  },

  getAdvice: async (options?: {
    lat?: number;
    lon?: number;
    city?: string;
  }): Promise<BackendWeatherAdviceResponse> => {
    return apiClient.get<BackendWeatherAdviceResponse>("/weather/advice", {
      params: options,
    });
  },
};

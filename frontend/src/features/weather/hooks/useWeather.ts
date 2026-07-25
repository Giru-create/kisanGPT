// ─────────────────────────────────────────────────────────────────────────────
// useWeather.ts
// KisanGPT — Weather Intelligence hook
//
// Wires the Zustand store to mock data today.
// Later: swap fetchWeather() to call the real FastAPI /weather endpoint.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useEffect, useCallback } from "react";
import { useWeatherStore, selectWeatherState, selectUnit } from "../store/weatherStore";
import { MOCK_WEATHER_DATA } from "../constants/weather.constants";
import type { WeatherData, TemperatureUnit } from "../types/weather.types";

// ---------------------------------------------------------------------------
// Temperature conversion utilities
// ---------------------------------------------------------------------------

export function celsiusToFahrenheit(c: number): number {
  return Math.round((c * 9) / 5 + 32);
}

export function convertTemp(c: number, unit: TemperatureUnit): number {
  return unit === "celsius" ? c : celsiusToFahrenheit(c);
}

export function unitSymbol(unit: TemperatureUnit): string {
  return unit === "celsius" ? "°C" : "°F";
}

// ---------------------------------------------------------------------------
// Relative time helper — "2 minutes ago", "just now", etc.
// ---------------------------------------------------------------------------

export function relativeTime(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

// ---------------------------------------------------------------------------
// Simulated fetch — replace body with real API call in a later milestone
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function fetchWeather(_location: unknown): Promise<WeatherData> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 1800));

  // TODO (Milestone N): return await api.get<WeatherData>(`/weather?lat=...&lng=...`)
  return MOCK_WEATHER_DATA;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useWeather() {
  const weatherState = useWeatherStore(selectWeatherState);
  const unit = useWeatherStore(selectUnit);
  const { setWeatherState, toggleUnit, setLocation } = useWeatherStore();

  const load = useCallback(async () => {
    setWeatherState({ status: "loading" });
    try {
      const data = await fetchWeather(null);
      setWeatherState({ status: "success", data });
      setLocation(data.location);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to load weather data. Please try again.";
      setWeatherState({ status: "error", message });
    }
  }, [setWeatherState, setLocation]);

  // Auto-load on mount
  useEffect(() => {
    load();
  }, [load]);

  return {
    weatherState,
    unit,
    toggleUnit,
    refresh: load,
    convertTemp: (c: number) => convertTemp(c, unit),
    unitSymbol: unitSymbol(unit),
    relativeTime,
  };
}

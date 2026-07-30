// ─────────────────────────────────────────────────────────────────────────────
// useWeather.ts
// KisanGPT — Weather Intelligence hook
//
// Orchestrates React Query (data fetching) + Zustand (UI state).
// Temperature conversion utilities are preserved for component use.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useCallback } from "react";
import {
  useWeatherStore,
  selectLocation,
  selectUnit,
  selectToggleUnit,
} from "../store/weatherStore";
import { useWeatherQuery } from "./useWeatherQuery";
import type { TemperatureUnit, WeatherUIState } from "../types/weather.types";

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
// Hook
// ---------------------------------------------------------------------------

export function useWeather() {
  const location = useWeatherStore(selectLocation);
  const unit = useWeatherStore(selectUnit);
  const toggleUnit = useWeatherStore(selectToggleUnit);
  const { refetch } = useWeatherQuery(location);

  const query = useWeatherQuery(location);

  const weatherState: WeatherUIState = (() => {
    if (!location && !query.data) return { status: "idle" };
    if (query.isPending) return { status: "loading" };
    if (query.isError) {
      const message =
        query.error instanceof Error
          ? query.error.message
          : "Unable to load weather data. Please try again.";
      return { status: "error", message };
    }
    if (query.data) return { status: "success", data: query.data };
    return { status: "loading" };
  })();

  const refresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    weatherState,
    unit,
    toggleUnit,
    refresh,
    convertTemp: (c: number) => convertTemp(c, unit),
    unitSymbol: unitSymbol(unit),
    relativeTime,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// useWeatherQuery.ts
// KisanGPT — React Query hooks for weather data fetching
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useQuery } from "@tanstack/react-query";
import { weatherService } from "../services/weatherService";
import type { FarmLocation } from "../types/weather.types";

const WEATHER_QUERY_KEY = ["weather"] as const;

export function useWeatherQuery(location: FarmLocation | null) {
  return useQuery({
    queryKey: [...WEATHER_QUERY_KEY, location],
    queryFn: () =>
      weatherService.getWeatherData(
        location ? { lat: location.lat, lon: location.lng } : undefined,
      ),
    enabled: location !== null,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

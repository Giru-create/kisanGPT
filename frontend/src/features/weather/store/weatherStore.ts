// ─────────────────────────────────────────────────────────────────────────────
// weatherStore.ts
// KisanGPT — Weather Intelligence Zustand slice
// UI-only state: location preference + temperature unit
// Weather data itself is managed by React Query in useWeatherQuery.ts
// ─────────────────────────────────────────────────────────────────────────────

import { create } from "zustand";
import type { FarmLocation, TemperatureUnit } from "../types/weather.types";

// ---------------------------------------------------------------------------
// Store shape
// ---------------------------------------------------------------------------

interface WeatherStore {
  /** Currently selected farm location */
  location: FarmLocation | null;

  /** Display unit preference */
  unit: TemperatureUnit;

  // Actions
  setLocation: (location: FarmLocation) => void;
  toggleUnit: () => void;
  reset: () => void;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useWeatherStore = create<WeatherStore>((set) => ({
  location: {
    village: "Karnal",
    district: "Karnal",
    state: "Haryana",
    lat: 29.6857,
    lng: 76.9905,
  },
  unit: "celsius",

  setLocation: (location) => set({ location }),

  toggleUnit: () =>
    set((state) => ({
      unit: state.unit === "celsius" ? "fahrenheit" : "celsius",
    })),

  reset: () =>
    set({
      location: null,
      unit: "celsius",
    }),
}));

// ---------------------------------------------------------------------------
// Selector helpers — import these instead of inline selectors in components
// ---------------------------------------------------------------------------

export const selectLocation = (s: WeatherStore) => s.location;
export const selectUnit = (s: WeatherStore) => s.unit;
export const selectToggleUnit = (s: WeatherStore) => s.toggleUnit;

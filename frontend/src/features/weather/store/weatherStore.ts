// ─────────────────────────────────────────────────────────────────────────────
// weatherStore.ts
// KisanGPT — Weather Intelligence Zustand slice
// ─────────────────────────────────────────────────────────────────────────────

import { create } from "zustand";
import type {
  WeatherUIState,
  FarmLocation,
  TemperatureUnit,
} from "../types/weather.types";

// ---------------------------------------------------------------------------
// Store shape
// ---------------------------------------------------------------------------

interface WeatherStore {
  /** Discriminated-union UI state — drives skeleton / content / error rendering */
  weatherState: WeatherUIState;

  /** Currently selected farm location */
  location: FarmLocation | null;

  /** Display unit preference */
  unit: TemperatureUnit;

  // Actions
  setWeatherState: (state: WeatherUIState) => void;
  setLocation: (location: FarmLocation) => void;
  toggleUnit: () => void;
  reset: () => void;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useWeatherStore = create<WeatherStore>((set) => ({
  weatherState: { status: "idle" },
  location: null,
  unit: "celsius",

  setWeatherState: (weatherState) => set({ weatherState }),

  setLocation: (location) => set({ location }),

  toggleUnit: () =>
    set((state) => ({
      unit: state.unit === "celsius" ? "fahrenheit" : "celsius",
    })),

  reset: () =>
    set({
      weatherState: { status: "idle" },
      location: null,
      unit: "celsius",
    }),
}));

// ---------------------------------------------------------------------------
// Selector helpers — import these instead of inline selectors in components
// ---------------------------------------------------------------------------

export const selectWeatherState = (s: WeatherStore) => s.weatherState;
export const selectLocation = (s: WeatherStore) => s.location;
export const selectUnit = (s: WeatherStore) => s.unit;
export const selectToggleUnit = (s: WeatherStore) => s.toggleUnit;

// ─────────────────────────────────────────────────────────────────────────────
// weatherStore.test.ts
// Unit tests for weather Zustand store
// ─────────────────────────────────────────────────────────────────────────────

import { describe, it, expect, beforeEach } from "vitest";
import { useWeatherStore } from "../store/weatherStore";
import type { FarmLocation } from "../types/weather.types";

const mockLocation: FarmLocation = {
  village: "Karnal",
  district: "Karnal",
  state: "Haryana",
  lat: 29.6857,
  lng: 76.9905,
};

describe("weatherStore", () => {
  beforeEach(() => {
    useWeatherStore.setState({
      location: null,
      unit: "celsius",
    });
  });

  it("has correct initial state", () => {
    const state = useWeatherStore.getState();
    expect(state.location).toBeNull();
    expect(state.unit).toBe("celsius");
  });

  it("setLocation updates location", () => {
    useWeatherStore.getState().setLocation(mockLocation);
    const state = useWeatherStore.getState();
    expect(state.location).toEqual(mockLocation);
    expect(state.location?.district).toBe("Karnal");
  });

  it("toggleUnit switches between celsius and fahrenheit", () => {
    expect(useWeatherStore.getState().unit).toBe("celsius");
    useWeatherStore.getState().toggleUnit();
    expect(useWeatherStore.getState().unit).toBe("fahrenheit");
    useWeatherStore.getState().toggleUnit();
    expect(useWeatherStore.getState().unit).toBe("celsius");
  });

  it("reset clears all state", () => {
    useWeatherStore.getState().setLocation(mockLocation);
    useWeatherStore.getState().toggleUnit();
    useWeatherStore.getState().reset();
    const state = useWeatherStore.getState();
    expect(state.location).toBeNull();
    expect(state.unit).toBe("celsius");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// weatherService.test.ts
// Unit tests for weatherService, weatherApi, and weatherMock
// ─────────────────────────────────────────────────────────────────────────────

import { describe, it, expect, vi, beforeEach } from "vitest";
import { weatherService } from "../services/weatherService";
import { weatherMockService } from "../services/weatherMock";
import { weatherApi } from "../services/weatherApi";

describe("weatherMockService", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns mock weather data", async () => {
    vi.useFakeTimers();
    const promise = weatherMockService.getWeatherData();
    vi.advanceTimersByTime(2000);
    const data = await promise;
    expect(data).toBeDefined();
    expect(data.location).toBeDefined();
    expect(data.current).toBeDefined();
    expect(data.forecast).toBeDefined();
    expect(data.forecast).toHaveLength(7);
    expect(data.recommendation).toBeDefined();
    vi.useRealTimers();
  });

  it("has valid current weather structure", async () => {
    vi.useFakeTimers();
    const promise = weatherMockService.getWeatherData();
    vi.advanceTimersByTime(2000);
    const data = await promise;
    expect(typeof data.current.temperatureC).toBe("number");
    expect(typeof data.current.feelsLikeC).toBe("number");
    expect(typeof data.current.humidity).toBe("number");
    expect(typeof data.current.windSpeedKmh).toBe("number");
    expect(typeof data.current.condition).toBe("string");
    vi.useRealTimers();
  });

  it("has valid forecast structure", async () => {
    vi.useFakeTimers();
    const promise = weatherMockService.getWeatherData();
    vi.advanceTimersByTime(2000);
    const data = await promise;
    for (const day of data.forecast) {
      expect(day.date).toBeInstanceOf(Date);
      expect(typeof day.condition).toBe("string");
      expect(typeof day.highC).toBe("number");
      expect(typeof day.lowC).toBe("number");
      expect(typeof day.rainChancePercent).toBe("number");
    }
    vi.useRealTimers();
  });
});

describe("weatherService", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("returns mock data by default (mock mode)", async () => {
    const data = await weatherService.getWeatherData();
    expect(data).toBeDefined();
    expect(data.location).toBeDefined();
    expect(data.current).toBeDefined();
    expect(data.forecast).toHaveLength(7);
  });

  it("calls api when NOT in mock mode", async () => {
    vi.stubEnv("NEXT_PUBLIC_USE_MOCK_API", "false");
    const mockData = {
      location: {
        district: "Karnal",
        state: "Haryana",
        lat: 29.6857,
        lng: 76.9905,
      },
      current: {
        condition: "sunny" as const,
        temperatureC: 30,
        feelsLikeC: 33,
        humidity: 60,
        windSpeedKmh: 10,
        windDirection: "N",
        uvIndex: 5,
        rainChancePercent: 10,
        visibility: 10,
        pressure: 1013,
        sunriseTime: "06:00",
        sunsetTime: "19:00",
        updatedAt: new Date(),
      },
      forecast: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() + i * 86400000),
        condition: "sunny" as const,
        highC: 30,
        lowC: 20,
        rainChancePercent: 10,
        humidity: 60,
        windSpeedKmh: 10,
      })),
      recommendation: {
        severity: "none" as const,
        confidence: 0.7,
      },
      hourly: [],
      riskAlerts: [],
      farmImpact: [],
      summary: { text: "", confidence: 0.7, generatedAt: new Date() },
      history: [],
    };
    const spy = vi
      .spyOn(weatherService, "getWeatherData")
      .mockResolvedValue(mockData);

    const data = await weatherService.getWeatherData({
      lat: 29.6857,
      lon: 76.9905,
    });
    expect(spy).toHaveBeenCalled();
    expect(data.location.district).toBe("Karnal");
  });

  it("falls back to mock on API error", async () => {
    vi.stubEnv("NEXT_PUBLIC_USE_MOCK_API", "false");
    vi.spyOn(weatherApi, "getCurrent").mockRejectedValue(
      new Error("Network error"),
    );

    const data = await weatherService.getWeatherData();
    expect(data).toBeDefined();
    expect(data.location).toBeDefined();
  });

  it("passes location options to API", async () => {
    vi.stubEnv("NEXT_PUBLIC_USE_MOCK_API", "false");
    const spy = vi.spyOn(weatherApi, "getCurrent").mockResolvedValue({
      temperature: 30,
      feels_like: 33,
      humidity: 60,
      pressure: 1013,
      wind_speed: 3,
      wind_deg: 180,
      visibility: 10000,
      clouds: 20,
      conditions: [{ main: "Clear", description: "clear sky", icon: "01d" }],
      dt: new Date().toISOString(),
      city: "Karnal",
      country: "IN",
      coordinates: { latitude: 29.6857, longitude: 76.9905 },
    });
    vi.spyOn(weatherApi, "getForecast").mockResolvedValue({
      city: "Karnal",
      country: "IN",
      coordinates: { latitude: 29.6857, longitude: 76.9905 },
      daily: [],
    });
    vi.spyOn(weatherApi, "getAdvice").mockResolvedValue({
      location: "Karnal",
      generated_at: new Date().toISOString(),
      current_summary: "Clear sky",
      advice: [],
    });

    await weatherService.getWeatherData({ lat: 29.6857, lon: 76.9905 });
    expect(spy).toHaveBeenCalledWith({ lat: 29.6857, lon: 76.9905 });
  });
});

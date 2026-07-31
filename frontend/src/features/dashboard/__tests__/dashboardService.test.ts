// ─────────────────────────────────────────────────────────────────────────────
// dashboardService.test.ts
// Unit tests for dashboardService, dashboardApi, and dashboardMock
// ─────────────────────────────────────────────────────────────────────────────

import { describe, it, expect, vi, beforeEach } from "vitest";
import { dashboardService } from "../services/dashboardService";
import { dashboardMockService } from "../services/dashboardMock";
import { dashboardApi } from "../services/dashboardApi";

describe("dashboardMockService", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns mock dashboard data", async () => {
    vi.useFakeTimers();
    const dataPromise = dashboardMockService.getDashboard();
    vi.advanceTimersByTime(800);
    const data = await dataPromise;
    expect(data).toBeDefined();
    expect(data.profile).toBeDefined();
    expect(data.weatherSummary).toBeDefined();
    expect(data.cropHealthCards).toBeDefined();
    expect(data.marketTrends).toBeDefined();
    expect(data.aiAdvisorChats).toBeDefined();
    expect(data.priorityAlerts).toBeDefined();
    expect(data.notifications).toBeDefined();
    vi.useRealTimers();
  });

  it("returns valid profile structure", async () => {
    vi.useFakeTimers();
    const dataPromise = dashboardMockService.getDashboard();
    vi.advanceTimersByTime(800);
    const data = await dataPromise;
    expect(typeof data.profile.name).toBe("string");
    expect(typeof data.profile.greetingPrefix).toBe("string");
    expect(typeof data.profile.farmSizeAcres).toBe("number");
    vi.useRealTimers();
  });

  it("returns valid weather summary structure", async () => {
    vi.useFakeTimers();
    const dataPromise = dashboardMockService.getDashboard();
    vi.advanceTimersByTime(800);
    const data = await dataPromise;
    expect(typeof data.weatherSummary.temperatureC).toBe("number");
    expect(typeof data.weatherSummary.condition).toBe("string");
    expect(typeof data.weatherSummary.humidity).toBe("number");
    vi.useRealTimers();
  });
});

describe("dashboardService", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("returns mock data by default (mock mode)", async () => {
    const data = await dashboardService.getDashboard();
    expect(data).toBeDefined();
    expect(data.profile).toBeDefined();
    expect(data.weatherSummary).toBeDefined();
  });

  it("calls api when NOT in mock mode", async () => {
    vi.stubEnv("NEXT_PUBLIC_USE_MOCK_API", "false");
    const mockData = {
      profile: {
        name: "Test",
        greetingPrefix: "Hello",
        village: "TestVillage",
        district: "TestDistrict",
        state: "TestState",
        activeCrop: "Wheat",
        cropSeason: "Rabi",
        farmSizeAcres: 2.0,
      },
      weatherSummary: {
        temperatureC: 30,
        feelsLikeC: 32,
        condition: "sunny",
        humidity: 50,
        windSpeedKmh: 10,
        advisory: "Safe",
        advisorySafe: true,
      },
      cropFields: [],
      cropHealthCards: [],
      mandiPrices: [],
      marketTrends: [],
      aiAdvisorChats: [],
      priorityAlerts: [],
      schemes: [],
      recentActivities: [],
      notifications: [],
    };
    const getSpy = vi
      .spyOn(dashboardApi, "getDashboard")
      .mockResolvedValue(mockData as never);

    const data = await dashboardService.getDashboard();
    expect(getSpy).toHaveBeenCalled();
    expect(data.profile.name).toBe("Test");
  });

  it("falls back to mock on API error", async () => {
    vi.stubEnv("NEXT_PUBLIC_USE_MOCK_API", "false");
    vi.spyOn(dashboardApi, "getDashboard").mockRejectedValue(
      new Error("Network error"),
    );

    const data = await dashboardService.getDashboard();
    expect(data).toBeDefined();
    expect(data.profile).toBeDefined();
  });

  it("passes location options to API", async () => {
    vi.stubEnv("NEXT_PUBLIC_USE_MOCK_API", "false");
    const mockData = {
      profile: {
        name: "Test",
        greetingPrefix: "Hello",
        village: "TestVillage",
        district: "TestDistrict",
        state: "TestState",
        activeCrop: "Wheat",
        cropSeason: "Rabi",
        farmSizeAcres: 2.0,
      },
      weatherSummary: {
        temperatureC: 30,
        feelsLikeC: 32,
        condition: "sunny",
        humidity: 50,
        windSpeedKmh: 10,
        advisory: "Safe",
        advisorySafe: true,
      },
      cropFields: [],
      cropHealthCards: [],
      mandiPrices: [],
      marketTrends: [],
      aiAdvisorChats: [],
      priorityAlerts: [],
      schemes: [],
      recentActivities: [],
      notifications: [],
    };
    const getSpy = vi
      .spyOn(dashboardApi, "getDashboard")
      .mockResolvedValue(mockData as never);

    await dashboardService.getDashboard({ lat: 29.15, lon: 76.5 });
    expect(getSpy).toHaveBeenCalledWith({ lat: 29.15, lon: 76.5 });
  });

  it("passes token to API", async () => {
    vi.stubEnv("NEXT_PUBLIC_USE_MOCK_API", "false");
    const mockData = {
      profile: {
        name: "Test",
        greetingPrefix: "Hello",
        village: "V",
        district: "D",
        state: "S",
        activeCrop: "Wheat",
        cropSeason: "Rabi",
        farmSizeAcres: 2.0,
      },
      weatherSummary: {
        temperatureC: 30,
        feelsLikeC: 32,
        condition: "sunny",
        humidity: 50,
        windSpeedKmh: 10,
        advisory: "Safe",
        advisorySafe: true,
      },
      cropFields: [],
      cropHealthCards: [],
      mandiPrices: [],
      marketTrends: [],
      aiAdvisorChats: [],
      priorityAlerts: [],
      schemes: [],
      recentActivities: [],
      notifications: [],
    };
    const getSpy = vi
      .spyOn(dashboardApi, "getDashboard")
      .mockResolvedValue(mockData as never);

    await dashboardService.getDashboard({ token: "test-token-123" });
    expect(getSpy).toHaveBeenCalledWith({ token: "test-token-123" });
  });
});

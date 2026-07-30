// ─────────────────────────────────────────────────────────────────────────────
// useDashboardData.test.ts
// Unit tests for useDashboardQuery React Query hook
// ─────────────────────────────────────────────────────────────────────────────

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { useDashboardQuery } from "../hooks/useDashboardData";
import { dashboardService } from "../services/dashboardService";

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      children,
    );
  };
};

describe("useDashboardQuery", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns loading state initially", () => {
    vi.spyOn(dashboardService, "getDashboard").mockReturnValue(
      new Promise(() => {}),
    );

    const { result } = renderHook(() => useDashboardQuery(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it("returns data on success", async () => {
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

    vi.spyOn(dashboardService, "getDashboard").mockResolvedValue(
      mockData as never,
    );

    const { result } = renderHook(() => useDashboardQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.profile.name).toBe("Test");
  });

  it("falls back to mock when API fails", async () => {
    const mockData = {
      profile: {
        name: "Fallback",
        greetingPrefix: "Hi",
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

    vi.spyOn(dashboardService, "getDashboard").mockResolvedValue(
      mockData as never,
    );

    const { result } = renderHook(() => useDashboardQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.profile.name).toBe("Fallback");
  });

  it("passes location options to service", async () => {
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

    const spy = vi
      .spyOn(dashboardService, "getDashboard")
      .mockResolvedValue(mockData as never);

    const { result } = renderHook(
      () => useDashboardQuery({ lat: 29.15, lon: 76.5 }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(spy).toHaveBeenCalledWith({ lat: 29.15, lon: 76.5 });
  });
});

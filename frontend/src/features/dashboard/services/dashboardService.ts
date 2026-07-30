// ─────────────────────────────────────────────────────────────────────────────
// dashboardService.ts
// KisanGPT — Dashboard Unified Service Abstraction
// Decouples UI/hooks from backend API vs mock data sources
// ─────────────────────────────────────────────────────────────────────────────

import { dashboardApi } from "./dashboardApi";
import { dashboardMockService } from "./dashboardMock";
import type { DashboardData } from "../types/dashboard.types";

export interface IDashboardService {
  getDashboard: (options?: {
    lat?: number;
    lon?: number;
    city?: string;
  }) => Promise<DashboardData>;
}

function isMockMode(): boolean {
  return (
    process.env.NEXT_PUBLIC_USE_MOCK_API === undefined ||
    process.env.NEXT_PUBLIC_USE_MOCK_API === "true"
  );
}

export const dashboardService: IDashboardService = {
  getDashboard: async (options) => {
    if (isMockMode()) return dashboardMockService.getDashboard();
    try {
      return await dashboardApi.getDashboard(options);
    } catch (err) {
      console.warn("Dashboard API error, falling back to mock:", err);
      return dashboardMockService.getDashboard();
    }
  },
};

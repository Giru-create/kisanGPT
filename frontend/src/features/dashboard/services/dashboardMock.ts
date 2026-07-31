// ─────────────────────────────────────────────────────────────────────────────
// dashboardMock.ts
// KisanGPT — Dashboard Mock Service
// Provides fallback data when backend endpoints are unavailable
// ─────────────────────────────────────────────────────────────────────────────

import { DEFAULT_DASHBOARD_DATA } from "../constants/dashboard.constants";
import type { DashboardData } from "../types/dashboard.types";

const mockDelay = (ms: number = 800): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const dashboardMockService = {
  getDashboard: async (): Promise<DashboardData> => {
    await mockDelay(800);
    return JSON.parse(JSON.stringify(DEFAULT_DASHBOARD_DATA));
  },
};

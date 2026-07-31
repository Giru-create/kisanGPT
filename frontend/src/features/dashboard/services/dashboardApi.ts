// ─────────────────────────────────────────────────────────────────────────────
// dashboardApi.ts
// KisanGPT — Dashboard API Client
// Maps frontend services to FastAPI /api/v1/dashboard REST endpoint
// ─────────────────────────────────────────────────────────────────────────────

import { apiClient } from "@/lib/apiClient";
import type { DashboardData } from "../types/dashboard.types";

export const dashboardApi = {
  getDashboard: async (options?: {
    lat?: number;
    lon?: number;
    city?: string;
    token?: string;
  }): Promise<DashboardData> => {
    const { token, ...params } = options ?? {};
    return apiClient.get<DashboardData>("/dashboard", {
      params,
      token,
    });
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// useDashboard.ts
// KisanGPT — Farmer Dashboard hook
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useEffect, useCallback } from "react";
import { useDashboardStore, selectDashboardState } from "../store/dashboardStore";
import { MOCK_DASHBOARD_DATA } from "../constants/dashboard.constants";
import type { DashboardData } from "../types/dashboard.types";

async function fetchDashboardData(): Promise<DashboardData> {
  // Simulate network latency for realistic loading experience
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // TODO (Milestone N): replace with FastAPI call GET /api/v1/dashboard
  return MOCK_DASHBOARD_DATA;
}

export function useDashboard() {
  const dashboardState = useDashboardStore(selectDashboardState);
  const { setDashboardState, dismissEmergencyAlert, markNotificationRead } =
    useDashboardStore();

  const load = useCallback(async () => {
    setDashboardState({ status: "loading" });
    try {
      const data = await fetchDashboardData();
      setDashboardState({ status: "success", data });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to load dashboard data. Please check your internet connection.";
      setDashboardState({ status: "error", message });
    }
  }, [setDashboardState]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    dashboardState,
    refresh: load,
    dismissEmergencyAlert,
    markNotificationRead,
  };
}

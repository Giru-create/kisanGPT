// ─────────────────────────────────────────────────────────────────────────────
// useDashboard.ts
// KisanGPT — Farmer Dashboard hook with optimistic loading & screen reader announcements
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useEffect, useCallback } from "react";
import {
  useDashboardStore,
  selectDashboardState,
} from "../store/dashboardStore";
import { MOCK_DASHBOARD_DATA } from "../constants/dashboard.constants";
import type { DashboardData } from "../types/dashboard.types";
import { announceToScreenReader } from "@/utils/a11y";

async function fetchDashboardData(): Promise<DashboardData> {
  // Simulate network latency for realistic loading experience
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Connects to FastAPI endpoint or falls back gracefully to mock data
  try {
    const res = await fetch("/api/v1/dashboard", { cache: "no-store" });
    if (res.ok) {
      return (await res.json()) as DashboardData;
    }
  } catch {
    // API not reachable in mock mode; return full fallback mock data
  }

  return MOCK_DASHBOARD_DATA;
}

export function useDashboard() {
  const dashboardState = useDashboardStore(selectDashboardState);
  const {
    setDashboardState,
    dismissEmergencyAlert,
    markNotificationRead,
    markAllNotificationsRead,
    updateProfileLocation,
  } = useDashboardStore();

  const load = useCallback(async () => {
    setDashboardState({ status: "loading" });
    try {
      const data = await fetchDashboardData();
      setDashboardState({ status: "success", data });
      announceToScreenReader("Farmer dashboard loaded successfully");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to load dashboard data. Please check your internet connection.";
      setDashboardState({ status: "error", message });
      announceToScreenReader("Failed to load dashboard data");
    }
  }, [setDashboardState]);

  useEffect(() => {
    if (dashboardState.status === "idle") {
      load();
    }
  }, [dashboardState.status, load]);

  const handleMarkNotificationRead = useCallback(
    (id: string) => {
      markNotificationRead(id);
      announceToScreenReader("Notification marked as read");
    },
    [markNotificationRead],
  );

  const handleMarkAllRead = useCallback(() => {
    markAllNotificationsRead();
    announceToScreenReader("All notifications marked as read");
  }, [markAllNotificationsRead]);

  const handleDismissAlert = useCallback(
    (alertId: string) => {
      dismissEmergencyAlert(alertId);
      announceToScreenReader("Emergency alert dismissed");
    },
    [dismissEmergencyAlert],
  );

  return {
    dashboardState,
    refresh: load,
    dismissEmergencyAlert: handleDismissAlert,
    markNotificationRead: handleMarkNotificationRead,
    markAllNotificationsRead: handleMarkAllRead,
    updateProfileLocation,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// useDashboard.ts
// KisanGPT — Farmer Dashboard hook with React Query + Zustand
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useCallback, useMemo } from "react";
import { useDashboardStore } from "../store/dashboardStore";
import { useDashboardQuery } from "./useDashboardData";
import { announceToScreenReader } from "@/utils/a11y";
import type { DashboardData } from "../types/dashboard.types";

export function useDashboard(options?: {
  lat?: number;
  lon?: number;
  city?: string;
  token?: string;
}) {
  const {
    data: apiData,
    isLoading,
    isError,
    error,
    refetch,
  } = useDashboardQuery(options);

  const {
    dismissedEmergencyAlertId,
    localNotifications,
    localProfile,
    dismissEmergencyAlert,
    markNotificationRead,
    markAllNotificationsRead,
    updateProfileLocation,
    reset,
  } = useDashboardStore();

  const dashboardState = useMemo(() => {
    if (isLoading || apiData === undefined) {
      return { status: "loading" as const };
    }
    if (isError) {
      return {
        status: "error" as const,
        message:
          error instanceof Error
            ? error.message
            : "Unable to load dashboard data. Please check your internet connection.",
      };
    }

    const data: DashboardData = {
      ...apiData,
      notifications: localNotifications ?? apiData.notifications,
      profile: localProfile ?? apiData.profile,
    };

    return { status: "success" as const, data };
  }, [apiData, isLoading, isError, error, localNotifications, localProfile]);

  const refresh = useCallback(() => {
    announceToScreenReader("Refreshing dashboard data");
    refetch();
  }, [refetch]);

  const handleDismissAlert = useCallback(
    (alertId: string) => {
      dismissEmergencyAlert(alertId);
      announceToScreenReader("Emergency alert dismissed");
    },
    [dismissEmergencyAlert],
  );

  const handleMarkNotificationRead = useCallback(
    (id: string) => {
      if (dashboardState.status !== "success") return;
      markNotificationRead(id, dashboardState.data.notifications);
      announceToScreenReader("Notification marked as read");
    },
    [dashboardState, markNotificationRead],
  );

  const handleMarkAllRead = useCallback(() => {
    if (dashboardState.status !== "success") return;
    markAllNotificationsRead(dashboardState.data.notifications);
    announceToScreenReader("All notifications marked as read");
  }, [dashboardState, markAllNotificationsRead]);

  const handleUpdateProfileLocation = useCallback(
    (village: string, district: string) => {
      if (dashboardState.status !== "success") return;
      updateProfileLocation(village, district, dashboardState.data.profile);
      announceToScreenReader("Profile location updated");
    },
    [dashboardState, updateProfileLocation],
  );

  return {
    dashboardState,
    dismissedEmergencyAlertId,
    refresh,
    dismissEmergencyAlert: handleDismissAlert,
    markNotificationRead: handleMarkNotificationRead,
    markAllNotificationsRead: handleMarkAllRead,
    updateProfileLocation: handleUpdateProfileLocation,
    reset,
  };
}

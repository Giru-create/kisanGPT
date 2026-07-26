// ─────────────────────────────────────────────────────────────────────────────
// dashboardStore.ts
// KisanGPT — Farmer Dashboard Zustand slice
// ─────────────────────────────────────────────────────────────────────────────

import { create } from "zustand";
import type { DashboardUIState } from "../types/dashboard.types";

interface DashboardStore {
  dashboardState: DashboardUIState;
  dismissedEmergencyAlertId: string | null;

  setDashboardState: (state: DashboardUIState) => void;
  dismissEmergencyAlert: (alertId: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  updateProfileLocation: (village: string, district: string) => void;
  reset: () => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  dashboardState: { status: "idle" },
  dismissedEmergencyAlertId: null,

  setDashboardState: (dashboardState) => set({ dashboardState }),

  dismissEmergencyAlert: (alertId) =>
    set({ dismissedEmergencyAlertId: alertId }),

  markNotificationRead: (id) =>
    set((state) => {
      if (state.dashboardState.status !== "success") return state;

      const updatedNotifs = state.dashboardState.data.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n,
      );

      return {
        dashboardState: {
          status: "success",
          data: {
            ...state.dashboardState.data,
            notifications: updatedNotifs,
          },
        },
      };
    }),

  markAllNotificationsRead: () =>
    set((state) => {
      if (state.dashboardState.status !== "success") return state;

      const updatedNotifs = state.dashboardState.data.notifications.map(
        (n) => ({
          ...n,
          read: true,
        }),
      );

      return {
        dashboardState: {
          status: "success",
          data: {
            ...state.dashboardState.data,
            notifications: updatedNotifs,
          },
        },
      };
    }),

  updateProfileLocation: (village, district) =>
    set((state) => {
      if (state.dashboardState.status !== "success") return state;

      return {
        dashboardState: {
          status: "success",
          data: {
            ...state.dashboardState.data,
            profile: {
              ...state.dashboardState.data.profile,
              village,
              district,
            },
          },
        },
      };
    }),

  reset: () =>
    set({
      dashboardState: { status: "idle" },
      dismissedEmergencyAlertId: null,
    }),
}));

export const selectDashboardState = (s: DashboardStore) => s.dashboardState;
export const selectDismissedAlertId = (s: DashboardStore) =>
  s.dismissedEmergencyAlertId;

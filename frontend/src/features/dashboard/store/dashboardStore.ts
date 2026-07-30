// ─────────────────────────────────────────────────────────────────────────────
// dashboardStore.ts
// KisanGPT — Farmer Dashboard Zustand slice
// Manages UI-only state (dismissed alerts, notification reads, profile edits)
// ─────────────────────────────────────────────────────────────────────────────

import { create } from "zustand";
import type { DashboardData } from "../types/dashboard.types";

interface DashboardStore {
  dismissedEmergencyAlertId: string | null;
  localNotifications: DashboardData["notifications"] | null;
  localProfile: DashboardData["profile"] | null;

  dismissEmergencyAlert: (alertId: string) => void;
  markNotificationRead: (
    id: string,
    notifications: DashboardData["notifications"],
  ) => DashboardData["notifications"];
  markAllNotificationsRead: (
    notifications: DashboardData["notifications"],
  ) => DashboardData["notifications"];
  updateProfileLocation: (
    village: string,
    district: string,
    profile: DashboardData["profile"],
  ) => DashboardData["profile"];
  reset: () => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  dismissedEmergencyAlertId: null,
  localNotifications: null,
  localProfile: null,

  dismissEmergencyAlert: (alertId) =>
    set({ dismissedEmergencyAlertId: alertId }),

  markNotificationRead: (id, notifications) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n,
    );
    set({ localNotifications: updated });
    return updated;
  },

  markAllNotificationsRead: (notifications) => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    set({ localNotifications: updated });
    return updated;
  },

  updateProfileLocation: (village, district, profile) => {
    const updated = { ...profile, village, district };
    set({ localProfile: updated });
    return updated;
  },

  reset: () =>
    set({
      dismissedEmergencyAlertId: null,
      localNotifications: null,
      localProfile: null,
    }),
}));

export const selectDismissedAlertId = (s: DashboardStore) =>
  s.dismissedEmergencyAlertId;

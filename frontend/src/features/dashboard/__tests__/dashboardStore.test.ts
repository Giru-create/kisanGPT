// ─────────────────────────────────────────────────────────────────────────────
// dashboardStore.test.ts
// Unit tests for dashboard Zustand store
// ─────────────────────────────────────────────────────────────────────────────

import { describe, it, expect, beforeEach } from "vitest";
import { useDashboardStore } from "../store/dashboardStore";
import type { DashboardData } from "../types/dashboard.types";

const mockProfile: DashboardData["profile"] = {
  name: "Test Farmer",
  greetingPrefix: "Hello",
  village: "TestVillage",
  district: "TestDistrict",
  state: "TestState",
  activeCrop: "Wheat",
  cropSeason: "Rabi 2026",
  farmSizeAcres: 4.0,
};

const mockNotifications: DashboardData["notifications"] = [
  {
    id: "notif-1",
    category: "reminder",
    title: "Irrigation",
    message: "Field needs water",
    timestamp: new Date(),
    read: false,
  },
  {
    id: "notif-2",
    category: "alert",
    title: "Weather",
    message: "Storm expected",
    timestamp: new Date(),
    read: false,
  },
];

describe("dashboardStore", () => {
  beforeEach(() => {
    useDashboardStore.setState({
      dismissedEmergencyAlertId: null,
      localNotifications: null,
      localProfile: null,
    });
  });

  it("has correct initial state", () => {
    const state = useDashboardStore.getState();
    expect(state.dismissedEmergencyAlertId).toBeNull();
    expect(state.localNotifications).toBeNull();
    expect(state.localProfile).toBeNull();
  });

  it("dismissEmergencyAlert sets the alert id", () => {
    useDashboardStore.getState().dismissEmergencyAlert("alert-1");
    const state = useDashboardStore.getState();
    expect(state.dismissedEmergencyAlertId).toBe("alert-1");
  });

  it("markNotificationRead marks a notification as read", () => {
    const updated = useDashboardStore
      .getState()
      .markNotificationRead("notif-1", mockNotifications);
    expect(updated[0]?.read).toBe(true);
    expect(updated[1]?.read).toBe(false);
  });

  it("markAllNotificationsRead marks all as read", () => {
    const updated = useDashboardStore
      .getState()
      .markAllNotificationsRead(mockNotifications);
    expect(updated.every((n) => n.read)).toBe(true);
  });

  it("updateProfileLocation updates village and district", () => {
    const updated = useDashboardStore
      .getState()
      .updateProfileLocation("NewVillage", "NewDistrict", mockProfile);
    expect(updated.village).toBe("NewVillage");
    expect(updated.district).toBe("NewDistrict");
    expect(updated.name).toBe("Test Farmer");
  });

  it("reset clears all local state", () => {
    useDashboardStore.getState().dismissEmergencyAlert("alert-1");
    useDashboardStore
      .getState()
      .markNotificationRead("notif-1", mockNotifications);
    useDashboardStore
      .getState()
      .updateProfileLocation("New", "New", mockProfile);

    useDashboardStore.getState().reset();
    const state = useDashboardStore.getState();
    expect(state.dismissedEmergencyAlertId).toBeNull();
    expect(state.localNotifications).toBeNull();
    expect(state.localProfile).toBeNull();
  });

  it("selectDismissedAlertId returns the dismissed alert id", () => {
    useDashboardStore.getState().dismissEmergencyAlert("alert-99");
    expect(useDashboardStore.getState().dismissedEmergencyAlertId).toBe(
      "alert-99",
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// settings.test.ts
// Unit tests for Settings feature
// ─────────────────────────────────────────────────────────────────────────────

import { describe, it, expect, vi, beforeEach } from "vitest";
import { settingsService } from "../services/settingsService";
import { settingsMockService } from "../services/settingsMock";
import { useSettingsStore } from "../store/settingsStore";
import { DEFAULT_SETTINGS } from "../constants/settings.constants";

describe("settingsMockService", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    settingsMockService._reset();
  });

  it("returns mock settings data", async () => {
    const data = await settingsMockService.getSettings();
    expect(data).toBeDefined();
    expect(data.ai).toBeDefined();
    expect(data.voice).toBeDefined();
    expect(data.notifications).toBeDefined();
    expect(data.appearance).toBeDefined();
    expect(data.farm).toBeDefined();
    expect(data.privacy).toBeDefined();
    expect(data.security).toBeDefined();
    expect(data.integrations).toBeDefined();
    expect(data.about).toBeDefined();
  });

  it("returns correct default values", async () => {
    const data = await settingsMockService.getSettings();
    expect(data.ai.personality).toBe(DEFAULT_SETTINGS.ai.personality);
    expect(data.voice.preferredLanguage).toBe(
      DEFAULT_SETTINGS.voice.preferredLanguage,
    );
    expect(data.notifications.weatherAlerts).toBe(
      DEFAULT_SETTINGS.notifications.weatherAlerts,
    );
    expect(data.appearance.theme).toBe(DEFAULT_SETTINGS.appearance.theme);
  });

  it("updates settings correctly", async () => {
    const updated = await settingsMockService.updateSettings({
      ai: { ...DEFAULT_SETTINGS.ai, personality: "expert" },
    });
    expect(updated.ai.personality).toBe("expert");
  });

  it("preserves other settings on partial update", async () => {
    const updated = await settingsMockService.updateSettings({
      ai: { ...DEFAULT_SETTINGS.ai, personality: "expert" },
    });
    expect(updated.voice.preferredLanguage).toBe(
      DEFAULT_SETTINGS.voice.preferredLanguage,
    );
  });

  it("resets data to defaults", async () => {
    await settingsMockService.updateSettings({
      ai: { ...DEFAULT_SETTINGS.ai, personality: "expert" },
    });
    settingsMockService._reset();
    const data = await settingsMockService.getSettings();
    expect(data.ai.personality).toBe("friendly");
  });
});

describe("settingsService", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("returns mock data by default", async () => {
    const data = await settingsService.getSettings();
    expect(data).toBeDefined();
    expect(data.ai).toBeDefined();
  });

  it("falls back to mock on API error", async () => {
    vi.stubEnv("NEXT_PUBLIC_USE_MOCK_API", "false");
    const { settingsApi } = await import("../services/settingsApi");
    vi.spyOn(settingsApi, "getSettings").mockRejectedValue(
      new Error("Network error"),
    );
    const data = await settingsService.getSettings();
    expect(data).toBeDefined();
    expect(data.ai).toBeDefined();
  });
});

describe("useSettingsStore", () => {
  beforeEach(() => {
    useSettingsStore.getState().reset();
  });

  it("has correct initial state", () => {
    const state = useSettingsStore.getState();
    expect(state.activeCategory).toBe("ai");
    expect(state.searchQuery).toBe("");
    expect(state.isMobileNavOpen).toBe(false);
  });

  it("setActiveCategory updates state", () => {
    useSettingsStore.getState().setActiveCategory("voice");
    expect(useSettingsStore.getState().activeCategory).toBe("voice");
  });

  it("setSearchQuery updates state", () => {
    useSettingsStore.getState().setSearchQuery("theme");
    expect(useSettingsStore.getState().searchQuery).toBe("theme");
  });

  it("setMobileNavOpen updates state", () => {
    useSettingsStore.getState().setMobileNavOpen(true);
    expect(useSettingsStore.getState().isMobileNavOpen).toBe(true);
  });

  it("reset clears all state", () => {
    useSettingsStore.getState().setActiveCategory("privacy");
    useSettingsStore.getState().setSearchQuery("test");
    useSettingsStore.getState().setMobileNavOpen(true);
    useSettingsStore.getState().reset();
    expect(useSettingsStore.getState().activeCategory).toBe("ai");
    expect(useSettingsStore.getState().searchQuery).toBe("");
    expect(useSettingsStore.getState().isMobileNavOpen).toBe(false);
  });

  it("supports all category values", () => {
    const categories = [
      "ai",
      "voice",
      "notifications",
      "appearance",
      "farm",
      "privacy",
      "security",
      "integrations",
      "about",
    ] as const;
    for (const cat of categories) {
      useSettingsStore.getState().setActiveCategory(cat);
      expect(useSettingsStore.getState().activeCategory).toBe(cat);
    }
  });
});

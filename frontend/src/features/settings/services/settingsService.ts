// ─────────────────────────────────────────────────────────────────────────────
// settingsService.ts
// KisanGPT — Settings unified service
// ─────────────────────────────────────────────────────────────────────────────

import { settingsApi } from "./settingsApi";
import { settingsMockService } from "./settingsMock";
import type { SettingsData } from "../types/settings.types";

function isMockMode(): boolean {
  return (
    process.env.NEXT_PUBLIC_USE_MOCK_API === undefined ||
    process.env.NEXT_PUBLIC_USE_MOCK_API === "true"
  );
}

export const settingsService = {
  getSettings: async (): Promise<SettingsData> => {
    if (isMockMode()) return settingsMockService.getSettings();
    try {
      return await settingsApi.getSettings();
    } catch (err) {
      console.warn("Settings API error, falling back to mock:", err);
      return settingsMockService.getSettings();
    }
  },

  updateSettings: async (
    updates: Partial<SettingsData>,
  ): Promise<SettingsData> => {
    if (isMockMode()) return settingsMockService.updateSettings(updates);
    try {
      return await settingsApi.updateSettings(updates);
    } catch (err) {
      console.warn("Settings API error, falling back to mock:", err);
      return settingsMockService.updateSettings(updates);
    }
  },
};

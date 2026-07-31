// ─────────────────────────────────────────────────────────────────────────────
// settingsMock.ts
// KisanGPT — Settings mock service
// ─────────────────────────────────────────────────────────────────────────────

import { DEFAULT_SETTINGS } from "../constants/settings.constants";
import type { SettingsData } from "../types/settings.types";

const mockDelay = (ms: number = 400): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

let localData: SettingsData = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));

function resetLocalData(): void {
  localData = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
}

export const settingsMockService = {
  _reset: resetLocalData,

  getSettings: async (): Promise<SettingsData> => {
    await mockDelay();
    return JSON.parse(JSON.stringify(localData));
  },

  updateSettings: async (
    updates: Partial<SettingsData>,
  ): Promise<SettingsData> => {
    await mockDelay(300);
    localData = { ...localData, ...updates };
    return JSON.parse(JSON.stringify(localData));
  },
};

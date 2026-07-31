// ─────────────────────────────────────────────────────────────────────────────
// settingsApi.ts
// KisanGPT — Settings API client
// ─────────────────────────────────────────────────────────────────────────────

import { apiClient } from "@/lib/apiClient";
import type { SettingsData } from "../types/settings.types";

export const settingsApi = {
  getSettings: async (): Promise<SettingsData> => {
    return apiClient.get<SettingsData>("/settings");
  },

  updateSettings: async (
    updates: Partial<SettingsData>,
  ): Promise<SettingsData> => {
    return apiClient.put<SettingsData>("/settings", updates);
  },
};

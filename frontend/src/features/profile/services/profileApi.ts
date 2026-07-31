// ─────────────────────────────────────────────────────────────────────────────
// profileApi.ts
// KisanGPT — Farmer Profile API Client
// ─────────────────────────────────────────────────────────────────────────────

import { apiClient } from "@/lib/apiClient";
import type { ProfileData } from "../types/profile.types";

export const profileApi = {
  getProfile: async (): Promise<ProfileData> => {
    return apiClient.get<ProfileData>("/profile");
  },

  updateProfile: async (
    updates: Partial<ProfileData["profile"]>,
  ): Promise<ProfileData["profile"]> => {
    return apiClient.put<ProfileData["profile"]>("/profile", updates);
  },

  updateFarm: async (
    updates: Partial<ProfileData["farm"]>,
  ): Promise<ProfileData["farm"]> => {
    return apiClient.put<ProfileData["farm"]>("/profile/farm", updates);
  },

  updatePrivacySettings: async (
    settings: ProfileData["privacySettings"],
  ): Promise<ProfileData["privacySettings"]> => {
    return apiClient.put<ProfileData["privacySettings"]>(
      "/profile/privacy",
      settings,
    );
  },

  deleteAccount: async (): Promise<{ detail: string }> => {
    return apiClient.delete<{ detail: string }>("/profile");
  },
};

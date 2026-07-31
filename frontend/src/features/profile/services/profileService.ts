// ─────────────────────────────────────────────────────────────────────────────
// profileService.ts
// KisanGPT — Farmer Profile Service Abstraction
// ─────────────────────────────────────────────────────────────────────────────

import { profileApi } from "./profileApi";
import { profileMockService } from "./profileMock";
import type { ProfileData } from "../types/profile.types";

function isMockMode(): boolean {
  return (
    process.env.NEXT_PUBLIC_USE_MOCK_API === undefined ||
    process.env.NEXT_PUBLIC_USE_MOCK_API === "true"
  );
}

export const profileService = {
  getProfile: async (): Promise<ProfileData> => {
    if (isMockMode()) return profileMockService.getProfile();
    try {
      return await profileApi.getProfile();
    } catch (err) {
      console.warn("Profile API error, falling back to mock:", err);
      return profileMockService.getProfile();
    }
  },

  updateProfile: async (
    updates: Partial<ProfileData["profile"]>,
  ): Promise<ProfileData["profile"]> => {
    if (isMockMode()) return profileMockService.updateProfile(updates);
    try {
      return await profileApi.updateProfile(updates);
    } catch (err) {
      console.warn("Profile Update API error, falling back to mock:", err);
      return profileMockService.updateProfile(updates);
    }
  },

  updateFarm: async (
    updates: Partial<ProfileData["farm"]>,
  ): Promise<ProfileData["farm"]> => {
    if (isMockMode()) return profileMockService.updateFarm(updates);
    try {
      return await profileApi.updateFarm(updates);
    } catch (err) {
      console.warn("Farm Update API error, falling back to mock:", err);
      return profileMockService.updateFarm(updates);
    }
  },

  updatePrivacySettings: async (
    settings: ProfileData["privacySettings"],
  ): Promise<ProfileData["privacySettings"]> => {
    if (isMockMode()) return profileMockService.updatePrivacySettings(settings);
    try {
      return await profileApi.updatePrivacySettings(settings);
    } catch (err) {
      console.warn("Privacy Settings API error, falling back to mock:", err);
      return profileMockService.updatePrivacySettings(settings);
    }
  },

  deleteAccount: async (): Promise<{ detail: string }> => {
    if (isMockMode()) return profileMockService.deleteAccount();
    try {
      return await profileApi.deleteAccount();
    } catch (err) {
      console.warn("Delete Account API error, falling back to mock:", err);
      return profileMockService.deleteAccount();
    }
  },
};

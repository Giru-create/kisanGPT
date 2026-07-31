// ─────────────────────────────────────────────────────────────────────────────
// profileMock.ts
// KisanGPT — Farmer Profile Mock Service
// ─────────────────────────────────────────────────────────────────────────────

import { MOCK_PROFILE_DATA } from "../constants/profile.constants";
import type { ProfileData } from "../types/profile.types";

const mockDelay = (ms: number = 600) =>
  new Promise((resolve) => setTimeout(resolve, ms));

let localData: ProfileData = JSON.parse(JSON.stringify(MOCK_PROFILE_DATA));

function resetLocalData() {
  localData = JSON.parse(JSON.stringify(MOCK_PROFILE_DATA));
}

export const profileMockService = {
  _reset: resetLocalData,

  getProfile: async (): Promise<ProfileData> => {
    await mockDelay();
    return JSON.parse(JSON.stringify(localData));
  },

  updateProfile: async (
    updates: Partial<ProfileData["profile"]>,
  ): Promise<ProfileData["profile"]> => {
    await mockDelay(400);
    localData.profile = { ...localData.profile, ...updates };
    return { ...localData.profile };
  },

  updateFarm: async (
    updates: Partial<ProfileData["farm"]>,
  ): Promise<ProfileData["farm"]> => {
    await mockDelay(400);
    localData.farm = { ...localData.farm, ...updates };
    return { ...localData.farm };
  },

  updatePrivacySettings: async (
    settings: ProfileData["privacySettings"],
  ): Promise<ProfileData["privacySettings"]> => {
    await mockDelay(300);
    localData.privacySettings = { ...settings };
    return { ...settings };
  },

  deleteAccount: async (): Promise<{ detail: string }> => {
    await mockDelay(800);
    resetLocalData();
    return { detail: "Account data deleted" };
  },
};

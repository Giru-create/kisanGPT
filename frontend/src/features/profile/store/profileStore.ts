// ─────────────────────────────────────────────────────────────────────────────
// profileStore.ts
// KisanGPT — Farmer Profile Zustand slice
// ─────────────────────────────────────────────────────────────────────────────

import { create } from "zustand";
import type { ProfileTab } from "../types/profile.types";

interface ProfileStore {
  activeTab: ProfileTab;
  isEditing: boolean;
  isDeleteModalOpen: boolean;

  setActiveTab: (tab: ProfileTab) => void;
  setIsEditing: (editing: boolean) => void;
  setDeleteModalOpen: (open: boolean) => void;
  reset: () => void;
}

const DEFAULT_STATE = {
  activeTab: "overview" as ProfileTab,
  isEditing: false,
  isDeleteModalOpen: false,
};

export const useProfileStore = create<ProfileStore>((set) => ({
  ...DEFAULT_STATE,

  setActiveTab: (activeTab) => set({ activeTab }),
  setIsEditing: (isEditing) => set({ isEditing }),
  setDeleteModalOpen: (isDeleteModalOpen) => set({ isDeleteModalOpen }),
  reset: () => set(DEFAULT_STATE),
}));

export const selectActiveTab = (s: ProfileStore) => s.activeTab;
export const selectIsEditing = (s: ProfileStore) => s.isEditing;
export const selectIsDeleteModalOpen = (s: ProfileStore) => s.isDeleteModalOpen;

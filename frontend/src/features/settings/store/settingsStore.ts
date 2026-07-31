// ─────────────────────────────────────────────────────────────────────────────
// settingsStore.ts
// KisanGPT — Settings Zustand slice
// ─────────────────────────────────────────────────────────────────────────────

import { create } from "zustand";
import type { SettingsCategory } from "../types/settings.types";

interface SettingsStore {
  activeCategory: SettingsCategory;
  searchQuery: string;
  isMobileNavOpen: boolean;
  setActiveCategory: (category: SettingsCategory) => void;
  setSearchQuery: (query: string) => void;
  setMobileNavOpen: (open: boolean) => void;
  reset: () => void;
}

const DEFAULT_STATE = {
  activeCategory: "ai" as SettingsCategory,
  searchQuery: "",
  isMobileNavOpen: false,
};

export const useSettingsStore = create<SettingsStore>((set) => ({
  ...DEFAULT_STATE,
  setActiveCategory: (activeCategory) => set({ activeCategory }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setMobileNavOpen: (isMobileNavOpen) => set({ isMobileNavOpen }),
  reset: () => set(DEFAULT_STATE),
}));

export const selectActiveCategory = (s: SettingsStore) => s.activeCategory;
export const selectSearchQuery = (s: SettingsStore) => s.searchQuery;
export const selectIsMobileNavOpen = (s: SettingsStore) => s.isMobileNavOpen;

// ─────────────────────────────────────────────────────────────────────────────
// useSettings.ts
// KisanGPT — Settings orchestration hook
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useCallback } from "react";
import {
  useSettingsStore,
  selectActiveCategory,
  selectSearchQuery,
  selectIsMobileNavOpen,
} from "../store/settingsStore";
import { useSettingsQuery, useUpdateSettingsMutation } from "./useSettingsData";
import type { SettingsCategory, SettingsData } from "../types/settings.types";
import { announceToScreenReader } from "@/utils/a11y";

export function useSettings() {
  const activeCategory = useSettingsStore(selectActiveCategory);
  const searchQuery = useSettingsStore(selectSearchQuery);
  const isMobileNavOpen = useSettingsStore(selectIsMobileNavOpen);
  const setActiveCategory = useSettingsStore((s) => s.setActiveCategory);
  const setSearchQuery = useSettingsStore((s) => s.setSearchQuery);
  const setMobileNavOpen = useSettingsStore((s) => s.setMobileNavOpen);

  const { data, isLoading, isError, error, refetch } = useSettingsQuery();
  const updateMutation = useUpdateSettingsMutation();

  const handleUpdate = useCallback(
    async (updates: Partial<SettingsData>): Promise<boolean> => {
      try {
        await updateMutation.mutateAsync(updates);
        announceToScreenReader("Settings updated successfully");
        return true;
      } catch {
        announceToScreenReader("Failed to update settings");
        return false;
      }
    },
    [updateMutation],
  );

  const handleNavigate = useCallback(
    (category: SettingsCategory) => {
      setActiveCategory(category);
      setMobileNavOpen(false);
      announceToScreenReader(`Navigated to ${category} settings`);
    },
    [setActiveCategory, setMobileNavOpen],
  );

  return {
    data,
    isLoading,
    isError,
    error: isError ? (error?.message ?? "Failed to load settings.") : null,
    activeCategory,
    searchQuery,
    isMobileNavOpen,
    setActiveCategory,
    setSearchQuery,
    setMobileNavOpen,
    handleUpdate,
    handleNavigate,
    refresh: () => void refetch(),
    isSaving: updateMutation.isPending,
  };
}

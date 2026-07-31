// ─────────────────────────────────────────────────────────────────────────────
// useProfile.ts
// KisanGPT — Farmer Profile orchestration hook
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useCallback } from "react";
import {
  useProfileStore,
  selectActiveTab,
  selectIsEditing,
  selectIsDeleteModalOpen,
} from "../store/profileStore";
import {
  useProfileQuery,
  useUpdateProfileMutation,
  useDeleteAccountMutation,
} from "./useProfileData";
import type { ProfileTab } from "../types/profile.types";
import { announceToScreenReader } from "@/utils/a11y";

export function useProfile() {
  const activeTab = useProfileStore(selectActiveTab);
  const isEditing = useProfileStore(selectIsEditing);
  const isDeleteModalOpen = useProfileStore(selectIsDeleteModalOpen);

  const setActiveTab = useProfileStore((s) => s.setActiveTab);
  const setIsEditing = useProfileStore((s) => s.setIsEditing);
  const setDeleteModalOpen = useProfileStore((s) => s.setDeleteModalOpen);

  const {
    data: profileData,
    isLoading,
    isError,
    error,
    refetch,
  } = useProfileQuery();

  const updateProfileMutation = useUpdateProfileMutation();
  const deleteAccountMutation = useDeleteAccountMutation();

  const handleSetTab = useCallback(
    (tab: ProfileTab) => {
      setActiveTab(tab);
      announceToScreenReader(`Switched to ${tab} tab`);
    },
    [setActiveTab],
  );

  const handleUpdateProfile = useCallback(
    async (
      updates: Parameters<typeof updateProfileMutation.mutateAsync>[0],
    ) => {
      try {
        await updateProfileMutation.mutateAsync(updates);
        setIsEditing(false);
        announceToScreenReader("Profile updated successfully");
        return true;
      } catch {
        announceToScreenReader("Failed to update profile");
        return false;
      }
    },
    [updateProfileMutation, setIsEditing],
  );

  const handleDeleteAccount = useCallback(async () => {
    try {
      await deleteAccountMutation.mutateAsync();
      setDeleteModalOpen(false);
      announceToScreenReader("Account data deleted");
      return true;
    } catch {
      announceToScreenReader("Failed to delete account");
      return false;
    }
  }, [deleteAccountMutation, setDeleteModalOpen]);

  return {
    profileData,
    activeTab,
    isEditing,
    isDeleteModalOpen,
    isLoading,
    isError,
    error: isError ? (error?.message ?? "Failed to load profile.") : null,
    setActiveTab: handleSetTab,
    setIsEditing,
    setDeleteModalOpen,
    handleUpdateProfile,
    handleDeleteAccount,
    refreshProfile: () => void refetch(),
  };
}

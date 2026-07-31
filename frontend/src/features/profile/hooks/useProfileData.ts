// ─────────────────────────────────────────────────────────────────────────────
// useProfileData.ts
// KisanGPT — React Query hooks for profile data
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService } from "../services/profileService";
import type { ProfileData } from "../types/profile.types";

const PROFILE_QUERY_KEY = ["profile"] as const;

export function useProfileQuery() {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: () => profileService.getProfile(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: Partial<ProfileData["profile"]>) =>
      profileService.updateProfile(updates),
    onMutate: async (updates) => {
      await queryClient.cancelQueries({ queryKey: PROFILE_QUERY_KEY });

      const previousData =
        queryClient.getQueryData<ProfileData>(PROFILE_QUERY_KEY);

      if (previousData) {
        queryClient.setQueryData<ProfileData>(PROFILE_QUERY_KEY, {
          ...previousData,
          profile: { ...previousData.profile, ...updates },
        });
      }

      return { previousData };
    },
    onError: (_err, _updates, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(PROFILE_QUERY_KEY, context.previousData);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
    },
  });
}

export function useUpdateFarmMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: Partial<ProfileData["farm"]>) =>
      profileService.updateFarm(updates),
    onMutate: async (updates) => {
      await queryClient.cancelQueries({ queryKey: PROFILE_QUERY_KEY });
      const previousData =
        queryClient.getQueryData<ProfileData>(PROFILE_QUERY_KEY);
      if (previousData) {
        queryClient.setQueryData<ProfileData>(PROFILE_QUERY_KEY, {
          ...previousData,
          farm: { ...previousData.farm, ...updates },
        });
      }
      return { previousData };
    },
    onError: (_err, _updates, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(PROFILE_QUERY_KEY, context.previousData);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
    },
  });
}

export function useUpdatePrivacyMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (settings: ProfileData["privacySettings"]) =>
      profileService.updatePrivacySettings(settings),
    onMutate: async (settings) => {
      await queryClient.cancelQueries({ queryKey: PROFILE_QUERY_KEY });
      const previousData =
        queryClient.getQueryData<ProfileData>(PROFILE_QUERY_KEY);
      if (previousData) {
        queryClient.setQueryData<ProfileData>(PROFILE_QUERY_KEY, {
          ...previousData,
          privacySettings: settings,
        });
      }
      return { previousData };
    },
    onError: (_err, _updates, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(PROFILE_QUERY_KEY, context.previousData);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
    },
  });
}

export function useDeleteAccountMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => profileService.deleteAccount(),
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
    },
  });
}

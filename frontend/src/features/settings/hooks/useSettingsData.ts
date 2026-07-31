// ─────────────────────────────────────────────────────────────────────────────
// useSettingsData.ts
// KisanGPT — Settings React Query hooks
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsService } from "../services/settingsService";
import type { SettingsData } from "../types/settings.types";

const SETTINGS_QUERY_KEY = ["settings"] as const;

export function useSettingsQuery() {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEY,
    queryFn: () => settingsService.getSettings(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useUpdateSettingsMutation() {
  const queryClient = useQueryClient();
  return useMutation<
    SettingsData,
    Error,
    Partial<SettingsData>,
    { previousData?: SettingsData }
  >({
    mutationFn: (updates: Partial<SettingsData>) =>
      settingsService.updateSettings(updates),
    onMutate: async (updates) => {
      await queryClient.cancelQueries({ queryKey: SETTINGS_QUERY_KEY });
      const previousData =
        queryClient.getQueryData<SettingsData>(SETTINGS_QUERY_KEY);
      if (previousData) {
        const merged = { ...previousData, ...updates } as SettingsData;
        queryClient.setQueryData<SettingsData>(SETTINGS_QUERY_KEY, merged);
      }
      return { previousData };
    },
    onError: (_err, _updates, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(SETTINGS_QUERY_KEY, context.previousData);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEY });
    },
  });
}

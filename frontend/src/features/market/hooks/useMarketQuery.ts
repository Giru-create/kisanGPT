// ─────────────────────────────────────────────────────────────────────────────
// useMarketQuery.ts
// KisanGPT — React Query hooks for market data fetching
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { marketService } from "../services/marketService";
import type { PriceAlertDraft } from "../types/market.types";

const MARKET_QUERY_KEY = ["market"] as const;

export function useMarketOverviewQuery(state?: string) {
  return useQuery({
    queryKey: [...MARKET_QUERY_KEY, "overview", state],
    queryFn: () => marketService.getMarketOverview(state),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useMarketPricesQuery(commodity: string) {
  return useQuery({
    queryKey: [...MARKET_QUERY_KEY, "prices", commodity],
    queryFn: () => marketService.getMarketPrices(commodity),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useMarketTrendQuery(commodity: string, days: number = 30) {
  return useQuery({
    queryKey: [...MARKET_QUERY_KEY, "trend", commodity, days],
    queryFn: () => marketService.getMarketTrend(commodity, days),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useMarketHistoryQuery(
  commodity: string,
  mandi: string,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: [...MARKET_QUERY_KEY, "history", commodity, mandi],
    queryFn: () => marketService.getMarketHistory(commodity, mandi),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
    enabled,
  });
}

export function useMarketAdviceQuery(commodity: string) {
  return useQuery({
    queryKey: [...MARKET_QUERY_KEY, "advice", commodity],
    queryFn: () => marketService.getMarketAdvice(commodity),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useMarketRecommendationQuery(commodity: string) {
  return useQuery({
    queryKey: [...MARKET_QUERY_KEY, "recommendation", commodity],
    queryFn: () => marketService.getMarketRecommendation(commodity),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useMarketAlertsQuery() {
  return useQuery({
    queryKey: [...MARKET_QUERY_KEY, "alerts"],
    queryFn: () => marketService.getMarketAlerts(),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

export function useCreateMarketAlertMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (draft: PriceAlertDraft) =>
      marketService.createMarketAlert(draft),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: [...MARKET_QUERY_KEY, "alerts"],
      });
    },
  });
}

export function useDeleteMarketAlertMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (alertId: string) => marketService.deleteMarketAlert(alertId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: [...MARKET_QUERY_KEY, "alerts"],
      });
    },
  });
}

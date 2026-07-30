// ─────────────────────────────────────────────────────────────────────────────
// useMarket.ts
// KisanGPT — Market Intelligence hook
// Orchestrates React Query (data fetching) + Zustand (UI state)
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useCallback, useMemo } from "react";
import {
  useMarketStore,
  selectSelectedCommodity,
  selectSelectedMandi,
  selectIsAlertDialogOpen,
  selectAlertDialogCommodity,
} from "../store/marketStore";
import {
  useMarketOverviewQuery,
  useMarketPricesQuery,
  useMarketTrendQuery,
  useMarketHistoryQuery,
  useMarketRecommendationQuery,
  useMarketAlertsQuery,
  useCreateMarketAlertMutation,
  useDeleteMarketAlertMutation,
} from "./useMarketQuery";
import type {
  PriceAlertDraft,
  MarketUIState,
  PriceListUIState,
  TrendUIState,
  HistoryUIState,
  AdviceUIState,
  AIRecommendation,
} from "../types/market.types";
import { announceToScreenReader } from "@/utils/a11y";

// ---------------------------------------------------------------------------
// Map backend Recommendation to frontend AIRecommendation
// ---------------------------------------------------------------------------

function mapRecommendation(
  response: {
    recommendation: {
      type: string;
      commodity: string;
      confidence: number;
      headline: string;
      rationale: string;
      potential_gain: number;
      risk_level: string;
      suggested_action: string;
      generated_at: string;
    };
  },
  commodity: string,
): AIRecommendation {
  const rec = response.recommendation;
  let mappedType: AIRecommendation["type"];
  switch (rec.type) {
    case "sell_now":
      mappedType = "sell_now";
      break;
    case "hold":
      mappedType = "hold";
      break;
    case "switch_mandi":
      mappedType = "alternative_mandi";
      break;
    case "wait":
      mappedType = "wait";
      break;
    default:
      mappedType = "hold";
  }

  return {
    type: mappedType,
    commodity,
    confidence: rec.confidence,
    headline: rec.headline,
    rationale: rec.rationale,
    net_gain_per_quintal: rec.potential_gain,
    generated_at: rec.generated_at,
  };
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useMarket() {
  const selectedCommodity = useMarketStore(selectSelectedCommodity);
  const selectedMandi = useMarketStore(selectSelectedMandi);
  const isAlertDialogOpen = useMarketStore(selectIsAlertDialogOpen);
  const alertDialogCommodity = useMarketStore(selectAlertDialogCommodity);
  const {
    setSelectedCommodity,
    setSelectedMandi,
    openAlertDialog,
    closeAlertDialog,
  } = useMarketStore();

  // React Query hooks
  const overviewQuery = useMarketOverviewQuery();
  const pricesQuery = useMarketPricesQuery(selectedCommodity);
  const trendQuery = useMarketTrendQuery(selectedCommodity);
  const historyQuery = useMarketHistoryQuery(
    selectedCommodity,
    selectedMandi.name,
    false,
  );
  const recommendationQuery = useMarketRecommendationQuery(selectedCommodity);
  const alertsQuery = useMarketAlertsQuery();
  const createAlertMutation = useCreateMarketAlertMutation();
  const deleteAlertMutation = useDeleteMarketAlertMutation();

  // Derive UI states from React Query
  const marketState: MarketUIState = useMemo(() => {
    if (overviewQuery.isPending) return { status: "loading" };
    if (overviewQuery.isError) {
      const message =
        overviewQuery.error instanceof Error
          ? overviewQuery.error.message
          : "Unable to load market data. Please try again.";
      return { status: "error", message };
    }
    if (overviewQuery.data)
      return { status: "success", data: overviewQuery.data };
    return { status: "idle" };
  }, [
    overviewQuery.isPending,
    overviewQuery.isError,
    overviewQuery.error,
    overviewQuery.data,
  ]);

  const priceListState: PriceListUIState = useMemo(() => {
    if (pricesQuery.isPending) return { status: "loading" };
    if (pricesQuery.isError) {
      const message =
        pricesQuery.error instanceof Error
          ? pricesQuery.error.message
          : "Unable to load prices. Please try again.";
      return { status: "error", message };
    }
    if (pricesQuery.data) return { status: "success", data: pricesQuery.data };
    return { status: "idle" };
  }, [
    pricesQuery.isPending,
    pricesQuery.isError,
    pricesQuery.error,
    pricesQuery.data,
  ]);

  const trendState: TrendUIState = useMemo(() => {
    if (trendQuery.isPending) return { status: "loading" };
    if (trendQuery.isError) {
      const message =
        trendQuery.error instanceof Error
          ? trendQuery.error.message
          : "Unable to load trend data. Please try again.";
      return { status: "error", message };
    }
    if (trendQuery.data) return { status: "success", data: trendQuery.data };
    return { status: "idle" };
  }, [
    trendQuery.isPending,
    trendQuery.isError,
    trendQuery.error,
    trendQuery.data,
  ]);

  const historyState: HistoryUIState = useMemo(() => {
    if (historyQuery.isPending) return { status: "loading" };
    if (historyQuery.isError) {
      const message =
        historyQuery.error instanceof Error
          ? historyQuery.error.message
          : "Unable to load price history. Please try again.";
      return { status: "error", message };
    }
    if (historyQuery.data)
      return { status: "success", data: historyQuery.data };
    return { status: "idle" };
  }, [
    historyQuery.isPending,
    historyQuery.isError,
    historyQuery.error,
    historyQuery.data,
  ]);

  const adviceState: AdviceUIState = useMemo(() => {
    // Advice is derived from recommendation; show loading if recommendation is loading
    if (recommendationQuery.isPending) return { status: "loading" };
    if (recommendationQuery.isError) {
      const message =
        recommendationQuery.error instanceof Error
          ? recommendationQuery.error.message
          : "Unable to load market advice. Please try again.";
      return { status: "error", message };
    }
    if (recommendationQuery.data) {
      // Map recommendation response to advice-like structure
      const rec = recommendationQuery.data;
      return {
        status: "success",
        data: {
          commodity: rec.commodity,
          current_price: rec.current_price,
          msp: rec.msp,
          trend: rec.recommendation.type === "sell_now" ? "rising" : "stable",
          advice: [
            {
              category: "recommendation",
              title: rec.recommendation.headline,
              message: rec.recommendation.rationale,
              severity:
                rec.recommendation.type === "sell_now" ? "info" : "warning",
            },
          ],
          generated_at: rec.generated_at,
        },
      };
    }
    return { status: "idle" };
  }, [
    recommendationQuery.isPending,
    recommendationQuery.isError,
    recommendationQuery.error,
    recommendationQuery.data,
  ]);

  // Derived data
  const recommendation: AIRecommendation | null = useMemo(() => {
    if (!recommendationQuery.data) return null;
    return mapRecommendation(recommendationQuery.data, selectedCommodity);
  }, [recommendationQuery.data, selectedCommodity]);

  const activeAlerts = alertsQuery.data ?? [];
  const allPrices = useMemo(() => {
    if (overviewQuery.data) return overviewQuery.data.top_commodities;
    if (pricesQuery.data) return pricesQuery.data.prices;
    return [];
  }, [overviewQuery.data, pricesQuery.data]);

  // Actions
  const loadOverview = useCallback(() => {
    void overviewQuery.refetch();
  }, [overviewQuery]);

  const loadPrices = useCallback(
    (commodity: string) => {
      setSelectedCommodity(commodity);
    },
    [setSelectedCommodity],
  );

  const loadTrend = useCallback(() => {
    void trendQuery.refetch();
  }, [trendQuery]);

  const loadHistory = useCallback(() => {
    void historyQuery.refetch();
  }, [historyQuery]);

  const loadAdvice = useCallback(() => {
    void recommendationQuery.refetch();
  }, [recommendationQuery]);

  const selectCommodity = useCallback(
    (commodity: string) => {
      setSelectedCommodity(commodity);
      announceToScreenReader(`Loading prices for ${commodity}`);
    },
    [setSelectedCommodity],
  );

  const selectMandi = useCallback(
    (mandi: { name: string; district: string; state: string }) => {
      setSelectedMandi(mandi);
      announceToScreenReader(`Loading prices for ${mandi.name}`);
    },
    [setSelectedMandi],
  );

  const createAlert = useCallback(
    async (draft: PriceAlertDraft) => {
      await createAlertMutation.mutateAsync(draft);
      closeAlertDialog();
      announceToScreenReader(
        `Price alert set for ${draft.commodity} at ₹${draft.target_price.toLocaleString("en-IN")} per quintal.`,
      );
    },
    [createAlertMutation, closeAlertDialog],
  );

  const removeAlert = useCallback(
    async (id: string) => {
      await deleteAlertMutation.mutateAsync(id);
    },
    [deleteAlertMutation],
  );

  const toggleAlert = useCallback(() => {
    // Backend manages alert state; refetch to get latest
    void alertsQuery.refetch();
  }, [alertsQuery]);

  return {
    marketState,
    priceListState,
    trendState,
    historyState,
    adviceState,
    selectedCommodity,
    selectedMandi,
    allPrices,
    activeAlerts,
    isAlertDialogOpen,
    alertDialogCommodity,
    recommendation,
    loadOverview,
    loadPrices,
    loadTrend,
    loadHistory,
    loadAdvice,
    selectCommodity,
    selectMandi,
    openAlertDialog,
    closeAlertDialog,
    createAlert,
    removeAlert,
    toggleAlert,
  };
}

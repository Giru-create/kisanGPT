// ─────────────────────────────────────────────────────────────────────────────
// useMarket.ts
// KisanGPT — Market Intelligence hook
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useCallback } from "react";
import {
  useMarketStore,
  selectMarketState,
  selectPriceListState,
  selectTrendState,
  selectHistoryState,
  selectAdviceState,
  selectSelectedCommodity,
  selectSelectedMandi,
  selectAllPrices,
  selectActiveAlerts,
  selectIsAlertDialogOpen,
  selectAlertDialogCommodity,
} from "../store/marketStore";
import {
  MOCK_MARKET_OVERVIEW,
  MOCK_PRICE_LIST,
  MOCK_TREND_DATA,
  MOCK_HISTORY_DATA,
  MOCK_ADVICE_DATA,
} from "../constants/market.constants";
import type { PriceAlertDraft } from "../types/market.types";
import { announceToScreenReader } from "@/utils/a11y";

// ---------------------------------------------------------------------------
// Simulated fetch — replace with real API calls in a later milestone
// ---------------------------------------------------------------------------

async function fetchOverview(): Promise<typeof MOCK_MARKET_OVERVIEW> {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  return MOCK_MARKET_OVERVIEW;
}

async function fetchPrices(
  _commodity: string,
): Promise<typeof MOCK_PRICE_LIST> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { ...MOCK_PRICE_LIST, commodity: _commodity };
}

async function fetchTrend(_commodity: string): Promise<typeof MOCK_TREND_DATA> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return { ...MOCK_TREND_DATA, commodity: _commodity };
}

async function fetchHistory(
  _commodity: string,
  _mandi: string,
): Promise<typeof MOCK_HISTORY_DATA> {
  await new Promise((resolve) => setTimeout(resolve, 900));
  return { ...MOCK_HISTORY_DATA, commodity: _commodity, mandi: _mandi };
}

async function fetchAdvice(
  _commodity: string,
): Promise<typeof MOCK_ADVICE_DATA> {
  await new Promise((resolve) => setTimeout(resolve, 700));
  return { ...MOCK_ADVICE_DATA, commodity: _commodity };
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useMarket() {
  const marketState = useMarketStore(selectMarketState);
  const priceListState = useMarketStore(selectPriceListState);
  const trendState = useMarketStore(selectTrendState);
  const historyState = useMarketStore(selectHistoryState);
  const adviceState = useMarketStore(selectAdviceState);
  const selectedCommodity = useMarketStore(selectSelectedCommodity);
  const selectedMandi = useMarketStore(selectSelectedMandi);
  const allPrices = useMarketStore(selectAllPrices);
  const activeAlerts = useMarketStore(selectActiveAlerts);
  const isAlertDialogOpen = useMarketStore(selectIsAlertDialogOpen);
  const alertDialogCommodity = useMarketStore(selectAlertDialogCommodity);

  const {
    setMarketState,
    setPriceListState,
    setTrendState,
    setHistoryState,
    setAdviceState,
    setSelectedCommodity,
    setSelectedMandi,
    setAllPrices,
    openAlertDialog,
    closeAlertDialog,
    addAlert,
    removeAlert,
    toggleAlert,
  } = useMarketStore();

  const loadOverview = useCallback(async () => {
    setMarketState({ status: "loading" });
    try {
      const data = await fetchOverview();
      setMarketState({ status: "success", data });
      setAllPrices(data.top_commodities);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to load market data. Please try again.";
      setMarketState({ status: "error", message });
    }
  }, [setMarketState, setAllPrices]);

  const loadPrices = useCallback(
    async (commodity: string) => {
      setPriceListState({ status: "loading" });
      try {
        const data = await fetchPrices(commodity);
        setPriceListState({ status: "success", data });
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Unable to load prices. Please try again.";
        setPriceListState({ status: "error", message });
      }
    },
    [setPriceListState],
  );

  const loadTrend = useCallback(
    async (commodity: string) => {
      setTrendState({ status: "loading" });
      try {
        const data = await fetchTrend(commodity);
        setTrendState({ status: "success", data });
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Unable to load trend data. Please try again.";
        setTrendState({ status: "error", message });
      }
    },
    [setTrendState],
  );

  const loadHistory = useCallback(
    async (commodity: string, mandi: string) => {
      setHistoryState({ status: "loading" });
      try {
        const data = await fetchHistory(commodity, mandi);
        setHistoryState({ status: "success", data });
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Unable to load price history. Please try again.";
        setHistoryState({ status: "error", message });
      }
    },
    [setHistoryState],
  );

  const loadAdvice = useCallback(
    async (commodity: string) => {
      setAdviceState({ status: "loading" });
      try {
        const data = await fetchAdvice(commodity);
        setAdviceState({ status: "success", data });
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Unable to load market advice. Please try again.";
        setAdviceState({ status: "error", message });
      }
    },
    [setAdviceState],
  );

  const selectCommodity = useCallback(
    (commodity: string) => {
      setSelectedCommodity(commodity);
      loadPrices(commodity);
      loadTrend(commodity);
      loadAdvice(commodity);
      announceToScreenReader(`Loading prices for ${commodity}`);
    },
    [setSelectedCommodity, loadPrices, loadTrend, loadAdvice],
  );

  const selectMandi = useCallback(
    (mandi: { name: string; district: string; state: string }) => {
      setSelectedMandi(mandi);
      loadHistory(selectedCommodity, mandi.name);
      announceToScreenReader(`Loading prices for ${mandi.name}`);
    },
    [setSelectedMandi, loadHistory, selectedCommodity],
  );

  const createAlert = useCallback(
    (draft: PriceAlertDraft) => {
      const alert = {
        id: `alert-${Date.now()}`,
        commodity: draft.commodity,
        target_price: draft.target_price,
        condition: draft.condition,
        is_active: true,
        created_at: new Date().toISOString(),
        triggered_at: null,
      };
      addAlert(alert);
      closeAlertDialog();
      announceToScreenReader(
        `Price alert set for ${draft.commodity} at ₹${draft.target_price.toLocaleString("en-IN")} per quintal.`,
      );
    },
    [addAlert, closeAlertDialog],
  );

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

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
  selectSelectedCommodity,
  selectAllPrices,
} from "../store/marketStore";
import {
  MOCK_MARKET_OVERVIEW,
  MOCK_PRICE_LIST,
  MOCK_TREND_DATA,
} from "../constants/market.constants";

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

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useMarket() {
  const marketState = useMarketStore(selectMarketState);
  const priceListState = useMarketStore(selectPriceListState);
  const trendState = useMarketStore(selectTrendState);
  const selectedCommodity = useMarketStore(selectSelectedCommodity);
  const allPrices = useMarketStore(selectAllPrices);

  const {
    setMarketState,
    setPriceListState,
    setTrendState,
    setSelectedCommodity,
    setAllPrices,
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

  const selectCommodity = useCallback(
    (commodity: string) => {
      setSelectedCommodity(commodity);
      loadPrices(commodity);
      loadTrend(commodity);
    },
    [setSelectedCommodity, loadPrices, loadTrend],
  );

  return {
    marketState,
    priceListState,
    trendState,
    selectedCommodity,
    allPrices,
    loadOverview,
    loadPrices,
    loadTrend,
    selectCommodity,
  };
}

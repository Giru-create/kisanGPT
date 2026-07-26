// ─────────────────────────────────────────────────────────────────────────────
// marketStore.ts
// KisanGPT — Market Intelligence Zustand slice
// ─────────────────────────────────────────────────────────────────────────────

import { create } from "zustand";
import type {
  MarketUIState,
  PriceListUIState,
  TrendUIState,
  CommodityPrice,
} from "../types/market.types";

// ---------------------------------------------------------------------------
// Store shape
// ---------------------------------------------------------------------------

interface MarketStore {
  /** Overview UI state — drives skeleton / content / error rendering */
  marketState: MarketUIState;

  /** Price list for a specific commodity */
  priceListState: PriceListUIState;

  /** Trend data for a specific commodity */
  trendState: TrendUIState;

  /** Currently selected commodity */
  selectedCommodity: string;

  /** All prices (from overview) for quick access */
  allPrices: CommodityPrice[];

  // Actions
  setMarketState: (state: MarketUIState) => void;
  setPriceListState: (state: PriceListUIState) => void;
  setTrendState: (state: TrendUIState) => void;
  setSelectedCommodity: (commodity: string) => void;
  setAllPrices: (prices: CommodityPrice[]) => void;
  reset: () => void;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useMarketStore = create<MarketStore>((set) => ({
  marketState: { status: "idle" },
  priceListState: { status: "idle" },
  trendState: { status: "idle" },
  selectedCommodity: "Wheat",
  allPrices: [],

  setMarketState: (marketState) => set({ marketState }),
  setPriceListState: (priceListState) => set({ priceListState }),
  setTrendState: (trendState) => set({ trendState }),
  setSelectedCommodity: (selectedCommodity) => set({ selectedCommodity }),
  setAllPrices: (allPrices) => set({ allPrices }),
  reset: () =>
    set({
      marketState: { status: "idle" },
      priceListState: { status: "idle" },
      trendState: { status: "idle" },
      selectedCommodity: "Wheat",
      allPrices: [],
    }),
}));

// ---------------------------------------------------------------------------
// Selector helpers
// ---------------------------------------------------------------------------

export const selectMarketState = (s: MarketStore) => s.marketState;
export const selectPriceListState = (s: MarketStore) => s.priceListState;
export const selectTrendState = (s: MarketStore) => s.trendState;
export const selectSelectedCommodity = (s: MarketStore) => s.selectedCommodity;
export const selectAllPrices = (s: MarketStore) => s.allPrices;

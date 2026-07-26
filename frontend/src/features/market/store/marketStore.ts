// ─────────────────────────────────────────────────────────────────────────────
// marketStore.ts
// KisanGPT — Market Intelligence Zustand slice
// ─────────────────────────────────────────────────────────────────────────────

import { create } from "zustand";
import type {
  MarketUIState,
  PriceListUIState,
  TrendUIState,
  HistoryUIState,
  AdviceUIState,
  CommodityPrice,
  PriceAlert,
  Mandi,
} from "../types/market.types";

// ---------------------------------------------------------------------------
// Available mandis
// ---------------------------------------------------------------------------

export const AVAILABLE_MANDIS: Mandi[] = [
  { name: "Karnal Mandi", district: "Karnal", state: "Haryana" },
  { name: "Delhi Mandi", district: "New Delhi", state: "Delhi" },
  { name: "Jaipur Mandi", district: "Jaipur", state: "Rajasthan" },
  { name: "Lucknow Mandi", district: "Lucknow", state: "Uttar Pradesh" },
  { name: "Indore Mandi", district: "Indore", state: "Madhya Pradesh" },
  { name: "Nagpur Mandi", district: "Nagpur", state: "Maharashtra" },
  { name: "Hyderabad Mandi", district: "Hyderabad", state: "Telangana" },
  { name: "Patna Mandi", district: "Patna", state: "Bihar" },
];

const DEFAULT_MANDI: Mandi = { name: "Karnal Mandi", district: "Karnal", state: "Haryana" };

// ---------------------------------------------------------------------------
// Store shape
// ---------------------------------------------------------------------------

interface MarketStore {
  marketState: MarketUIState;
  priceListState: PriceListUIState;
  trendState: TrendUIState;
  historyState: HistoryUIState;
  adviceState: AdviceUIState;
  selectedCommodity: string;
  selectedMandi: Mandi;
  allPrices: CommodityPrice[];
  activeAlerts: PriceAlert[];
  isAlertDialogOpen: boolean;
  alertDialogCommodity: string;

  setMarketState: (state: MarketUIState) => void;
  setPriceListState: (state: PriceListUIState) => void;
  setTrendState: (state: TrendUIState) => void;
  setHistoryState: (state: HistoryUIState) => void;
  setAdviceState: (state: AdviceUIState) => void;
  setSelectedCommodity: (commodity: string) => void;
  setSelectedMandi: (mandi: Mandi) => void;
  setAllPrices: (prices: CommodityPrice[]) => void;
  openAlertDialog: (commodity: string) => void;
  closeAlertDialog: () => void;
  addAlert: (alert: PriceAlert) => void;
  removeAlert: (id: string) => void;
  toggleAlert: (id: string) => void;
  reset: () => void;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useMarketStore = create<MarketStore>((set) => ({
  marketState: { status: "idle" },
  priceListState: { status: "idle" },
  trendState: { status: "idle" },
  historyState: { status: "idle" },
  adviceState: { status: "idle" },
  selectedCommodity: "Wheat",
  selectedMandi: DEFAULT_MANDI,
  allPrices: [],
  activeAlerts: [],
  isAlertDialogOpen: false,
  alertDialogCommodity: "Wheat",

  setMarketState: (marketState) => set({ marketState }),
  setPriceListState: (priceListState) => set({ priceListState }),
  setTrendState: (trendState) => set({ trendState }),
  setHistoryState: (historyState) => set({ historyState }),
  setAdviceState: (adviceState) => set({ adviceState }),
  setSelectedCommodity: (selectedCommodity) => set({ selectedCommodity }),
  setSelectedMandi: (selectedMandi) => set({ selectedMandi }),
  setAllPrices: (allPrices) => set({ allPrices }),
  openAlertDialog: (alertDialogCommodity) =>
    set({ isAlertDialogOpen: true, alertDialogCommodity }),
  closeAlertDialog: () => set({ isAlertDialogOpen: false }),
  addAlert: (alert) =>
    set((s) => ({ activeAlerts: [alert, ...s.activeAlerts] })),
  removeAlert: (id) =>
    set((s) => ({ activeAlerts: s.activeAlerts.filter((a) => a.id !== id) })),
  toggleAlert: (id) =>
    set((s) => ({
      activeAlerts: s.activeAlerts.map((a) =>
        a.id === id ? { ...a, is_active: !a.is_active } : a,
      ),
    })),
  reset: () =>
    set({
      marketState: { status: "idle" },
      priceListState: { status: "idle" },
      trendState: { status: "idle" },
      historyState: { status: "idle" },
      adviceState: { status: "idle" },
      selectedCommodity: "Wheat",
  selectedMandi: DEFAULT_MANDI,
      allPrices: [],
      activeAlerts: [],
      isAlertDialogOpen: false,
      alertDialogCommodity: "Wheat",
    }),
}));

// ---------------------------------------------------------------------------
// Selector helpers
// ---------------------------------------------------------------------------

export const selectMarketState = (s: MarketStore) => s.marketState;
export const selectPriceListState = (s: MarketStore) => s.priceListState;
export const selectTrendState = (s: MarketStore) => s.trendState;
export const selectHistoryState = (s: MarketStore) => s.historyState;
export const selectAdviceState = (s: MarketStore) => s.adviceState;
export const selectSelectedCommodity = (s: MarketStore) => s.selectedCommodity;
export const selectSelectedMandi = (s: MarketStore) => s.selectedMandi;
export const selectAllPrices = (s: MarketStore) => s.allPrices;
export const selectActiveAlerts = (s: MarketStore) => s.activeAlerts;
export const selectIsAlertDialogOpen = (s: MarketStore) => s.isAlertDialogOpen;
export const selectAlertDialogCommodity = (s: MarketStore) =>
  s.alertDialogCommodity;

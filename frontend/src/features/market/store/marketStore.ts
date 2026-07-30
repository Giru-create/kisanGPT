// ─────────────────────────────────────────────────────────────────────────────
// marketStore.ts
// KisanGPT — Market Intelligence Zustand slice
// UI-only state: selections, alerts, modal
// Market data is managed by React Query in useMarketQuery.ts
// ─────────────────────────────────────────────────────────────────────────────

import { create } from "zustand";
import type { Mandi } from "../types/market.types";

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

const DEFAULT_MANDI: Mandi = {
  name: "Karnal Mandi",
  district: "Karnal",
  state: "Haryana",
};

// ---------------------------------------------------------------------------
// Store shape
// ---------------------------------------------------------------------------

interface MarketStore {
  /** Currently selected commodity */
  selectedCommodity: string;

  /** Currently selected mandi for history view */
  selectedMandi: Mandi;

  /** Price alert dialog state */
  isAlertDialogOpen: boolean;
  alertDialogCommodity: string;

  // Actions
  setSelectedCommodity: (commodity: string) => void;
  setSelectedMandi: (mandi: Mandi) => void;
  openAlertDialog: (commodity: string) => void;
  closeAlertDialog: () => void;
  reset: () => void;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useMarketStore = create<MarketStore>((set) => ({
  selectedCommodity: "Wheat",
  selectedMandi: DEFAULT_MANDI,
  isAlertDialogOpen: false,
  alertDialogCommodity: "Wheat",

  setSelectedCommodity: (selectedCommodity) => set({ selectedCommodity }),
  setSelectedMandi: (selectedMandi) => set({ selectedMandi }),
  openAlertDialog: (alertDialogCommodity) =>
    set({ isAlertDialogOpen: true, alertDialogCommodity }),
  closeAlertDialog: () => set({ isAlertDialogOpen: false }),
  reset: () =>
    set({
      selectedCommodity: "Wheat",
      selectedMandi: DEFAULT_MANDI,
      isAlertDialogOpen: false,
      alertDialogCommodity: "Wheat",
    }),
}));

// ---------------------------------------------------------------------------
// Selector helpers
// ---------------------------------------------------------------------------

export const selectSelectedCommodity = (s: MarketStore) => s.selectedCommodity;
export const selectSelectedMandi = (s: MarketStore) => s.selectedMandi;
export const selectIsAlertDialogOpen = (s: MarketStore) => s.isAlertDialogOpen;
export const selectAlertDialogCommodity = (s: MarketStore) =>
  s.alertDialogCommodity;

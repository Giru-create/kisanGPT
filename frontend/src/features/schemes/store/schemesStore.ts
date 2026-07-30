// ─────────────────────────────────────────────────────────────────────────────
// schemesStore.ts
// KisanGPT — Government Schemes Zustand slice
// UI-only state: filters and selected scheme
// Scheme data is managed by React Query in useSchemesQuery.ts
// ─────────────────────────────────────────────────────────────────────────────

import { create } from "zustand";
import type { SchemeFilters, Scheme } from "../types/schemes.types";

// ---------------------------------------------------------------------------
// Store shape
// ---------------------------------------------------------------------------

interface SchemesStore {
  /** Active filter state */
  filters: SchemeFilters;

  /** Currently selected scheme for detail view */
  selectedScheme: Scheme | null;

  /** Detail panel open state */
  isDetailOpen: boolean;

  // Actions
  setState: (state: string | null) => void;
  setCrop: (crop: string | null) => void;
  setFarmerCategory: (category: string | null) => void;
  setSchemeType: (type: string | null) => void;
  setSearch: (search: string) => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
  openDetail: (scheme: Scheme) => void;
  closeDetail: () => void;
  reset: () => void;
}

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

const DEFAULT_FILTERS: SchemeFilters = {
  state: null,
  crop: null,
  farmerCategory: null,
  schemeType: null,
  search: "",
  page: 1,
  pageSize: 20,
};

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useSchemesStore = create<SchemesStore>((set) => ({
  filters: { ...DEFAULT_FILTERS },
  selectedScheme: null,
  isDetailOpen: false,

  setState: (state) =>
    set((s) => ({
      filters: { ...s.filters, state, page: 1 },
    })),

  setCrop: (crop) =>
    set((s) => ({
      filters: { ...s.filters, crop, page: 1 },
    })),

  setFarmerCategory: (farmerCategory) =>
    set((s) => ({
      filters: { ...s.filters, farmerCategory, page: 1 },
    })),

  setSchemeType: (schemeType) =>
    set((s) => ({
      filters: { ...s.filters, schemeType, page: 1 },
    })),

  setSearch: (search) =>
    set((s) => ({
      filters: { ...s.filters, search, page: 1 },
    })),

  setPage: (page) =>
    set((s) => ({
      filters: { ...s.filters, page },
    })),

  resetFilters: () => set({ filters: { ...DEFAULT_FILTERS } }),

  openDetail: (scheme) => set({ selectedScheme: scheme, isDetailOpen: true }),

  closeDetail: () => set({ selectedScheme: null, isDetailOpen: false }),

  reset: () =>
    set({
      filters: { ...DEFAULT_FILTERS },
      selectedScheme: null,
      isDetailOpen: false,
    }),
}));

// ---------------------------------------------------------------------------
// Selectors
// ---------------------------------------------------------------------------

export const selectSchemesFilters = (s: SchemesStore) => s.filters;
export const selectSelectedScheme = (s: SchemesStore) => s.selectedScheme;
export const selectIsDetailOpen = (s: SchemesStore) => s.isDetailOpen;

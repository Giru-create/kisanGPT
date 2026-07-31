// ─────────────────────────────────────────────────────────────────────────────
// memoryStore.ts
// KisanGPT — Farm Memory Zustand slice
// UI-only state: selected category, modal state, filters
// Memory data is managed by React Query in useMemoryQuery.ts
// ─────────────────────────────────────────────────────────────────────────────

import { create } from "zustand";
import type {
  MemoryCategory,
  FilterTab,
  FarmMemoryItem,
} from "../types/memory.types";

// ---------------------------------------------------------------------------
// Store shape
// ---------------------------------------------------------------------------

interface MemoryStore {
  /** Currently selected category filter */
  selectedCategory: MemoryCategory;

  /** Add memory modal open state */
  isAddModalOpen: boolean;

  /** Search query string */
  searchQuery: string;

  /** Active filter tab */
  filterTab: FilterTab;

  /** Selected memory for detail view */
  selectedMemory: FarmMemoryItem | null;

  /** Detail modal open state */
  isDetailModalOpen: boolean;

  // Actions
  setSelectedCategory: (category: MemoryCategory) => void;
  setAddModalOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setFilterTab: (tab: FilterTab) => void;
  setSelectedMemory: (item: FarmMemoryItem | null) => void;
  setDetailModalOpen: (open: boolean) => void;
  openDetail: (item: FarmMemoryItem) => void;
  closeDetail: () => void;
  reset: () => void;
}

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

const DEFAULT_STATE = {
  selectedCategory: "all" as MemoryCategory,
  isAddModalOpen: false,
  searchQuery: "",
  filterTab: "all" as FilterTab,
  selectedMemory: null as FarmMemoryItem | null,
  isDetailModalOpen: false,
};

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useMemoryStore = create<MemoryStore>((set) => ({
  ...DEFAULT_STATE,

  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  setAddModalOpen: (isAddModalOpen) => set({ isAddModalOpen }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setFilterTab: (filterTab) => set({ filterTab }),
  setSelectedMemory: (selectedMemory) => set({ selectedMemory }),
  setDetailModalOpen: (isDetailModalOpen) => set({ isDetailModalOpen }),
  openDetail: (item) => set({ selectedMemory: item, isDetailModalOpen: true }),
  closeDetail: () => set({ selectedMemory: null, isDetailModalOpen: false }),
  reset: () => set(DEFAULT_STATE),
}));

// ---------------------------------------------------------------------------
// Selectors
// ---------------------------------------------------------------------------

export const selectSelectedCategory = (s: MemoryStore) => s.selectedCategory;
export const selectIsAddModalOpen = (s: MemoryStore) => s.isAddModalOpen;
export const selectSearchQuery = (s: MemoryStore) => s.searchQuery;
export const selectFilterTab = (s: MemoryStore) => s.filterTab;
export const selectSelectedMemory = (s: MemoryStore) => s.selectedMemory;
export const selectIsDetailModalOpen = (s: MemoryStore) => s.isDetailModalOpen;

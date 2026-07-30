// ─────────────────────────────────────────────────────────────────────────────
// memoryStore.ts
// KisanGPT — Farm Memory Zustand slice
// UI-only state: selected category, modal state
// Memory data is managed by React Query in useMemoryQuery.ts
// ─────────────────────────────────────────────────────────────────────────────

import { create } from "zustand";
import type { MemoryCategory } from "../types/memory.types";

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

  // Actions
  setSelectedCategory: (category: MemoryCategory) => void;
  setAddModalOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  reset: () => void;
}

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

const DEFAULT_STATE = {
  selectedCategory: "all" as MemoryCategory,
  isAddModalOpen: false,
  searchQuery: "",
};

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useMemoryStore = create<MemoryStore>((set) => ({
  ...DEFAULT_STATE,

  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  setAddModalOpen: (isAddModalOpen) => set({ isAddModalOpen }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  reset: () => set(DEFAULT_STATE),
}));

// ---------------------------------------------------------------------------
// Selectors
// ---------------------------------------------------------------------------

export const selectSelectedCategory = (s: MemoryStore) => s.selectedCategory;
export const selectIsAddModalOpen = (s: MemoryStore) => s.isAddModalOpen;
export const selectSearchQuery = (s: MemoryStore) => s.searchQuery;

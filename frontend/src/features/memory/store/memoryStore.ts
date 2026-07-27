// ─────────────────────────────────────────────────────────────────────────────
// memoryStore.ts
// KisanGPT — Farm Memory Zustand slice
// ─────────────────────────────────────────────────────────────────────────────

import { create } from "zustand";
import type {
  FarmMemoryItem,
  PersonalizedRecommendation,
  MemoryCategory,
} from "../types/memory.types";

interface MemoryStore {
  memories: FarmMemoryItem[];
  recommendations: PersonalizedRecommendation[];
  selectedCategory: MemoryCategory;
  isAddModalOpen: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setMemories: (memories: FarmMemoryItem[]) => void;
  addMemory: (memory: FarmMemoryItem) => void;
  setRecommendations: (recommendations: PersonalizedRecommendation[]) => void;
  setSelectedCategory: (category: MemoryCategory) => void;
  setAddModalOpen: (open: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useMemoryStore = create<MemoryStore>((set) => ({
  memories: [],
  recommendations: [],
  selectedCategory: "all",
  isAddModalOpen: false,
  isLoading: false,
  error: null,

  setMemories: (memories) => set({ memories }),
  addMemory: (memory) =>
    set((state) => ({ memories: [memory, ...state.memories] })),
  setRecommendations: (recommendations) => set({ recommendations }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  setAddModalOpen: (isAddModalOpen) => set({ isAddModalOpen }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () =>
    set({
      memories: [],
      recommendations: [],
      selectedCategory: "all",
      isAddModalOpen: false,
      isLoading: false,
      error: null,
    }),
}));

// Selectors
export const selectMemories = (s: MemoryStore) => s.memories;
export const selectRecommendations = (s: MemoryStore) => s.recommendations;
export const selectSelectedCategory = (s: MemoryStore) => s.selectedCategory;
export const selectIsAddModalOpen = (s: MemoryStore) => s.isAddModalOpen;
export const selectIsLoading = (s: MemoryStore) => s.isLoading;
export const selectError = (s: MemoryStore) => s.error;

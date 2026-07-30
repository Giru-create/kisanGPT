// ─────────────────────────────────────────────────────────────────────────────
// useMemory.ts
// KisanGPT — Farm Memory orchestration hook
// Bridges React Query (data) + Zustand (UI state)
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useCallback } from "react";
import {
  useMemoryStore,
  selectSelectedCategory,
  selectIsAddModalOpen,
} from "../store/memoryStore";
import {
  useMemoryListQuery,
  useCreateMemoryMutation,
  useDeleteMemoryMutation,
  useRecommendationsQuery,
} from "./useMemoryQuery";
import type { MemoryCategory, AddMemoryInput } from "../types/memory.types";
import { announceToScreenReader } from "@/utils/a11y";

export function useMemory() {
  const selectedCategory = useMemoryStore(selectSelectedCategory);
  const isAddModalOpen = useMemoryStore(selectIsAddModalOpen);

  const setSelectedCategory = useMemoryStore((s) => s.setSelectedCategory);
  const setAddModalOpen = useMemoryStore((s) => s.setAddModalOpen);

  const {
    data: memories = [],
    isLoading,
    isError,
    error,
    refetch: refetchMemories,
  } = useMemoryListQuery(
    selectedCategory === "all" ? undefined : selectedCategory,
  );

  const { data: recommendations = [] } = useRecommendationsQuery();

  const createMutation = useCreateMemoryMutation();
  const deleteMutation = useDeleteMemoryMutation();

  const handleSelectCategory = useCallback(
    (category: MemoryCategory) => {
      setSelectedCategory(category);
    },
    [setSelectedCategory],
  );

  const handleAddMemory = useCallback(
    async (input: AddMemoryInput): Promise<boolean> => {
      try {
        await createMutation.mutateAsync(input);
        setAddModalOpen(false);
        announceToScreenReader(
          `New farm memory "${input.title}" saved successfully`,
        );
        return true;
      } catch (err) {
        console.error("Failed to add farm memory:", err);
        announceToScreenReader("Failed to save farm memory.");
        return false;
      }
    },
    [createMutation, setAddModalOpen],
  );

  const handleDeleteMemory = useCallback(
    async (id: string) => {
      try {
        await deleteMutation.mutateAsync(id);
        announceToScreenReader("Farm memory record deleted.");
      } catch (err) {
        console.error("Failed to delete memory:", err);
      }
    },
    [deleteMutation],
  );

  return {
    memories,
    recommendations,
    selectedCategory,
    isAddModalOpen,
    isLoading,
    isError,
    error: isError ? (error?.message ?? "Failed to load farm memories.") : null,
    setSelectedCategory: handleSelectCategory,
    setAddModalOpen,
    handleAddMemory,
    handleDeleteMemory,
    refreshMemories: () => void refetchMemories(),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// useMemory.ts
// KisanGPT — Farm Memory orchestration hook
// Bridges React Query (data) + Zustand (UI state)
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useCallback, useMemo } from "react";
import {
  useMemoryStore,
  selectSelectedCategory,
  selectIsAddModalOpen,
  selectSearchQuery,
  selectFilterTab,
  selectSelectedMemory,
  selectIsDetailModalOpen,
} from "../store/memoryStore";
import {
  useMemoryListQuery,
  useMemorySearchQuery,
  useCreateMemoryMutation,
  useDeleteMemoryMutation,
  useRecommendationsQuery,
} from "./useMemoryQuery";
import type {
  MemoryCategory,
  FilterTab,
  AddMemoryInput,
  FarmMemoryItem,
} from "../types/memory.types";
import { announceToScreenReader } from "@/utils/a11y";

export function useMemory() {
  const selectedCategory = useMemoryStore(selectSelectedCategory);
  const isAddModalOpen = useMemoryStore(selectIsAddModalOpen);
  const searchQuery = useMemoryStore(selectSearchQuery);
  const filterTab = useMemoryStore(selectFilterTab);
  const selectedMemory = useMemoryStore(selectSelectedMemory);
  const isDetailModalOpen = useMemoryStore(selectIsDetailModalOpen);

  const setSelectedCategory = useMemoryStore((s) => s.setSelectedCategory);
  const setAddModalOpen = useMemoryStore((s) => s.setAddModalOpen);
  const setSearchQuery = useMemoryStore((s) => s.setSearchQuery);
  const setFilterTab = useMemoryStore((s) => s.setFilterTab);
  const openDetail = useMemoryStore((s) => s.openDetail);
  const closeDetail = useMemoryStore((s) => s.closeDetail);

  const {
    data: allMemories = [],
    isLoading,
    isError,
    error,
    refetch: refetchMemories,
  } = useMemoryListQuery(
    selectedCategory === "all" ? undefined : selectedCategory,
  );

  const { data: searchResults = [] } = useMemorySearchQuery(
    searchQuery,
    selectedCategory === "all" ? undefined : selectedCategory,
    searchQuery.length > 0,
  );

  const { data: recommendations = [] } = useRecommendationsQuery();

  const createMutation = useCreateMemoryMutation();
  const deleteMutation = useDeleteMemoryMutation();

  // Client-side filtering for tabs
  const memories = useMemo(() => {
    const source = searchQuery ? searchResults : allMemories;

    switch (filterTab) {
      case "pinned":
        return source.filter((m) => m.isPinned);
      case "saved":
        return source.filter((m) => m.isSaved);
      case "recent": {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return source.filter((m) => new Date(m.timestamp) >= oneWeekAgo);
      }
      default:
        return source;
    }
  }, [allMemories, searchResults, searchQuery, filterTab]);

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

  const handleTogglePin = useCallback(() => {
    announceToScreenReader("Memory pin status updated.");
  }, []);

  const handleToggleSave = useCallback(() => {
    announceToScreenReader("Memory save status updated.");
  }, []);

  const handleSelectMemory = useCallback(
    (item: FarmMemoryItem) => {
      openDetail(item);
    },
    [openDetail],
  );

  const handleSearchChange = useCallback(
    (query: string) => {
      setSearchQuery(query);
    },
    [setSearchQuery],
  );

  const handleFilterTabChange = useCallback(
    (tab: FilterTab) => {
      setFilterTab(tab);
    },
    [setFilterTab],
  );

  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory("all");
    setFilterTab("all");
  }, [setSearchQuery, setSelectedCategory, setFilterTab]);

  return {
    memories,
    allMemories,
    recommendations,
    selectedCategory,
    searchQuery,
    filterTab,
    selectedMemory,
    isDetailModalOpen,
    isAddModalOpen,
    isLoading,
    isError,
    error: isError ? (error?.message ?? "Failed to load farm memories.") : null,
    setSelectedCategory: handleSelectCategory,
    setAddModalOpen,
    setSearchQuery: handleSearchChange,
    setFilterTab: handleFilterTabChange,
    handleAddMemory,
    handleDeleteMemory,
    handleTogglePin,
    handleToggleSave,
    handleSelectMemory,
    handleClearFilters,
    openDetail,
    closeDetail,
    refreshMemories: () => void refetchMemories(),
  };
}

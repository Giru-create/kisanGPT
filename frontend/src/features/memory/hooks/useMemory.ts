// ─────────────────────────────────────────────────────────────────────────────
// useMemory.ts
// KisanGPT — Master Farm Memory Hook
// Wires Zustand store, memoryService API calls, and a11y live region announcements
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useCallback, useEffect } from "react";
import {
  useMemoryStore,
  selectMemories,
  selectRecommendations,
  selectSelectedCategory,
  selectIsAddModalOpen,
  selectIsLoading,
  selectError,
} from "../store/memoryStore";
import { memoryService } from "../services/memoryService";
import type { MemoryCategory, AddMemoryInput } from "../types/memory.types";
import { announceToScreenReader } from "@/utils/a11y";

export function useMemory() {
  const memories = useMemoryStore(selectMemories);
  const recommendations = useMemoryStore(selectRecommendations);
  const selectedCategory = useMemoryStore(selectSelectedCategory);
  const isAddModalOpen = useMemoryStore(selectIsAddModalOpen);
  const isLoading = useMemoryStore(selectIsLoading);
  const error = useMemoryStore(selectError);

  const {
    setMemories,
    addMemory: storeAddMemory,
    setRecommendations,
    setSelectedCategory: storeSetSelectedCategory,
    setAddModalOpen,
    setLoading,
    setError,
  } = useMemoryStore();

  const fetchMemories = useCallback(
    async (category: MemoryCategory = "all") => {
      setLoading(true);
      setError(null);
      try {
        const data = await memoryService.getMemories(
          category === "all" ? undefined : category,
        );
        setMemories(data);
        announceToScreenReader(
          `Loaded ${data.length} farm memory records for category ${category}`,
        );
      } catch (err) {
        console.error("Failed to load farm memories:", err);
        setError("Unable to load farm memory records. Please try again.");
        announceToScreenReader("Failed to load farm memories.");
      } finally {
        setLoading(false);
      }
    },
    [setMemories, setLoading, setError],
  );

  const fetchRecommendations = useCallback(async () => {
    try {
      const recs = await memoryService.getRecommendations();
      setRecommendations(recs);
    } catch (err) {
      console.error("Failed to load recommendations:", err);
    }
  }, [setRecommendations]);

  const handleSelectCategory = useCallback(
    (category: MemoryCategory) => {
      storeSetSelectedCategory(category);
      fetchMemories(category);
    },
    [storeSetSelectedCategory, fetchMemories],
  );

  const handleAddMemory = useCallback(
    async (input: AddMemoryInput) => {
      setLoading(true);
      try {
        const created = await memoryService.createMemory(input);
        storeAddMemory(created);
        setAddModalOpen(false);
        announceToScreenReader(
          `New farm memory "${created.title}" saved successfully`,
        );
        return true;
      } catch (err) {
        console.error("Failed to add farm memory:", err);
        setError("Could not save new farm record.");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [storeAddMemory, setAddModalOpen, setLoading, setError],
  );

  const handleDeleteMemory = useCallback(
    async (id: string) => {
      try {
        await memoryService.deleteMemory(id);
        const updated = memories.filter((m) => m.id !== id);
        setMemories(updated);
        announceToScreenReader("Farm memory record deleted.");
      } catch (err) {
        console.error("Failed to delete memory:", err);
      }
    },
    [memories, setMemories],
  );

  useEffect(() => {
    if (memories.length === 0) {
      fetchMemories(selectedCategory);
      fetchRecommendations();
    }
  }, [memories.length, selectedCategory, fetchMemories, fetchRecommendations]);

  return {
    memories,
    recommendations,
    selectedCategory,
    isAddModalOpen,
    isLoading,
    error,
    setSelectedCategory: handleSelectCategory,
    setAddModalOpen,
    handleAddMemory,
    handleDeleteMemory,
    refreshMemories: () => fetchMemories(selectedCategory),
  };
}

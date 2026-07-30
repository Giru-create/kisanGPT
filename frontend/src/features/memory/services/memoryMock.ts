// ─────────────────────────────────────────────────────────────────────────────
// memoryMock.ts
// KisanGPT — Farm Memory Mock Service Fallback
// Provides offline demo memories & personalized recommendations
// ─────────────────────────────────────────────────────────────────────────────

import {
  MOCK_FARM_MEMORIES,
  MOCK_RECOMMENDATIONS,
} from "../constants/memory.constants";
import type {
  FarmMemoryItem,
  PersonalizedRecommendation,
  AddMemoryInput,
  MemoryCategory,
} from "../types/memory.types";

const mockDelay = (ms: number = 400) =>
  new Promise((resolve) => setTimeout(resolve, ms));

let localMemories: FarmMemoryItem[] = [...MOCK_FARM_MEMORIES];

function resetLocalMemories() {
  localMemories = [...MOCK_FARM_MEMORIES];
}

export const memoryMockService = {
  _reset: resetLocalMemories,
  getMemories: async (category?: MemoryCategory): Promise<FarmMemoryItem[]> => {
    await mockDelay();
    if (!category || category === "all") return [...localMemories];
    return localMemories.filter((m) => m.category === category);
  },

  createMemory: async (input: AddMemoryInput): Promise<FarmMemoryItem> => {
    await mockDelay(600);
    const newMemory: FarmMemoryItem = {
      id: `mem-${Date.now()}`,
      category: input.category,
      title: input.title,
      description: input.description,
      timestamp: new Date().toISOString(),
      location: input.location || "Karnal, Haryana",
      cropName: input.cropName,
      season: input.season || "Kharif 2026",
      metrics: input.metrics,
      tags: input.tags || ["Custom Note"],
      isVerified: false,
    };
    localMemories = [newMemory, ...localMemories];
    return newMemory;
  },

  deleteMemory: async (id: string): Promise<{ detail: string }> => {
    await mockDelay(300);
    localMemories = localMemories.filter((m) => m.id !== id);
    return { detail: `Memory ${id} deleted` };
  },

  searchMemories: async (
    query: string,
    category?: MemoryCategory,
  ): Promise<FarmMemoryItem[]> => {
    await mockDelay(500);
    const q = query.toLowerCase();
    let results = localMemories.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q),
    );
    if (category && category !== "all") {
      results = results.filter((m) => m.category === category);
    }
    return results;
  },

  getRecommendations: async (): Promise<PersonalizedRecommendation[]> => {
    await mockDelay(500);
    return [...MOCK_RECOMMENDATIONS];
  },
};

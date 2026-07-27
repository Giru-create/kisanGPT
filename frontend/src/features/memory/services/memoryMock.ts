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
} from "../types/memory.types";

const mockDelay = (ms: number = 600) =>
  new Promise((resolve) => setTimeout(resolve, ms));

let localMemories: FarmMemoryItem[] = [...MOCK_FARM_MEMORIES];

export const memoryMockService = {
  getMemories: async (category?: string): Promise<FarmMemoryItem[]> => {
    await mockDelay(400);
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

  getRecommendations: async (): Promise<PersonalizedRecommendation[]> => {
    await mockDelay(500);
    return [...MOCK_RECOMMENDATIONS];
  },

  deleteMemory: async (id: string): Promise<{ detail: string }> => {
    await mockDelay(300);
    localMemories = localMemories.filter((m) => m.id !== id);
    return { detail: `Memory ${id} deleted` };
  },
};

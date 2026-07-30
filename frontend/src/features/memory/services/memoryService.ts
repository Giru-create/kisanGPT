// ─────────────────────────────────────────────────────────────────────────────
// memoryService.ts
// KisanGPT — Farm Memory Service Abstraction
// Decouples Memory UI/Hooks from backend REST vs mock fallback
// ─────────────────────────────────────────────────────────────────────────────

import { memoryApi } from "./memoryApi";
import { memoryMockService } from "./memoryMock";
import type {
  FarmMemoryItem,
  PersonalizedRecommendation,
  AddMemoryInput,
  MemoryCategory,
} from "../types/memory.types";

export interface IMemoryService {
  getMemories: (category?: MemoryCategory) => Promise<FarmMemoryItem[]>;
  createMemory: (input: AddMemoryInput) => Promise<FarmMemoryItem>;
  deleteMemory: (id: string) => Promise<{ detail: string }>;
  searchMemories: (
    query: string,
    category?: MemoryCategory,
  ) => Promise<FarmMemoryItem[]>;
  getRecommendations: () => Promise<PersonalizedRecommendation[]>;
}

function isMockMode(): boolean {
  return (
    process.env.NEXT_PUBLIC_USE_MOCK_API === undefined ||
    process.env.NEXT_PUBLIC_USE_MOCK_API === "true"
  );
}

export const memoryService: IMemoryService = {
  getMemories: async (category) => {
    if (isMockMode()) return memoryMockService.getMemories(category);
    try {
      return await memoryApi.getMemories(category);
    } catch (err) {
      console.warn("Memory API error, falling back to mock:", err);
      return memoryMockService.getMemories(category);
    }
  },

  createMemory: async (input) => {
    if (isMockMode()) return memoryMockService.createMemory(input);
    try {
      return await memoryApi.createMemory(input);
    } catch (err) {
      console.warn("Memory Create API error, falling back to mock:", err);
      return memoryMockService.createMemory(input);
    }
  },

  deleteMemory: async (id) => {
    if (isMockMode()) return memoryMockService.deleteMemory(id);
    try {
      return await memoryApi.deleteMemory(id);
    } catch (err) {
      console.warn("Memory Delete API error, falling back to mock:", err);
      return memoryMockService.deleteMemory(id);
    }
  },

  searchMemories: async (query, category) => {
    if (isMockMode()) return memoryMockService.searchMemories(query, category);
    try {
      return await memoryApi.searchMemories(query, category);
    } catch (err) {
      console.warn("Memory Search API error, falling back to mock:", err);
      return memoryMockService.searchMemories(query, category);
    }
  },

  getRecommendations: async () => {
    if (isMockMode()) return memoryMockService.getRecommendations();
    try {
      return await memoryApi.getRecommendations();
    } catch (err) {
      console.warn(
        "Memory Recommendations API error, falling back to mock:",
        err,
      );
      return memoryMockService.getRecommendations();
    }
  },
};

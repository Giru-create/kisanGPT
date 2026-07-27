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
} from "../types/memory.types";

export interface IMemoryService {
  getMemories: (category?: string) => Promise<FarmMemoryItem[]>;
  createMemory: (input: AddMemoryInput) => Promise<FarmMemoryItem>;
  getRecommendations: () => Promise<PersonalizedRecommendation[]>;
  deleteMemory: (id: string) => Promise<{ detail: string }>;
}

const isMockMode =
  process.env.NEXT_PUBLIC_USE_MOCK_API === undefined ||
  process.env.NEXT_PUBLIC_USE_MOCK_API === "true";

export const memoryService: IMemoryService = {
  getMemories: async (category) => {
    if (isMockMode) return memoryMockService.getMemories(category);
    try {
      return await memoryApi.getMemories(category);
    } catch (err) {
      console.warn("Memory API error, falling back to mock:", err);
      return memoryMockService.getMemories(category);
    }
  },

  createMemory: async (input) => {
    if (isMockMode) return memoryMockService.createMemory(input);
    try {
      return await memoryApi.createMemory(input);
    } catch (err) {
      console.warn("Memory Create API error, falling back to mock:", err);
      return memoryMockService.createMemory(input);
    }
  },

  getRecommendations: async () => {
    if (isMockMode) return memoryMockService.getRecommendations();
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

  deleteMemory: async (id) => {
    if (isMockMode) return memoryMockService.deleteMemory(id);
    try {
      return await memoryApi.deleteMemory(id);
    } catch (err) {
      console.warn("Memory Delete API error, falling back to mock:", err);
      return memoryMockService.deleteMemory(id);
    }
  },
};

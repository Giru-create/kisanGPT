// ─────────────────────────────────────────────────────────────────────────────
// memoryApi.ts
// KisanGPT — Farm Memory API Client
// Maps frontend service calls to FastAPI /api/v1/memory REST endpoints
// ─────────────────────────────────────────────────────────────────────────────

import { apiClient } from "@/lib/apiClient";
import type {
  FarmMemoryItem,
  PersonalizedRecommendation,
  AddMemoryInput,
} from "../types/memory.types";

export const memoryApi = {
  getMemories: async (category?: string): Promise<FarmMemoryItem[]> => {
    return apiClient.get<FarmMemoryItem[]>("/memory", {
      params: category && category !== "all" ? { category } : undefined,
    });
  },

  createMemory: async (input: AddMemoryInput): Promise<FarmMemoryItem> => {
    return apiClient.post<FarmMemoryItem>("/memory", input);
  },

  getRecommendations: async (): Promise<PersonalizedRecommendation[]> => {
    return apiClient.get<PersonalizedRecommendation[]>(
      "/memory/recommendations",
    );
  },

  deleteMemory: async (id: string): Promise<{ detail: string }> => {
    return apiClient.delete<{ detail: string }>(`/memory/${id}`);
  },
};

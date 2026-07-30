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
  MemoryCategory,
} from "../types/memory.types";

// ---------------------------------------------------------------------------
// Backend response shapes (raw from FastAPI)
// ---------------------------------------------------------------------------

interface BackendMemory {
  memory_id: string;
  user_id: string;
  content: string;
  memory_type: string;
  crop: string | null;
  location: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

interface BackendMemoryResponse {
  memory: BackendMemory;
  message: string;
}

interface BackendMemorySearchResponse {
  memories: BackendMemory[];
  total: number;
  query: string;
}

interface BackendRecommendation {
  recommendation_id: string;
  user_id: string;
  title: string;
  content: string;
  recommendation_type: string;
  priority: string;
  confidence: number;
  source_memories: string[];
  created_at: string;
}

interface BackendRecommendationResponse {
  recommendations: BackendRecommendation[];
  total: number;
}

// ---------------------------------------------------------------------------
// Mappers: backend → frontend
// ---------------------------------------------------------------------------

function mapBackendMemory(b: BackendMemory): FarmMemoryItem {
  const meta = b.metadata ?? {};
  return {
    id: b.memory_id,
    category:
      (b.memory_type as Exclude<MemoryCategory, "all">) || "custom_note",
    title: (meta.title as string) || b.content.slice(0, 80),
    description: b.content,
    timestamp: b.created_at,
    location: b.location ?? undefined,
    cropName: b.crop ?? undefined,
    season: (meta.season as string) ?? undefined,
    metrics: meta.metrics as FarmMemoryItem["metrics"],
    tags: (meta.tags as string[]) ?? undefined,
    isVerified: (meta.is_verified as boolean) ?? false,
  };
}

function mapBackendRecommendation(
  b: BackendRecommendation,
): PersonalizedRecommendation {
  const meta = (b as unknown as Record<string, unknown>) ?? {};
  return {
    id: b.recommendation_id,
    title: b.title,
    description: b.content,
    impact: (b.priority as "high" | "medium" | "low") || "medium",
    category: b.recommendation_type,
    actionLabel: (meta.action_label as string) || "View Details",
    targetRoute: (meta.target_route as string) ?? undefined,
    dateGenerated: b.created_at,
    basedOnMemories: b.source_memories,
  };
}

// ---------------------------------------------------------------------------
// Mappers: frontend → backend
// ---------------------------------------------------------------------------

function mapCreateInputToBackend(input: AddMemoryInput): {
  content: string;
  memory_type: string;
  crop: string | null;
  location: string | null;
  metadata: Record<string, unknown>;
} {
  return {
    content: `${input.title}\n\n${input.description}`,
    memory_type: input.category,
    crop: input.cropName ?? null,
    location: input.location ?? null,
    metadata: {
      title: input.title,
      season: input.season,
      metrics: input.metrics,
      tags: input.tags,
      is_verified: false,
    },
  };
}

// ---------------------------------------------------------------------------
// API methods
// ---------------------------------------------------------------------------

export const memoryApi = {
  getMemories: async (category?: MemoryCategory): Promise<FarmMemoryItem[]> => {
    const params: Record<string, string> = {};
    if (category && category !== "all") {
      params.memory_type = category;
    }
    const res = await apiClient.get<BackendMemorySearchResponse>("/memory", {
      params,
    });
    return res.memories.map(mapBackendMemory);
  },

  createMemory: async (input: AddMemoryInput): Promise<FarmMemoryItem> => {
    const body = mapCreateInputToBackend(input);
    const res = await apiClient.post<BackendMemoryResponse>("/memory", body);
    return mapBackendMemory(res.memory);
  },

  deleteMemory: async (id: string): Promise<{ detail: string }> => {
    await apiClient.delete(`/memory/${id}`);
    return { detail: `Memory ${id} deleted` };
  },

  searchMemories: async (
    query: string,
    category?: MemoryCategory,
  ): Promise<FarmMemoryItem[]> => {
    const res = await apiClient.post<BackendMemorySearchResponse>(
      "/memory/search",
      {
        query,
        memory_type: category && category !== "all" ? category : undefined,
        limit: 50,
      },
    );
    return res.memories.map(mapBackendMemory);
  },

  getRecommendations: async (): Promise<PersonalizedRecommendation[]> => {
    const res = await apiClient.post<BackendRecommendationResponse>(
      "/memory/recommendations",
      { limit: 5 },
    );
    return res.recommendations.map(mapBackendRecommendation);
  },
};

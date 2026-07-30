// ─────────────────────────────────────────────────────────────────────────────
// useMemoryQuery.ts
// KisanGPT — React Query hooks for farm memory data fetching
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { memoryService } from "../services/memoryService";
import type {
  MemoryCategory,
  AddMemoryInput,
  FarmMemoryItem,
} from "../types/memory.types";

const MEMORY_QUERY_KEY = ["memory"] as const;

export function useMemoryListQuery(category?: MemoryCategory) {
  return useQuery({
    queryKey: [...MEMORY_QUERY_KEY, "list", category],
    queryFn: () => memoryService.getMemories(category),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useMemorySearchQuery(
  query: string,
  category?: MemoryCategory,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: [...MEMORY_QUERY_KEY, "search", query, category],
    queryFn: () => memoryService.searchMemories(query, category),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: enabled && query.length > 0,
  });
}

export function useCreateMemoryMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    FarmMemoryItem,
    Error,
    AddMemoryInput,
    { previousMemories: FarmMemoryItem[] | undefined }
  >({
    mutationFn: (input: AddMemoryInput) => memoryService.createMemory(input),
    onMutate: async (input) => {
      await queryClient.cancelQueries({
        queryKey: [...MEMORY_QUERY_KEY, "list"],
      });

      const previousMemories = queryClient.getQueryData<FarmMemoryItem[]>([
        ...MEMORY_QUERY_KEY,
        "list",
      ]);

      const optimistic: FarmMemoryItem = {
        id: `temp-${Date.now()}`,
        category: input.category,
        title: input.title,
        description: input.description,
        timestamp: new Date().toISOString(),
        location: input.location,
        cropName: input.cropName,
        season: input.season,
        metrics: input.metrics,
        tags: input.tags,
        isVerified: false,
      };

      queryClient.setQueryData<FarmMemoryItem[]>(
        [...MEMORY_QUERY_KEY, "list"],
        (old) => [optimistic, ...(old ?? [])],
      );

      return { previousMemories };
    },
    onError: (_err, _input, context) => {
      if (context?.previousMemories) {
        queryClient.setQueryData(
          [...MEMORY_QUERY_KEY, "list"],
          context.previousMemories,
        );
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: [...MEMORY_QUERY_KEY, "list"],
      });
    },
  });
}

export function useDeleteMemoryMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    { detail: string },
    Error,
    string,
    { previousMemories: FarmMemoryItem[] | undefined }
  >({
    mutationFn: (id: string) => memoryService.deleteMemory(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({
        queryKey: [...MEMORY_QUERY_KEY, "list"],
      });

      const previousMemories = queryClient.getQueryData<FarmMemoryItem[]>([
        ...MEMORY_QUERY_KEY,
        "list",
      ]);

      queryClient.setQueryData<FarmMemoryItem[]>(
        [...MEMORY_QUERY_KEY, "list"],
        (old) => (old ?? []).filter((m) => m.id !== id),
      );

      return { previousMemories };
    },
    onError: (_err, _id, context) => {
      if (context?.previousMemories) {
        queryClient.setQueryData(
          [...MEMORY_QUERY_KEY, "list"],
          context.previousMemories,
        );
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: [...MEMORY_QUERY_KEY, "list"],
      });
    },
  });
}

export function useRecommendationsQuery() {
  return useQuery({
    queryKey: [...MEMORY_QUERY_KEY, "recommendations"],
    queryFn: () => memoryService.getRecommendations(),
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

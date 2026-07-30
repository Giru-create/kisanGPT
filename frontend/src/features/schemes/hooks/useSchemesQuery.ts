// ─────────────────────────────────────────────────────────────────────────────
// useSchemesQuery.ts
// KisanGPT — React Query hooks for government schemes data fetching
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useQuery } from "@tanstack/react-query";
import { schemesService } from "../services/schemesService";
import type { SchemeFilters } from "../types/schemes.types";

const SCHEMES_QUERY_KEY = ["schemes"] as const;

export function useSchemesListQuery(filters: Partial<SchemeFilters> = {}) {
  return useQuery({
    queryKey: [...SCHEMES_QUERY_KEY, "list", filters],
    queryFn: () => schemesService.list(filters),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useSchemeDetailQuery(
  schemeId: string,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: [...SCHEMES_QUERY_KEY, "detail", schemeId],
    queryFn: () => schemesService.get(schemeId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
    enabled,
  });
}

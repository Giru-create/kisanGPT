// ─────────────────────────────────────────────────────────────────────────────
// useSchemes.ts
// KisanGPT — Government Schemes orchestration hook
// Bridges React Query (data) + Zustand (UI state)
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useMemo } from "react";
import { useSchemesListQuery } from "./useSchemesQuery";
import {
  useSchemesStore,
  selectSchemesFilters,
  selectSelectedScheme,
  selectIsDetailOpen,
} from "../store/schemesStore";
import type { SchemesUIState } from "../types/schemes.types";

export function useSchemes() {
  const filters = useSchemesStore(selectSchemesFilters);
  const selectedScheme = useSchemesStore(selectSelectedScheme);
  const isDetailOpen = useSchemesStore(selectIsDetailOpen);

  const {
    data: queryData,
    isLoading,
    isError,
    error,
    refetch,
  } = useSchemesListQuery(filters);

  const uiState: SchemesUIState = useMemo(() => {
    if (isLoading) return { status: "loading" };
    if (isError)
      return {
        status: "error",
        message: error?.message ?? "Failed to load schemes",
      };
    if (queryData) return { status: "success", data: queryData };
    return { status: "idle" };
  }, [isLoading, isError, error, queryData]);

  return {
    uiState,
    filters,
    selectedScheme,
    isDetailOpen,
    refresh: () => void refetch(),
    setState: useSchemesStore((s) => s.setState),
    setCrop: useSchemesStore((s) => s.setCrop),
    setFarmerCategory: useSchemesStore((s) => s.setFarmerCategory),
    setSchemeType: useSchemesStore((s) => s.setSchemeType),
    setSearch: useSchemesStore((s) => s.setSearch),
    setPage: useSchemesStore((s) => s.setPage),
    resetFilters: useSchemesStore((s) => s.resetFilters),
    openDetail: useSchemesStore((s) => s.openDetail),
    closeDetail: useSchemesStore((s) => s.closeDetail),
  };
}

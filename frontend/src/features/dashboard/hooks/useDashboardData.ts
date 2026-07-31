// ─────────────────────────────────────────────────────────────────────────────
// useDashboardData.ts
// KisanGPT — React Query hooks for dashboard data fetching
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboardService";

const DASHBOARD_QUERY_KEY = ["dashboard"] as const;

export function useDashboardQuery(options?: {
  lat?: number;
  lon?: number;
  city?: string;
  token?: string;
}) {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, options],
    queryFn: () => dashboardService.getDashboard(options),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

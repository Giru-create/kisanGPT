// ─────────────────────────────────────────────────────────────────────────────
// schemesApi.ts
// KisanGPT — Government Schemes API Client
// Typed HTTP client for FastAPI /api/v1/schemes endpoints
// ─────────────────────────────────────────────────────────────────────────────

import { apiClient } from "@/lib/apiClient";
import type {
  SchemeListResponse,
  SchemeDetailResponse,
  SchemeFilters,
} from "../types/schemes.types";

const BASE = "/api/v1/schemes";

function toQueryParams(filters: Partial<SchemeFilters>): string {
  const params = new URLSearchParams();
  if (filters.state) params.set("state", filters.state);
  if (filters.crop) params.set("crop", filters.crop);
  if (filters.farmerCategory)
    params.set("farmer_category", filters.farmerCategory);
  if (filters.schemeType) params.set("scheme_type", filters.schemeType);
  if (filters.search) params.set("search", filters.search);
  if (filters.page && filters.page > 1)
    params.set("page", String(filters.page));
  if (filters.pageSize && filters.pageSize !== 20)
    params.set("page_size", String(filters.pageSize));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export const schemesApi = {
  list: async (
    filters: Partial<SchemeFilters> = {},
  ): Promise<SchemeListResponse> => {
    const qs = toQueryParams(filters);
    return apiClient.get<SchemeListResponse>(`${BASE}${qs}`);
  },

  get: async (schemeId: string): Promise<SchemeDetailResponse> => {
    return apiClient.get<SchemeDetailResponse>(
      `${BASE}/${encodeURIComponent(schemeId)}`,
    );
  },
};

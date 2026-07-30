// ─────────────────────────────────────────────────────────────────────────────
// schemesService.ts
// KisanGPT — Government Schemes Unified Service Abstraction
// Decouples UI/hooks from backend API vs mock data sources
// ─────────────────────────────────────────────────────────────────────────────

import { schemesApi } from "./schemesApi";
import { schemesMockService } from "./schemesMock";
import type {
  SchemeListResponse,
  SchemeDetailResponse,
  SchemeFilters,
} from "../types/schemes.types";

export interface ISchemesService {
  list: (filters?: Partial<SchemeFilters>) => Promise<SchemeListResponse>;
  get: (schemeId: string) => Promise<SchemeDetailResponse>;
}

function isMockMode(): boolean {
  return (
    process.env.NEXT_PUBLIC_USE_MOCK_API === undefined ||
    process.env.NEXT_PUBLIC_USE_MOCK_API === "true"
  );
}

export const schemesService: ISchemesService = {
  list: async (filters = {}) => {
    if (isMockMode()) return schemesMockService.list(filters);
    try {
      return await schemesApi.list(filters);
    } catch (err) {
      console.warn("Schemes API error, falling back to mock:", err);
      return schemesMockService.list(filters);
    }
  },

  get: async (schemeId: string) => {
    if (isMockMode()) return schemesMockService.get(schemeId);
    try {
      return await schemesApi.get(schemeId);
    } catch (err) {
      console.warn("Schemes API error, falling back to mock:", err);
      return schemesMockService.get(schemeId);
    }
  },
};

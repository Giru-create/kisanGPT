// ─────────────────────────────────────────────────────────────────────────────
// marketApi.ts
// KisanGPT — Market Intelligence API Client
// Maps frontend services to FastAPI /api/v1/market REST endpoints
// ─────────────────────────────────────────────────────────────────────────────

import { apiClient } from "@/lib/apiClient";
import type {
  MarketOverview,
  MarketPriceResponse,
  MarketTrendResponse,
  MarketHistoryResponse,
  MarketAdviceResponse,
  PriceAlert,
  PriceAlertDraft,
} from "../types/market.types";

export const marketApi = {
  getMarketOverview: async (state?: string): Promise<MarketOverview> => {
    return apiClient.get<MarketOverview>("/market/overview", {
      params: { state },
    });
  },

  getMarketPrices: async (
    commodity: string,
    state?: string,
  ): Promise<MarketPriceResponse> => {
    return apiClient.get<MarketPriceResponse>("/market/prices", {
      params: { commodity, state },
    });
  },

  getMarketTrend: async (
    commodity: string,
    days: number = 30,
  ): Promise<MarketTrendResponse> => {
    return apiClient.get<MarketTrendResponse>("/market/trend", {
      params: { commodity, days },
    });
  },

  getMarketHistory: async (
    commodity: string,
    mandi: string,
    days: number = 30,
  ): Promise<MarketHistoryResponse> => {
    return apiClient.get<MarketHistoryResponse>("/market/history", {
      params: { commodity, mandi, days },
    });
  },

  getMarketAdvice: async (commodity: string): Promise<MarketAdviceResponse> => {
    return apiClient.get<MarketAdviceResponse>("/market/advice", {
      params: { commodity },
    });
  },

  getMarketAlerts: async (): Promise<PriceAlert[]> => {
    const res = await apiClient.get<{
      alerts: PriceAlert[];
      total_count: number;
    }>("/market/alerts");
    return res.alerts || [];
  },

  createMarketAlert: async (draft: PriceAlertDraft): Promise<PriceAlert> => {
    return apiClient.post<PriceAlert>("/market/alerts", draft);
  },

  deleteMarketAlert: async (alertId: string): Promise<{ detail: string }> => {
    return apiClient.delete<{ detail: string }>(`/market/alerts/${alertId}`);
  },
};

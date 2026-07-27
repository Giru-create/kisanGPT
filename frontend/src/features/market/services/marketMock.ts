// ─────────────────────────────────────────────────────────────────────────────
// marketMock.ts
// KisanGPT — Market Intelligence Mock Service
// Provides fallback data when backend endpoints are unavailable
// ─────────────────────────────────────────────────────────────────────────────

import {
  MOCK_MARKET_OVERVIEW,
  MOCK_PRICE_LIST,
  MOCK_TREND_DATA,
  MOCK_HISTORY_DATA,
  MOCK_ADVICE_DATA,
} from "../constants/market.constants";
import type {
  MarketOverview,
  MarketPriceResponse,
  MarketTrendResponse,
  MarketHistoryResponse,
  MarketAdviceResponse,
  PriceAlert,
  PriceAlertDraft,
} from "../types/market.types";

const mockDelay = (ms: number = 800) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const marketMockService = {
  getMarketOverview: async (state?: string): Promise<MarketOverview> => {
    void state;
    await mockDelay(1200);
    return MOCK_MARKET_OVERVIEW;
  },

  getMarketPrices: async (
    commodity: string,
    state?: string,
  ): Promise<MarketPriceResponse> => {
    void state;
    await mockDelay(1000);
    return { ...MOCK_PRICE_LIST, commodity };
  },

  getMarketTrend: async (
    commodity: string,
    days: number = 30,
  ): Promise<MarketTrendResponse> => {
    void days;
    await mockDelay(800);
    return { ...MOCK_TREND_DATA, commodity };
  },

  getMarketHistory: async (
    commodity: string,
    mandi: string,
    days: number = 30,
  ): Promise<MarketHistoryResponse> => {
    void days;
    await mockDelay(900);
    return { ...MOCK_HISTORY_DATA, commodity, mandi };
  },

  getMarketAdvice: async (commodity: string): Promise<MarketAdviceResponse> => {
    await mockDelay(700);
    return { ...MOCK_ADVICE_DATA, commodity };
  },

  getMarketAlerts: async (): Promise<PriceAlert[]> => {
    await mockDelay(500);
    return [];
  },

  createMarketAlert: async (draft: PriceAlertDraft): Promise<PriceAlert> => {
    await mockDelay(400);
    return {
      id: `alert-${Date.now()}`,
      commodity: draft.commodity,
      target_price: draft.target_price,
      condition: draft.condition,
      is_active: true,
      created_at: new Date().toISOString(),
      triggered_at: null,
    };
  },

  deleteMarketAlert: async (alertId: string): Promise<{ detail: string }> => {
    void alertId;
    await mockDelay(300);
    return { detail: "Alert deleted" };
  },
};

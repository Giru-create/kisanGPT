// ─────────────────────────────────────────────────────────────────────────────
// marketService.ts
// KisanGPT — Market Intelligence Unified Service Abstraction
// Decouples UI/hooks from backend API vs mock data sources
// ─────────────────────────────────────────────────────────────────────────────

import { marketApi } from "./marketApi";
import { marketMockService } from "./marketMock";
import type {
  MarketOverview,
  MarketPriceResponse,
  MarketTrendResponse,
  MarketHistoryResponse,
  MarketAdviceResponse,
  MarketRecommendationResponse,
  PriceAlert,
  PriceAlertDraft,
} from "../types/market.types";

export interface IMarketService {
  getMarketOverview: (state?: string) => Promise<MarketOverview>;
  getMarketPrices: (
    commodity: string,
    state?: string,
  ) => Promise<MarketPriceResponse>;
  getMarketTrend: (
    commodity: string,
    days?: number,
  ) => Promise<MarketTrendResponse>;
  getMarketHistory: (
    commodity: string,
    mandi: string,
    days?: number,
  ) => Promise<MarketHistoryResponse>;
  getMarketAdvice: (commodity: string) => Promise<MarketAdviceResponse>;
  getMarketRecommendation: (
    commodity: string,
  ) => Promise<MarketRecommendationResponse>;
  getMarketAlerts: () => Promise<PriceAlert[]>;
  createMarketAlert: (draft: PriceAlertDraft) => Promise<PriceAlert>;
  deleteMarketAlert: (alertId: string) => Promise<{ detail: string }>;
}

const isMockMode =
  process.env.NEXT_PUBLIC_USE_MOCK_API === undefined ||
  process.env.NEXT_PUBLIC_USE_MOCK_API === "true";

export const marketService: IMarketService = {
  getMarketOverview: async (state) => {
    if (isMockMode) return marketMockService.getMarketOverview(state);
    try {
      return await marketApi.getMarketOverview(state);
    } catch (err) {
      console.warn("Market API error, falling back to mock:", err);
      return marketMockService.getMarketOverview(state);
    }
  },

  getMarketPrices: async (commodity, state) => {
    if (isMockMode) return marketMockService.getMarketPrices(commodity, state);
    try {
      return await marketApi.getMarketPrices(commodity, state);
    } catch (err) {
      console.warn("Market API error, falling back to mock:", err);
      return marketMockService.getMarketPrices(commodity, state);
    }
  },

  getMarketTrend: async (commodity, days) => {
    if (isMockMode) return marketMockService.getMarketTrend(commodity, days);
    try {
      return await marketApi.getMarketTrend(commodity, days);
    } catch (err) {
      console.warn("Market API error, falling back to mock:", err);
      return marketMockService.getMarketTrend(commodity, days);
    }
  },

  getMarketHistory: async (commodity, mandi, days) => {
    if (isMockMode)
      return marketMockService.getMarketHistory(commodity, mandi, days);
    try {
      return await marketApi.getMarketHistory(commodity, mandi, days);
    } catch (err) {
      console.warn("Market API error, falling back to mock:", err);
      return marketMockService.getMarketHistory(commodity, mandi, days);
    }
  },

  getMarketAdvice: async (commodity) => {
    if (isMockMode) return marketMockService.getMarketAdvice(commodity);
    try {
      return await marketApi.getMarketAdvice(commodity);
    } catch (err) {
      console.warn("Market API error, falling back to mock:", err);
      return marketMockService.getMarketAdvice(commodity);
    }
  },

  getMarketRecommendation: async (commodity) => {
    if (isMockMode) return marketMockService.getMarketRecommendation(commodity);
    try {
      return await marketApi.getMarketRecommendation(commodity);
    } catch (err) {
      console.warn("Market API error, falling back to mock:", err);
      return marketMockService.getMarketRecommendation(commodity);
    }
  },

  getMarketAlerts: async () => {
    if (isMockMode) return marketMockService.getMarketAlerts();
    try {
      return await marketApi.getMarketAlerts();
    } catch (err) {
      console.warn("Market API error, falling back to mock:", err);
      return marketMockService.getMarketAlerts();
    }
  },

  createMarketAlert: async (draft) => {
    if (isMockMode) return marketMockService.createMarketAlert(draft);
    try {
      return await marketApi.createMarketAlert(draft);
    } catch (err) {
      console.warn("Market API error, falling back to mock:", err);
      return marketMockService.createMarketAlert(draft);
    }
  },

  deleteMarketAlert: async (alertId) => {
    if (isMockMode) return marketMockService.deleteMarketAlert(alertId);
    try {
      return await marketApi.deleteMarketAlert(alertId);
    } catch (err) {
      console.warn("Market API error, falling back to mock:", err);
      return marketMockService.deleteMarketAlert(alertId);
    }
  },
};

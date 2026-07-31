// ─────────────────────────────────────────────────────────────────────────────
// index.ts
// KisanGPT — Market Intelligence feature barrel export
// ─────────────────────────────────────────────────────────────────────────────

// Page
export { MarketPage } from "./components/MarketPage";

// Components
export { HeroSection } from "./components/HeroSection";
export { MandiPriceCard } from "./components/MandiPriceCard";
export { MarketTrends } from "./components/MarketTrends";
export { CommodityExplorer } from "./components/CommodityExplorer";
export { PriceComparison } from "./components/PriceComparison";
export { PriceAlerts } from "./components/PriceAlerts";
export { AIInsights } from "./components/AIInsights";
export { FarmerActions } from "./components/FarmerActions";
export { CommoditySelector } from "./components/CommoditySelector";
export { AIRecommendationCard } from "./components/AIRecommendationCard";
export { PriceAlertModal } from "./components/PriceAlertModal";
export { MarketSkeleton } from "./components/MarketSkeleton";
export { MarketError } from "./components/MarketError";
export { MarketEmpty } from "./components/MarketEmpty";

// Hooks
export { useMarket } from "./hooks/useMarket";
export {
  useMarketOverviewQuery,
  useMarketPricesQuery,
  useMarketTrendQuery,
  useMarketHistoryQuery,
  useMarketAdviceQuery,
  useMarketRecommendationQuery,
  useMarketAlertsQuery,
  useCreateMarketAlertMutation,
  useDeleteMarketAlertMutation,
} from "./hooks/useMarketQuery";

// Store
export { useMarketStore } from "./store/marketStore";

// Services
export { marketService } from "./services/marketService";
export { marketApi } from "./services/marketApi";
export { marketMockService } from "./services/marketMock";

// Types
export type {
  CommodityPrice,
  PriceTrend,
  PriceAlert,
  PriceAlertDraft,
  AIRecommendation,
  PremiumAIRecommendation,
  MarketOverview,
  MarketPriceResponse,
  MarketTrendResponse,
  MandiComparison,
  AIInsight,
  HeroMarketBrief,
  MarketTrendData,
  MarketSentiment,
  TrendDirection,
  TrendTimeframe,
  CommodityCategory,
  InsightCategory,
  RecommendationType,
  RiskLevel,
  AlertCondition,
  AlertChannel,
  Mandi,
  MarketUIState,
  PriceListUIState,
  TrendUIState,
} from "./types/market.types";

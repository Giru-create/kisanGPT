// ─────────────────────────────────────────────────────────────────────────────
// market.types.ts
// KisanGPT — Market Intelligence feature types
// ─────────────────────────────────────────────────────────────────────────────

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

export type TrendDirection = "rising" | "falling" | "stable" | "volatile";

export type AlertCondition = "above" | "below";

// ---------------------------------------------------------------------------
// Commodity price
// ---------------------------------------------------------------------------

export interface CommodityPrice {
  commodity: string;
  variety: string;
  mandi_name: string;
  district: string;
  state: string;
  price_per_quintal: number;
  change_amount: number;
  change_percent: number;
  is_rise: boolean;
  msp: number;
  msp_difference: number;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// Price trend
// ---------------------------------------------------------------------------

export interface PriceTrend {
  commodity: string;
  dates: string[];
  prices: number[];
  trend_direction: TrendDirection;
  avg_price: number;
  min_price: number;
  max_price: number;
  price_range: number;
}

// ---------------------------------------------------------------------------
// Price alert
// ---------------------------------------------------------------------------

export interface PriceAlert {
  id: string;
  commodity: string;
  target_price: number;
  condition: AlertCondition;
  is_active: boolean;
  created_at: string;
  triggered_at: string | null;
}

// ---------------------------------------------------------------------------
// Alert notification channels
// ---------------------------------------------------------------------------

export type AlertChannel = "sms" | "whatsapp" | "push";

export interface PriceAlertDraft {
  commodity: string;
  target_price: number;
  condition: AlertCondition;
  channels: AlertChannel[];
}

// ---------------------------------------------------------------------------
// AI Selling Recommendation (frontend display type)
// ---------------------------------------------------------------------------

export type RecommendationType =
  "sell_now" | "hold" | "wait" | "alternative_mandi" | "switch_mandi";

export interface AIRecommendation {
  type: RecommendationType;
  commodity: string;
  confidence: number; // 0-100
  headline: string;
  rationale: string;
  net_gain_per_quintal?: number;
  suggested_mandi?: string;
  sell_within_days?: number;
  generated_at: string;
}

// ---------------------------------------------------------------------------
// Backend recommendation (matches backend Recommendation schema)
// ---------------------------------------------------------------------------

export type BackendRecommendationType =
  "sell_now" | "hold" | "wait" | "switch_mandi";

export type RiskLevel = "low" | "medium" | "high";

export interface MarketRecommendation {
  type: BackendRecommendationType;
  commodity: string;
  confidence: number;
  headline: string;
  rationale: string;
  potential_gain: number;
  risk_level: RiskLevel;
  suggested_action: string;
  generated_at: string;
}

export interface MarketRecommendationResponse {
  commodity: string;
  current_price: number;
  msp: number;
  recommendation: MarketRecommendation;
  generated_at: string;
}

// ---------------------------------------------------------------------------
// Nearby mandi
// ---------------------------------------------------------------------------

export interface NearbyMandi {
  name: string;
  district: string;
  distance_km: number;
  modal_price: number;
  has_cold_storage: boolean;
  has_enam: boolean;
}

// ---------------------------------------------------------------------------
// Market overview
// ---------------------------------------------------------------------------

export interface MarketOverview {
  top_commodities: CommodityPrice[];
  rising: CommodityPrice[];
  falling: CommodityPrice[];
  generated_at: string;
}

// ---------------------------------------------------------------------------
// API responses
// ---------------------------------------------------------------------------

export interface MarketPriceResponse {
  commodity: string;
  prices: CommodityPrice[];
  total_count: number;
  generated_at: string;
}

export interface MarketTrendResponse {
  commodity: string;
  trend: PriceTrend;
}

// ---------------------------------------------------------------------------
// UI state (discriminated union)
// ---------------------------------------------------------------------------

export type MarketUIState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: MarketOverview }
  | { status: "error"; message: string };

export type PriceListUIState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: MarketPriceResponse }
  | { status: "error"; message: string };

export type TrendUIState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: MarketTrendResponse }
  | { status: "error"; message: string };

// ---------------------------------------------------------------------------
// Price history
// ---------------------------------------------------------------------------

export interface PriceHistoryItem {
  date: string;
  price: number;
  mandi_name: string;
}

export interface MarketHistoryResponse {
  commodity: string;
  mandi: string;
  history: PriceHistoryItem[];
  total_count: number;
}

// ---------------------------------------------------------------------------
// Market advice
// ---------------------------------------------------------------------------

export type AdviceSeverity = "info" | "warning" | "danger";

export interface MarketAdvice {
  category: string;
  title: string;
  message: string;
  severity: AdviceSeverity;
}

export interface MarketAdviceResponse {
  commodity: string;
  current_price: number;
  msp: number;
  trend: TrendDirection;
  advice: MarketAdvice[];
  generated_at: string;
}

// ---------------------------------------------------------------------------
// Mandi (for selector)
// ---------------------------------------------------------------------------

export interface Mandi {
  name: string;
  district: string;
  state: string;
}

// ---------------------------------------------------------------------------
// UI state variants for new features
// ---------------------------------------------------------------------------

export type HistoryUIState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: MarketHistoryResponse }
  | { status: "error"; message: string };

export type AdviceUIState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: MarketAdviceResponse }
  | { status: "error"; message: string };

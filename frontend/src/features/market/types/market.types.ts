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

// ─────────────────────────────────────────────────────────────────────────────
// market.constants.ts
// KisanGPT — Market Intelligence feature constants
// ─────────────────────────────────────────────────────────────────────────────

import type { CommodityPrice } from "../types/market.types";

// ---------------------------------------------------------------------------
// Available commodities
// ---------------------------------------------------------------------------

export const COMMODITIES = [
  "Wheat",
  "Mustard",
  "Paddy",
  "Cotton",
  "Soybean",
  "Gram",
  "Maize",
  "Onion",
  "Potato",
  "Tomato",
] as const;

export type CommodityName = (typeof COMMODITIES)[number];

// ---------------------------------------------------------------------------
// Indian states with major mandis
// ---------------------------------------------------------------------------

export const STATES = [
  "Haryana",
  "Punjab",
  "Rajasthan",
  "Madhya Pradesh",
  "Delhi",
  "Uttar Pradesh",
  "Gujarat",
  "Maharashtra",
] as const;

// ---------------------------------------------------------------------------
// Mock overview data — used until the real API is wired
// ---------------------------------------------------------------------------

const today = new Date().toISOString();

export const MOCK_MARKET_OVERVIEW = {
  top_commodities: [
    {
      commodity: "Wheat",
      variety: "PBW 550 / FAQ",
      mandi_name: "Karnal APMC Mandi",
      district: "Karnal",
      state: "Haryana",
      price_per_quintal: 2275,
      change_amount: 45,
      change_percent: 2.02,
      is_rise: true,
      msp: 2250,
      msp_difference: 25,
      updated_at: today,
    },
    {
      commodity: "Mustard",
      variety: "Black Bold",
      mandi_name: "Karnal APMC Mandi",
      district: "Karnal",
      state: "Haryana",
      price_per_quintal: 5650,
      change_amount: -30,
      change_percent: -0.53,
      is_rise: false,
      msp: 5500,
      msp_difference: 150,
      updated_at: today,
    },
    {
      commodity: "Paddy",
      variety: "Pusa Basmati",
      mandi_name: "Taraori Mandi",
      district: "Karnal",
      state: "Haryana",
      price_per_quintal: 4320,
      change_amount: 80,
      change_percent: 1.89,
      is_rise: true,
      msp: 3700,
      msp_difference: 620,
      updated_at: today,
    },
  ] satisfies CommodityPrice[],
  rising: [] as CommodityPrice[],
  falling: [] as CommodityPrice[],
  generated_at: today,
};

MOCK_MARKET_OVERVIEW.rising = MOCK_MARKET_OVERVIEW.top_commodities.filter(
  (c) => c.is_rise,
);
MOCK_MARKET_OVERVIEW.falling = MOCK_MARKET_OVERVIEW.top_commodities.filter(
  (c) => !c.is_rise,
);

// ---------------------------------------------------------------------------
// Mock price list data
// ---------------------------------------------------------------------------

export const MOCK_PRICE_LIST = {
  commodity: "Wheat",
  prices: [
    {
      commodity: "Wheat",
      variety: "PBW 550 / FAQ",
      mandi_name: "Karnal APMC Mandi",
      district: "Karnal",
      state: "Haryana",
      price_per_quintal: 2275,
      change_amount: 45,
      change_percent: 2.02,
      is_rise: true,
      msp: 2250,
      msp_difference: 25,
      updated_at: today,
    },
    {
      commodity: "Wheat",
      variety: "PBW 550 / FAQ",
      mandi_name: "Sonipat Mandi",
      district: "Sonipat",
      state: "Haryana",
      price_per_quintal: 2260,
      change_amount: 30,
      change_percent: 1.34,
      is_rise: true,
      msp: 2250,
      msp_difference: 10,
      updated_at: today,
    },
    {
      commodity: "Wheat",
      variety: "PBW 550 / FAQ",
      mandi_name: "Panipat Mandi",
      district: "Panipat",
      state: "Haryana",
      price_per_quintal: 2245,
      change_amount: -15,
      change_percent: -0.66,
      is_rise: false,
      msp: 2250,
      msp_difference: -5,
      updated_at: today,
    },
  ] satisfies CommodityPrice[],
  total_count: 3,
  generated_at: today,
};

// ---------------------------------------------------------------------------
// Mock trend data
// ---------------------------------------------------------------------------

export const MOCK_TREND_DATA = {
  commodity: "Wheat",
  trend: {
    commodity: "Wheat",
    dates: Array.from({ length: 30 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - 29 + i);
      return d.toISOString().split("T")[0] ?? "";
    }),
    prices: Array.from(
      { length: 30 },
      (_, i) => 2200 + Math.round(Math.sin(i / 5) * 50 + i * 2),
    ),
    trend_direction: "rising" as const,
    avg_price: 2275,
    min_price: 2180,
    max_price: 2380,
    price_range: 200,
  },
};

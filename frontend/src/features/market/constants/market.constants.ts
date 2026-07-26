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

// ---------------------------------------------------------------------------
// Mock AI recommendation data
// ---------------------------------------------------------------------------

export const MOCK_AI_RECOMMENDATION = {
  type: "sell_now" as const,
  commodity: "Wheat",
  confidence: 91,
  headline: "Sell Now — 30-Day Price Peak",
  rationale:
    "Karnal Mandi wheat prices are at a 30-day peak of ₹2,275/qtl. Expected high arrivals over the next 3–4 days may compress prices by 3–5%. Festival procurement demand is currently supporting prices — ideal window to sell.",
  net_gain_per_quintal: undefined,
  suggested_mandi: undefined,
  sell_within_days: 2,
  generated_at: new Date().toISOString(),
};

// ---------------------------------------------------------------------------
// Mock nearby mandis
// ---------------------------------------------------------------------------

export const MOCK_NEARBY_MANDIS = [
  {
    name: "Karnal APMC Mandi",
    district: "Karnal",
    distance_km: 0,
    modal_price: 2275,
    has_cold_storage: false,
    has_enam: true,
  },
  {
    name: "Sonipat Mandi",
    district: "Sonipat",
    distance_km: 22,
    modal_price: 2260,
    has_cold_storage: false,
    has_enam: true,
  },
  {
    name: "Panipat Mandi",
    district: "Panipat",
    distance_km: 38,
    modal_price: 2245,
    has_cold_storage: true,
    has_enam: false,
  },
];

// ---------------------------------------------------------------------------
// Mock price history data
// ---------------------------------------------------------------------------

export const MOCK_HISTORY_DATA = {
  commodity: "Wheat",
  mandi: "Karnal Mandi",
  history: Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 29 + i);
    return {
      date: d.toISOString().split("T")[0] ?? "",
      price: 2200 + Math.round(Math.sin(i / 5) * 50 + i * 2),
      mandi_name: "Karnal Mandi",
    };
  }),
  total_count: 30,
};

// ---------------------------------------------------------------------------
// Mock market advice data
// ---------------------------------------------------------------------------

export const MOCK_ADVICE_DATA = {
  commodity: "Wheat",
  current_price: 2275,
  msp: 2250,
  trend: "rising" as const,
  advice: [
    {
      category: "price",
      title: "Wheat Price Above MSP",
      message:
        "Current price ₹2,275/qnt is 1.1% above MSP (₹2,250/qnt). Good time to sell.",
      severity: "info" as const,
    },
    {
      category: "trend",
      title: "Price Rising Trend",
      message:
        "Wheat prices are trending upward. Consider selling soon to maximize returns.",
      severity: "info" as const,
    },
  ],
  generated_at: new Date().toISOString(),
};

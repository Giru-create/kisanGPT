// ─────────────────────────────────────────────────────────────────────────────
// market.constants.ts
// KisanGPT — Market Intelligence feature constants
// ─────────────────────────────────────────────────────────────────────────────

import type {
  CommodityPrice,
  CommodityCategory,
  MandiComparison,
  AIInsight,
  HeroMarketBrief,
  MarketSentiment,
} from "../types/market.types";

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
// Commodity → Emoji
// ---------------------------------------------------------------------------

export const COMMODITY_EMOJI: Record<string, string> = {
  Wheat: "\uD83C\uDF3E",
  Mustard: "\uD83E\uDD52",
  Paddy: "\uD83C\uDF5A",
  Cotton: "\u2601\uFE0F",
  Soybean: "\uD83C\uDF31",
  Gram: "\uD83C\uDF38",
  Maize: "\uD83C\uDF3D",
  Onion: "\uD83C\uDF45",
  Potato: "\uD83E\uDD54",
  Tomato: "\uD83C\uDF45",
};

// ---------------------------------------------------------------------------
// Commodity → Category
// ---------------------------------------------------------------------------

export const COMMODITY_CATEGORIES: Record<string, CommodityCategory> = {
  Wheat: "cereals",
  Paddy: "cereals",
  Maize: "cereals",
  Gram: "pulses",
  Soybean: "oilseeds",
  Mustard: "oilseeds",
  Cotton: "cash_crops",
  Onion: "vegetables",
  Potato: "vegetables",
  Tomato: "vegetables",
};

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
// Sentiment config
// ---------------------------------------------------------------------------

export const SENTIMENT_CONFIG: Record<
  MarketSentiment,
  { label: string; color: string; bg: string; icon: string }
> = {
  bullish: {
    label: "Bullish",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    icon: "\uD83D\uDCC8",
  },
  neutral: {
    label: "Neutral",
    color: "text-amber-600",
    bg: "bg-amber-50",
    icon: "\u2696\uFE0F",
  },
  bearish: {
    label: "Bearish",
    color: "text-red-600",
    bg: "bg-red-50",
    icon: "\uD83D\uDCC9",
  },
};

// ---------------------------------------------------------------------------
// Category labels
// ---------------------------------------------------------------------------

export const CATEGORY_LABELS: Record<CommodityCategory, string> = {
  cereals: "Cereals",
  pulses: "Pulses",
  oilseeds: "Oilseeds",
  vegetables: "Vegetables",
  fruits: "Fruits",
  cash_crops: "Cash Crops",
  spices: "Spices",
};

// ---------------------------------------------------------------------------
// Insight category labels + icons
// ---------------------------------------------------------------------------

export const INSIGHT_CONFIG: Record<
  string,
  { label: string; icon: string; color: string }
> = {
  market_summary: {
    label: "Market Summary",
    icon: "\uD83D\uDCCA",
    color: "text-blue-600",
  },
  demand_analysis: {
    label: "Demand Analysis",
    icon: "\uD83D\uDCE8",
    color: "text-emerald-600",
  },
  supply_analysis: {
    label: "Supply Analysis",
    icon: "\uD83C\uDFED",
    color: "text-violet-600",
  },
  export_opportunities: {
    label: "Export Opportunities",
    icon: "\uD83C\uDF0D",
    color: "text-cyan-600",
  },
  government_procurement: {
    label: "Govt Procurement",
    icon: "\uD83C\uDFDB\uFE0F",
    color: "text-amber-600",
  },
  festival_impact: {
    label: "Festival Impact",
    icon: "\uD83C\uDF89",
    color: "text-pink-600",
  },
  weather_impact: {
    label: "Weather Impact",
    icon: "\uD83C\uDF26\uFE0F",
    color: "text-sky-600",
  },
  future_forecast: {
    label: "Future Forecast",
    icon: "\uD83D\uDD2E",
    color: "text-purple-600",
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════

const today = new Date().toISOString();

// ---------------------------------------------------------------------------
// Mock Hero Brief
// ---------------------------------------------------------------------------

export const MOCK_HERO_BRIEF: HeroMarketBrief = {
  sentiment: "bullish",
  sentimentLabel: "Bullish Market",
  bestCommodity: "Wheat",
  bestCommodityChange: 2.02,
  estimatedProfitOpportunity: "\u20B92,450 per acre",
  confidenceScore: 87,
  headline:
    "Wheat prices at 30-day peak. Sell within 2 days for maximum profit.",
  lastUpdated: today,
};

// ---------------------------------------------------------------------------
// Mock overview data
// ---------------------------------------------------------------------------

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
    {
      commodity: "Cotton",
      variety: "Kapas / Medium",
      mandi_name: "Rajkot APMC",
      district: "Rajkot",
      state: "Gujarat",
      price_per_quintal: 7120,
      change_amount: 120,
      change_percent: 1.71,
      is_rise: true,
      msp: 7020,
      msp_difference: 100,
      updated_at: today,
    },
    {
      commodity: "Onion",
      variety: "Red / Medium",
      mandi_name: "Nashik Mandi",
      district: "Nashik",
      state: "Maharashtra",
      price_per_quintal: 1850,
      change_amount: -95,
      change_percent: -4.89,
      is_rise: false,
      msp: 0,
      msp_difference: 0,
      updated_at: today,
    },
    {
      commodity: "Tomato",
      variety: "Hybrid / Grade A",
      mandi_name: "Azadpur Mandi",
      district: "Delhi",
      state: "Delhi",
      price_per_quintal: 2400,
      change_amount: 65,
      change_percent: 2.78,
      is_rise: true,
      msp: 0,
      msp_difference: 0,
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
// Mock price list data (multi-commodity)
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
    {
      commodity: "Wheat",
      variety: "HD 3226 / FAQ",
      mandi_name: "Indore APMC",
      district: "Indore",
      state: "Madhya Pradesh",
      price_per_quintal: 2310,
      change_amount: 55,
      change_percent: 2.44,
      is_rise: true,
      msp: 2250,
      msp_difference: 60,
      updated_at: today,
    },
    {
      commodity: "Wheat",
      variety: "Lok 1 / FAQ",
      mandi_name: "Jaipur Mandi",
      district: "Jaipur",
      state: "Rajasthan",
      price_per_quintal: 2235,
      change_amount: -10,
      change_percent: -0.45,
      is_rise: false,
      msp: 2250,
      msp_difference: -15,
      updated_at: today,
    },
  ] satisfies CommodityPrice[],
  total_count: 5,
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
// Mock enhanced AI recommendation (premium)
// ---------------------------------------------------------------------------

export const MOCK_PREMIUM_RECOMMENDATION = {
  type: "sell_now" as const,
  commodity: "Wheat",
  confidence: 91,
  headline: "Sell Now \u2014 30-Day Price Peak",
  rationale:
    "Karnal Mandi wheat prices are at a 30-day peak of \u20B92,275/qtl. Expected high arrivals over the next 3\u20134 days may compress prices by 3\u20135%. Festival procurement demand is currently supporting prices \u2014 ideal window to sell.",
  expectedPriceMovement: "Likely to drop 3\u20135% in next 5 days",
  profitEstimate: 2450,
  riskFactors: [
    "Heavy monsoon rains may delay procurement",
    "Government buffer stock release could lower prices",
    "Global wheat surplus trends",
  ],
  suggestedNextAction: "Sell 80% of stock at Karnal Mandi within 2 days",
  netGainPerQuintal: 25,
  sellWithinDays: 2,
  suggestedMandi: "Karnal APMC Mandi",
  generatedAt: today,
};

// ---------------------------------------------------------------------------
// Mock AI recommendation (legacy format for existing components)
// ---------------------------------------------------------------------------

export const MOCK_AI_RECOMMENDATION = {
  type: "sell_now" as const,
  commodity: "Wheat",
  confidence: 91,
  headline: "Sell Now \u2014 30-Day Price Peak",
  rationale:
    "Karnal Mandi wheat prices are at a 30-day peak of \u20B92,275/qtl. Expected high arrivals over the next 3\u20134 days may compress prices by 3\u20135%. Festival procurement demand is currently supporting prices \u2014 ideal window to sell.",
  net_gain_per_quintal: undefined,
  suggested_mandi: undefined,
  sell_within_days: 2,
  generated_at: today,
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
        "Current price \u20B92,275/qnt is 1.1% above MSP (\u20B92,250/qnt). Good time to sell.",
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
  generated_at: today,
};

// ---------------------------------------------------------------------------
// Mock price comparisons (mandi comparison)
// ---------------------------------------------------------------------------

export const MOCK_MANDI_COMPARISONS: MandiComparison[] = [
  {
    mandiName: "Karnal APMC Mandi",
    district: "Karnal",
    state: "Haryana",
    pricePerQuintal: 2275,
    transportCostEstimate: 120,
    netExpectedEarnings: 2155,
    travelDistanceKm: 8,
    sellingRecommendation: "best",
    profitRank: 1,
    changePercent: 2.02,
    isRise: true,
  },
  {
    mandiName: "Sonipat Mandi",
    district: "Sonipat",
    state: "Haryana",
    pricePerQuintal: 2260,
    transportCostEstimate: 180,
    netExpectedEarnings: 2080,
    travelDistanceKm: 22,
    sellingRecommendation: "good",
    profitRank: 2,
    changePercent: 1.34,
    isRise: true,
  },
  {
    mandiName: "Panipat Mandi",
    district: "Panipat",
    state: "Haryana",
    pricePerQuintal: 2245,
    transportCostEstimate: 250,
    netExpectedEarnings: 1995,
    travelDistanceKm: 38,
    sellingRecommendation: "good",
    profitRank: 3,
    changePercent: -0.66,
    isRise: false,
  },
  {
    mandiName: "Indore APMC",
    district: "Indore",
    state: "Madhya Pradesh",
    pricePerQuintal: 2310,
    transportCostEstimate: 520,
    netExpectedEarnings: 1790,
    travelDistanceKm: 145,
    sellingRecommendation: "avoid",
    profitRank: 4,
    changePercent: 2.44,
    isRise: true,
  },
  {
    mandiName: "Jaipur Mandi",
    district: "Jaipur",
    state: "Rajasthan",
    pricePerQuintal: 2235,
    transportCostEstimate: 380,
    netExpectedEarnings: 1855,
    travelDistanceKm: 95,
    sellingRecommendation: "avoid",
    profitRank: 5,
    changePercent: -0.45,
    isRise: false,
  },
];

// ---------------------------------------------------------------------------
// Mock AI Insights
// ---------------------------------------------------------------------------

export const MOCK_AI_INSIGHTS: AIInsight[] = [
  {
    id: "1",
    category: "market_summary",
    title: "Wheat Prices Holding Strong",
    summary:
      "Wheat is trading at \u20B92,275/qtl in Karnal, up 2% this week. Strong procurement activity from FCI and state agencies is supporting current price levels.",
    details:
      "Current prices are well above MSP (\u20B92,250). Arrivals have been moderate at 12,500 quintals in Karnal APMC. Export demand from Bangladesh and Nepal is expected to remain firm through the month.",
    impact: "positive",
    relevantCommodities: ["Wheat"],
    generatedAt: today,
  },
  {
    id: "2",
    category: "demand_analysis",
    title: "Festival Season Boosting Demand",
    summary:
      "Rabi crop demand peaking ahead of Diwali procurement cycles. Urban consumption rising.",
    details:
      "Wholesale mandis are seeing 15% higher buyer footfall compared to last month. Flour mills are actively stocking wheat and maida inventory for the festive season.",
    impact: "positive",
    relevantCommodities: ["Wheat", "Paddy"],
    generatedAt: today,
  },
  {
    id: "3",
    category: "supply_analysis",
    title: "High Arrivals Expected Next Week",
    summary:
      "Weather clearing up will bring 20% more arrivals at major mandis starting Monday.",
    details:
      "Farmers who held back stock during the rain are expected to bring produce to market. This could temporarily lower prices by 3\u20135%. Consider selling before the arrival surge.",
    impact: "negative",
    relevantCommodities: ["Wheat", "Mustard"],
    generatedAt: today,
  },
  {
    id: "4",
    category: "export_opportunities",
    title: "Bangladesh Wheat Inquiry",
    summary:
      "Bangladesh government issued tender for 50,000 tonnes of wheat. Indian exporters are competitive.",
    details:
      "If Indian mills win the tender, domestic prices could rise \u20B915\u201320/qtl. Watch for tenders closing on Friday.",
    impact: "positive",
    relevantCommodities: ["Wheat"],
    generatedAt: today,
  },
  {
    id: "5",
    category: "government_procurement",
    title: "FCI Procurement Active in Haryana",
    summary:
      "FCI and Haryana state agencies are procuring wheat at MSP + \u20B950/qtl bonus.",
    details:
      "Over 2.5 lakh tonnes procured this week across Haryana. Farmers with e-NAM registration can book slots for MSP procurement.",
    impact: "positive",
    relevantCommodities: ["Wheat"],
    generatedAt: today,
  },
  {
    id: "6",
    category: "weather_impact",
    title: "Monsoon Rain May Delay Harvest",
    summary:
      "IMD forecasts heavy rain in Punjab and Haryana over the next 3 days. Harvesting delays possible.",
    details:
      "Rains can damage standing crops and delay arrivals. Farmers should plan to harvest before Thursday if possible. Post-rain arrivals may be of lower quality.",
    impact: "negative",
    relevantCommodities: ["Wheat", "Mustard", "Paddy"],
    generatedAt: today,
  },
  {
    id: "7",
    category: "festival_impact",
    title: "Diwali Festival Demand Spike",
    summary:
      "Sweet and snack industry increasing wheat flour orders by 25% ahead of Diwali.",
    details:
      "Major flour mills in North India are running at 90% capacity. This sustained demand will support wheat prices through November.",
    impact: "positive",
    relevantCommodities: ["Wheat", "Maize"],
    generatedAt: today,
  },
  {
    id: "8",
    category: "future_forecast",
    title: "7-Day Price Forecast: \u20B92,240\u20132,290/qtl",
    summary: "Expected price range for wheat at Karnal over the next week.",
    details:
      "Prices likely to peak at \u20B92,290 on Tuesday as pre-rain buying intensifies, then drop to \u20B92,240 by Friday as new arrivals flood the market.",
    impact: "neutral",
    relevantCommodities: ["Wheat"],
    generatedAt: today,
  },
];

// ---------------------------------------------------------------------------
// Mock Farmer Actions
// ---------------------------------------------------------------------------

export const MOCK_FARMER_ACTIONS = [
  {
    id: "sell",
    label: "Sell Crop",
    description: "Find the best mandi and price for your produce",
    icon: "\uD83D\uDCB0",
    href: "/market",
    variant: "primary" as const,
  },
  {
    id: "mandis",
    label: "Nearby Mandis",
    description: "View mandis within 50km with live prices",
    icon: "\uD83D\uDCCD",
    href: "/market",
    variant: "secondary" as const,
  },
  {
    id: "ask-ai",
    label: "Ask AI",
    description: "Get personalized market advice for your crops",
    icon: "\uD83E\uDDE0",
    href: "/advisor",
    variant: "secondary" as const,
  },
  {
    id: "report",
    label: "Download Report",
    description: "Export market data as PDF or Excel",
    icon: "\uD83D\uDCC4",
    variant: "ghost" as const,
  },
  {
    id: "share",
    label: "Share Prices",
    description: "Share today's prices with family and friends",
    icon: "\uD83D\uDCE4",
    variant: "ghost" as const,
  },
  {
    id: "save",
    label: "Save Commodity",
    description: "Add commodities to your watchlist",
    icon: "\u2B50",
    variant: "ghost" as const,
  },
];

// ---------------------------------------------------------------------------
// Mock Enhanced Trend Data (multi-series)
// ---------------------------------------------------------------------------

export const MOCK_ENHANCED_TREND_DATA = {
  commodity: "Wheat",
  timeframe: "30d" as const,
  dates: Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 29 + i);
    return d.toISOString().split("T")[0] ?? "";
  }),
  prices: Array.from(
    { length: 30 },
    (_, i) => 2200 + Math.round(Math.sin(i / 5) * 50 + i * 2),
  ),
  historicalAvg: Array.from(
    { length: 30 },
    (_, i) => 2180 + Math.round(Math.sin(i / 5) * 30 + i * 1.5),
  ),
  demandTrend: Array.from(
    { length: 30 },
    (_, i) => 60 + Math.round(Math.sin(i / 4) * 15),
  ),
  supplyTrend: Array.from(
    { length: 30 },
    (_, i) => 55 + Math.round(Math.cos(i / 4) * 12),
  ),
  forecastedPrice: Array.from(
    { length: 30 },
    (_, i) => 2200 + Math.round(Math.sin(i / 5) * 50 + i * 2),
  ).concat(
    Array.from(
      { length: 7 },
      (_, i) => 2290 + Math.round(Math.sin((30 + i) / 5) * 40 - i * 6),
    ),
  ),
  direction: "rising" as const,
  avgPrice: 2275,
  minPrice: 2180,
  maxPrice: 2380,
};

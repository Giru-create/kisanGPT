// ─────────────────────────────────────────────────────────────────────────────
// advisor.constants.ts
// KisanGPT — AI Advisor feature constants and mock data
// ─────────────────────────────────────────────────────────────────────────────

import type {
  ChatMessage,
  ConversationHistoryItem,
  FarmContext,
  WeatherSummary,
  FarmAlert,
  MemorySummary,
  SavedRecommendation,
  ResponseCardData,
} from "../types/advisor.types";

// ---------------------------------------------------------------------------
// Farm Context
// ---------------------------------------------------------------------------

export const MOCK_FARM_CONTEXT: FarmContext = {
  farmName: "GreenValley Farm",
  location: "Indore, Madhya Pradesh",
  activeCrop: "Wheat (SH-12)",
  soilPH: "6.8",
  soilHealth: "Healthy",
};

// ---------------------------------------------------------------------------
// Weather Summary
// ---------------------------------------------------------------------------

export const MOCK_WEATHER_SUMMARY: WeatherSummary = {
  temperature: 28,
  condition: "Partly Cloudy",
  humidity: 65,
  advisory: "Good conditions for spraying. Wind speed is low.",
};

// ---------------------------------------------------------------------------
// Farm Alerts
// ---------------------------------------------------------------------------

export const MOCK_FARM_ALERTS: FarmAlert[] = [
  {
    id: "alert-1",
    title: "Yellow rust detected in nearby fields",
    type: "warning",
    timestamp: "2 hours ago",
  },
  {
    id: "alert-2",
    title: "Wheat prices up 3.2% today",
    type: "success",
    timestamp: "4 hours ago",
  },
  {
    id: "alert-3",
    title: "PM-KISAN deadline in 5 days",
    type: "info",
    timestamp: "1 day ago",
  },
];

// ---------------------------------------------------------------------------
// Memory Summary
// ---------------------------------------------------------------------------

export const MOCK_MEMORY_SUMMARY: MemorySummary = {
  totalInteractions: 47,
  topTopics: ["Wheat Disease", "Irrigation", "Market Prices"],
  lastInteraction: "Today at 10:42 AM",
};

// ---------------------------------------------------------------------------
// Saved Recommendations
// ---------------------------------------------------------------------------

export const MOCK_SAVED_RECOMMENDATIONS: SavedRecommendation[] = [
  {
    id: "rec-1",
    title: "Apply NPK fertilizer by Friday",
    category: "Fertilizer",
    savedAt: "Yesterday",
  },
  {
    id: "rec-2",
    title: "Spray fungicide for rust prevention",
    category: "Disease",
    savedAt: "2 days ago",
  },
  {
    id: "rec-3",
    title: "Check soil moisture before irrigation",
    category: "Irrigation",
    savedAt: "3 days ago",
  },
];

// ---------------------------------------------------------------------------
// Conversation History
// ---------------------------------------------------------------------------

export const MOCK_CONVERSATION_HISTORY: ConversationHistoryItem[] = [
  {
    id: "hist-1",
    title: "NPK Fertilizer ratios for Rabi",
    timestamp: "Yesterday",
    preview: "Recommended NPK 120:60:40 for optimal wheat growth...",
    unread: false,
  },
  {
    id: "hist-2",
    title: "Soybean irrigation schedule",
    timestamp: "2 days ago",
    preview: "Based on soil moisture data, irrigate every 5 days...",
    unread: false,
  },
  {
    id: "hist-3",
    title: "Govt. subsidy for solar pumps",
    timestamp: "Mar 12",
    preview: "PM-KUSUM scheme provides 60% subsidy...",
    unread: true,
  },
  {
    id: "hist-4",
    title: "Yellow rust treatment options",
    timestamp: "Mar 10",
    preview: "Propiconazole 25 EC at 1ml/L is effective...",
    unread: false,
  },
];

// ---------------------------------------------------------------------------
// Response Cards Mock Data
// ---------------------------------------------------------------------------

export const MOCK_WEATHER_CARD: WeatherCardData = {
  type: "weather",
  temperature: 28,
  condition: "Partly Cloudy",
  humidity: 65,
  windSpeed: 12,
  advisory: "Good conditions for spraying. Wind speed is low.",
  safeToSpray: true,
};

export const MOCK_MARKET_CARD: ResponseCardData = {
  type: "market",
  commodity: "Wheat",
  price: 2250,
  unit: "₹/quintal",
  market: "Indore Mandi",
  trend: "up",
  change: 3.2,
};

export const MOCK_DISEASE_CARD: ResponseCardData = {
  type: "disease",
  diseaseName: "Yellow Rust (Stripe Rust)",
  confidence: 87,
  severity: "medium",
  symptoms: [
    "Yellow streaks on leaves",
    "Powdery yellow spores",
    "Parallel stripe pattern",
  ],
  treatments: [
    "Propiconazole 25 EC at 1ml/L",
    "Tebuconazole 25.9% EC at 1.5ml/L",
    "Remove infected plant debris",
  ],
};

export const MOCK_GOVERNMENT_SCHEME_CARD: ResponseCardData = {
  type: "government_scheme",
  schemeName: "PM-KISAN Samman Nidhi",
  description:
    "Direct income support of ₹6,000 per year to farmer families through direct benefit transfer.",
  eligibility: "All farmer families with cultivable land",
  deadline: "July 31, 2026",
  link: "https://pmkisan.gov.in",
};

export const MOCK_CHECKLIST_CARD: ResponseCardData = {
  type: "checklist",
  title: "Rabi Season Preparation Checklist",
  items: [
    { id: "cl-1", text: "Test soil pH and nutrients", checked: true },
    {
      id: "cl-2",
      text: "Apply base fertilizer (FYM 10-12 t/ha)",
      checked: true,
    },
    { id: "cl-3", text: "Prepare seed bed", checked: false },
    { id: "cl-4", text: "Arrange certified seeds", checked: false },
    { id: "cl-5", text: "Check irrigation availability", checked: false },
  ],
};

export const MOCK_ACTION_PLAN_CARD: ResponseCardData = {
  type: "action_plan",
  title: "Disease Treatment Action Plan",
  steps: [
    {
      id: "ap-1",
      text: "Confirm disease identification with lab test",
      priority: "high",
    },
    {
      id: "ap-2",
      text: "Apply Propiconazole 25 EC within 24 hours",
      priority: "high",
    },
    {
      id: "ap-3",
      text: "Remove and destroy infected plant debris",
      priority: "medium",
    },
    {
      id: "ap-4",
      text: "Monitor adjacent fields for spread",
      priority: "medium",
    },
    {
      id: "ap-5",
      text: "Re-apply fungicide after 10 days if needed",
      priority: "low",
    },
  ],
};

export const MOCK_WARNING_CARD: ResponseCardData = {
  type: "warning",
  message:
    "High humidity conditions (85%+) are expected in the next 48 hours. This increases the risk of fungal diseases. Consider preventive spraying.",
  severity: "warning",
};

export const MOCK_NEXT_STEPS_CARD: ResponseCardData = {
  type: "next_steps",
  steps: [
    "Apply recommended fungicide within 24 hours",
    "Increase field monitoring frequency",
    "Check weather forecast before spraying",
    "Report to local agriculture officer if spread is rapid",
  ],
};

// ---------------------------------------------------------------------------
// Suggested Prompts
// ---------------------------------------------------------------------------

export const SUGGESTED_PROMPTS = [
  {
    id: "prompt-1",
    text: "My wheat leaves are turning yellow.",
    icon: "sprout",
    category: "disease",
  },
  {
    id: "prompt-2",
    text: "Should I irrigate today?",
    icon: "droplets",
    category: "irrigation",
  },
  {
    id: "prompt-3",
    text: "What fertilizer should I use?",
    icon: "leaf",
    category: "fertilizer",
  },
  {
    id: "prompt-4",
    text: "How much can I sell my crop for?",
    icon: "trending-up",
    category: "market",
  },
  {
    id: "prompt-5",
    text: "Which government scheme applies to me?",
    icon: "building",
    category: "government",
  },
  {
    id: "prompt-6",
    text: "Weather forecast for next 7 days",
    icon: "cloud-sun",
    category: "weather",
  },
];

export const MOCK_SUGGESTED_QUESTIONS: string[] = [
  "How to treat yellow rust?",
  "Weather forecast for next week",
  "Current wheat price in Indore Mandi",
];

// ---------------------------------------------------------------------------
// Initial Messages
// ---------------------------------------------------------------------------

export const MOCK_INITIAL_MESSAGES: ChatMessage[] = [];

// ---------------------------------------------------------------------------
// Streaming Response Mock
// ---------------------------------------------------------------------------

export const MOCK_STREAMING_RESPONSE = `Based on your query, here is the analysis:

**Key Findings:**
- Your soil moisture levels are optimal for the current growth stage
- Consider adjusting irrigation frequency based on upcoming weather patterns
- Current market prices suggest holding wheat for 2-3 more weeks

**Recommendations:**
1. Continue monitoring field conditions daily
2. Apply recommended fertilizer dosage within the next 48 hours
3. Check for any pest activity during early morning inspections`;

// ---------------------------------------------------------------------------
// Response Card Type (re-export for convenience)
// ---------------------------------------------------------------------------

type WeatherCardData = import("../types/advisor.types").WeatherCardData;

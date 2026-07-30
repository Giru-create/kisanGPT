// ─────────────────────────────────────────────────────────────────────────────
// advisor.constants.ts
// KisanGPT — AI Advisor feature constants and mock data
// ─────────────────────────────────────────────────────────────────────────────

import type {
  ChatMessage,
  ConversationHistoryItem,
  FarmContext,
} from "../types/advisor.types";

export const MOCK_FARM_CONTEXT: FarmContext = {
  farmName: "GreenValley Farm",
  location: "Indore, Madhya Pradesh",
  activeCrop: "Wheat (SH-12)",
  soilPH: "6.8",
  soilHealth: "Healthy",
};

export const MOCK_CONVERSATION_HISTORY: ConversationHistoryItem[] = [
  {
    id: "hist-1",
    title: "NPK Fertilizer ratios for Rabi",
    timestamp: "Yesterday",
  },
  {
    id: "hist-2",
    title: "Soybean irrigation schedule",
    timestamp: "2 days ago",
  },
  {
    id: "hist-3",
    title: "Govt. subsidy for solar pumps",
    timestamp: "Mar 12",
  },
];

export const MOCK_INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "msg-1",
    role: "user",
    content: "What are the early signs of yellow rust in wheat?",
    timestamp: "10:42 AM",
  },
  {
    id: "msg-2",
    role: "assistant",
    content: `Early detection of **Yellow Rust** (Stripe Rust) is critical as it can reduce yields by up to 40% if left untreated. Here are the primary early symptoms to monitor:

**Chlorotic Streaks:** Small, yellow or orange-yellow spots appearing in linear rows along the leaf veins.

**Uredinia Development:** As the infection progresses, these spots erupt into pustules (uredinia) that release powdery yellow spores.

**Linear Arrangement:** Unlike leaf rust, yellow rust pustules are strictly organized into distinct parallel stripes.

**Infection Sites:** Check the younger leaves first, particularly on the upper surface during cool, damp mornings.

Based on your current field location (Indore Block B), the recent 18°C temperature and high dew point provide ideal incubation conditions.`,
    timestamp: "10:42 AM",
    thinkingSteps: [
      {
        id: "think-1",
        text: "Analyzing recent humidity data in Indore region (85% avg past 4 days).",
      },
      {
        id: "think-2",
        text: 'Cross-referencing "Yellow Rust" (Puccinia striiformis) symptomatic database.',
      },
      {
        id: "think-3",
        text: "Identifying visual indicators: Uredinia arrangements and color codes (Vibrant Yellow vs. Orange).",
      },
    ],
    sources: [
      {
        id: "src-1",
        title: "ICAR Report 2024",
        tooltip:
          "Comprehensive study on rust resistance in HD-2967 wheat varieties.",
      },
      {
        id: "src-2",
        title: "Plant Pathology Journal",
        tooltip: "Research on stripe rust identification methods.",
      },
    ],
  },
];

export const MOCK_SUGGESTED_QUESTIONS: string[] = [
  "How to treat yellow rust?",
  "Weather forecast for next week",
  "Current wheat price in Indore Mandi",
];

// TODO: Replace with actual API response mock data
export const MOCK_STREAMING_RESPONSE = `Based on your query, here is the analysis:

**Key Findings:**
- Your soil moisture levels are optimal for the current growth stage
- Consider adjusting irrigation frequency based on upcoming weather patterns
- Current market prices suggest holding wheat for 2-3 more weeks

**Recommendations:**
1. Continue monitoring field conditions daily
2. Apply recommended fertilizer dosage within the next 48 hours
3. Check for any pest activity during early morning inspections`;

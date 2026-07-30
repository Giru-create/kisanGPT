// ─────────────────────────────────────────────────────────────────────────────
// advisorMock.ts
// KisanGPT — AI Advisor Mock Service
// Provides fallback data when backend endpoints are unavailable
// ─────────────────────────────────────────────────────────────────────────────

import type { ChatRequest, AgentResponse } from "../types/advisor.types";

const MOCK_RESPONSE = `Based on your query, here is the analysis:

**Key Findings:**
- Your soil moisture levels are optimal for the current growth stage
- Consider adjusting irrigation frequency based on upcoming weather patterns
- Current market prices suggest holding wheat for 2-3 more weeks

**Recommendations:**
1. Continue monitoring field conditions daily
2. Apply recommended fertilizer dosage within the next 48 hours
3. Check for any pest activity during early morning inspections`;

const mockDelay = (ms: number = 1500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const advisorMockService = {
  sendAgentMessage: async (request: ChatRequest): Promise<AgentResponse> => {
    void request;
    await mockDelay(1500);
    return {
      message: MOCK_RESPONSE,
      plannedTools: ["weather_check", "market_lookup"],
      toolResults: [],
    };
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// advisorService.ts
// KisanGPT — AI Advisor Unified Service Abstraction
// Decouples UI/hooks from backend API vs mock data sources
// ─────────────────────────────────────────────────────────────────────────────

import { advisorApi } from "./advisorApi";
import { advisorMockService } from "./advisorMock";
import type { ChatRequest, AgentResponse } from "../types/advisor.types";

export interface IAdvisorService {
  sendMessage: (request: ChatRequest) => Promise<AgentResponse>;
}

function isMockMode(): boolean {
  return (
    process.env.NEXT_PUBLIC_USE_MOCK_API === undefined ||
    process.env.NEXT_PUBLIC_USE_MOCK_API === "true"
  );
}

export const advisorService: IAdvisorService = {
  sendMessage: async (request) => {
    if (isMockMode()) return advisorMockService.sendAgentMessage(request);
    try {
      return await advisorApi.sendAgentMessage(request);
    } catch (err) {
      console.warn("Advisor API error, falling back to mock:", err);
      return advisorMockService.sendAgentMessage(request);
    }
  },
};

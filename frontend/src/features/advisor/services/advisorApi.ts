// ─────────────────────────────────────────────────────────────────────────────
// advisorApi.ts
// KisanGPT — AI Advisor API Client
// Maps frontend services to FastAPI /api/v1/agent and /api/v1/chat endpoints
// ─────────────────────────────────────────────────────────────────────────────

import { apiClient } from "@/lib/apiClient";
import type {
  ChatRequest,
  AgentResponse,
  ChatApiResponse,
} from "../types/advisor.types";

export const advisorApi = {
  sendAgentMessage: async (request: ChatRequest): Promise<AgentResponse> => {
    const response = await apiClient.post<{
      message: string;
      planned_tools: string[];
      tool_results: Record<string, unknown>[];
    }>("/agent/chat", {
      message: request.message,
      conversation_id: request.conversationId,
      city: request.city,
      lat: request.lat,
      lon: request.lon,
      commodity: request.commodity,
    });

    return {
      message: response.message,
      plannedTools: response.planned_tools,
      toolResults: response.tool_results,
    };
  },

  sendChatMessage: async (
    message: string,
    conversationId?: string,
  ): Promise<ChatApiResponse> => {
    const response = await apiClient.post<{
      content: string;
      conversation_id: string;
    }>("/chat", {
      message,
      conversation_id: conversationId,
    });

    return {
      content: response.content,
      conversationId: response.conversation_id,
    };
  },
};

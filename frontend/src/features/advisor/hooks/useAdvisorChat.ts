// ─────────────────────────────────────────────────────────────────────────────
// useAdvisorChat.ts
// KisanGPT — React Query mutation for sending chat messages
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useMutation } from "@tanstack/react-query";
import { advisorService } from "../services/advisorService";
import type { ChatRequest, AgentResponse } from "../types/advisor.types";

export function useAdvisorChatMutation() {
  return useMutation<AgentResponse, Error, ChatRequest>({
    mutationFn: (request) => advisorService.sendMessage(request),
    mutationKey: ["advisor", "chat"],
  });
}

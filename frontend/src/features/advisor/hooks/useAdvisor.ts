// ─────────────────────────────────────────────────────────────────────────────
// useAdvisor.ts
// KisanGPT — AI Advisor custom hook
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useCallback } from "react";
import { useAdvisorStore } from "../store/advisorStore";
import type { ChatMessage } from "../types/advisor.types";
import { MOCK_STREAMING_RESPONSE } from "../constants/advisor.constants";

export function useAdvisor() {
  const {
    status,
    messages,
    inputValue,
    setInput,
    addUserMessage,
    addAssistantMessage,
    setStatus,
    clearMessages,
  } = useAdvisorStore();

  const generateId = useCallback(() => {
    return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || status === "loading" || status === "streaming") {
        return;
      }

      // Add user message
      const userMessage: ChatMessage = {
        id: generateId(),
        role: "user",
        content: content.trim(),
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
      };
      addUserMessage(userMessage);
      setStatus("loading");

      // TODO: Replace with actual API call to backend
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setStatus("streaming");

      // Simulate streaming delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Add assistant response
      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: MOCK_STREAMING_RESPONSE,
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
        sources: [],
      };
      addAssistantMessage(assistantMessage);
    },
    [
      status,
      generateId,
      addUserMessage,
      addAssistantMessage,
      setStatus,
    ],
  );

  const handleSuggestionClick = useCallback(
    (question: string) => {
      setInput(question);
      sendMessage(question);
    },
    [setInput, sendMessage],
  );

  return {
    status,
    messages,
    inputValue,
    setInput,
    sendMessage,
    handleSuggestionClick,
    clearMessages,
  };
}

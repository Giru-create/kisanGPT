// ─────────────────────────────────────────────────────────────────────────────
// useAdvisor.ts
// KisanGPT — AI Advisor custom hook
// Orchestrates React Query mutation + Zustand store for chat
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useCallback } from "react";
import { useAdvisorStore } from "../store/advisorStore";
import { useAdvisorChatMutation } from "./useAdvisorChat";
import type { ChatMessage } from "../types/advisor.types";
import { announceToScreenReader } from "@/utils/a11y";

export function useAdvisor() {
  const {
    messages,
    inputValue,
    status,
    errorMessage,
    setInput,
    addUserMessage,
    addAssistantMessage,
    setStatus,
    setErrorMessage,
    clearMessages,
  } = useAdvisorStore();

  const mutation = useAdvisorChatMutation();

  const generateId = useCallback(() => {
    return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || status === "loading" || status === "streaming") {
        return;
      }

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
      announceToScreenReader("Sending message to AI Advisor");

      mutation.mutate(
        {
          message: content.trim(),
        },
        {
          onSuccess: (response) => {
            const assistantMessage: ChatMessage = {
              id: generateId(),
              role: "assistant",
              content: response.message,
              timestamp: new Date().toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              }),
              sources: [],
              thinkingSteps: response.plannedTools.map((tool, i) => ({
                id: `think-${i}`,
                text: `Tool used: ${tool}`,
              })),
            };
            addAssistantMessage(assistantMessage);
            setStatus("idle");
            announceToScreenReader("AI response received");
          },
          onError: (error) => {
            const message =
              error instanceof Error
                ? error.message
                : "Unable to get AI response. Please check your connection.";
            setErrorMessage(message);
            announceToScreenReader("Failed to get AI response");
          },
        },
      );
    },
    [
      status,
      generateId,
      addUserMessage,
      addAssistantMessage,
      setStatus,
      setErrorMessage,
      mutation,
    ],
  );

  const handleSuggestionClick = useCallback(
    (question: string) => {
      setInput(question);
      sendMessage(question);
    },
    [setInput, sendMessage],
  );

  const retry = useCallback(() => {
    const lastUserMessage = [...messages]
      .reverse()
      .find((m) => m.role === "user");
    if (lastUserMessage) {
      setErrorMessage(null);
      sendMessage(lastUserMessage.content);
    }
  }, [messages, setErrorMessage, sendMessage]);

  return {
    messages,
    inputValue,
    status,
    errorMessage,
    isPending: mutation.isPending,
    setInput,
    sendMessage,
    handleSuggestionClick,
    clearMessages,
    retry,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// advisorStore.ts
// KisanGPT — AI Advisor Zustand store
// Manages chat UI state: messages, input, conversation, loading, errors
// ─────────────────────────────────────────────────────────────────────────────

import { create } from "zustand";
import type { ChatMessage, AdvisorStatus } from "../types/advisor.types";
import { MOCK_INITIAL_MESSAGES } from "../constants/advisor.constants";

interface AdvisorStore {
  messages: ChatMessage[];
  inputValue: string;
  status: AdvisorStatus;
  conversationId: string | null;
  errorMessage: string | null;

  setInput: (value: string) => void;
  addUserMessage: (message: ChatMessage) => void;
  addAssistantMessage: (message: ChatMessage) => void;
  setStatus: (status: AdvisorStatus) => void;
  setConversationId: (id: string) => void;
  setErrorMessage: (message: string | null) => void;
  clearMessages: () => void;
  reset: () => void;
}

export const useAdvisorStore = create<AdvisorStore>((set) => ({
  messages: MOCK_INITIAL_MESSAGES,
  inputValue: "",
  status: "idle",
  conversationId: null,
  errorMessage: null,

  setInput: (value) => set({ inputValue: value }),

  addUserMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
      inputValue: "",
      errorMessage: null,
    })),

  addAssistantMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
      status: "idle",
      errorMessage: null,
    })),

  setStatus: (status) => set({ status }),

  setConversationId: (id) => set({ conversationId: id }),

  setErrorMessage: (message) => set({ errorMessage: message, status: "error" }),

  clearMessages: () =>
    set({
      messages: [],
      status: "idle",
      conversationId: null,
      errorMessage: null,
    }),

  reset: () =>
    set({
      messages: [],
      inputValue: "",
      status: "idle",
      conversationId: null,
      errorMessage: null,
    }),
}));

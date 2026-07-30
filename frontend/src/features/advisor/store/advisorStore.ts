// ─────────────────────────────────────────────────────────────────────────────
// advisorStore.ts
// KisanGPT — AI Advisor Zustand store
// ─────────────────────────────────────────────────────────────────────────────

import { create } from "zustand";
import type { AdvisorUIState, ChatMessage } from "../types/advisor.types";
import { MOCK_INITIAL_MESSAGES } from "../constants/advisor.constants";

interface AdvisorStore extends AdvisorUIState {
  setInput: (value: string) => void;
  addUserMessage: (message: ChatMessage) => void;
  addAssistantMessage: (message: ChatMessage) => void;
  setStatus: (status: AdvisorUIState["status"]) => void;
  clearMessages: () => void;
}

export const useAdvisorStore = create<AdvisorStore>((set) => ({
  status: "idle",
  messages: MOCK_INITIAL_MESSAGES,
  inputValue: "",

  setInput: (value) => set({ inputValue: value }),

  addUserMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
      inputValue: "",
    })),

  addAssistantMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
      status: "idle",
    })),

  setStatus: (status) => set({ status }),

  clearMessages: () => set({ messages: [], status: "idle" }),
}));

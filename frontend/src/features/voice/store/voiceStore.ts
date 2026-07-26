// ─────────────────────────────────────────────────────────────────────────────
// voiceStore.ts
// KisanGPT — Voice Assistant Zustand slice
// ─────────────────────────────────────────────────────────────────────────────

import { create } from "zustand";
import type {
  VoiceUIState,
  VoiceLanguage,
  VoiceMessage,
} from "../types/voice.types";

// ---------------------------------------------------------------------------
// Store shape
// ---------------------------------------------------------------------------

interface VoiceStore {
  /** UI state — drives recording / processing / speaking rendering */
  voiceState: VoiceUIState;

  /** Currently selected language */
  language: VoiceLanguage;

  /** Conversation messages */
  messages: VoiceMessage[];

  /** Active conversation ID */
  conversationId: string | null;

  // Actions
  setVoiceState: (state: VoiceUIState) => void;
  setLanguage: (language: VoiceLanguage) => void;
  addMessage: (message: VoiceMessage) => void;
  setConversationId: (id: string) => void;
  clearMessages: () => void;
  reset: () => void;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useVoiceStore = create<VoiceStore>((set) => ({
  voiceState: { status: "idle" },
  language: "hi-IN",
  messages: [],
  conversationId: null,

  setVoiceState: (voiceState) => set({ voiceState }),
  setLanguage: (language) => set({ language }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setConversationId: (conversationId) => set({ conversationId }),
  clearMessages: () => set({ messages: [], conversationId: null }),
  reset: () =>
    set({
      voiceState: { status: "idle" },
      messages: [],
      conversationId: null,
    }),
}));

// ---------------------------------------------------------------------------
// Selector helpers
// ---------------------------------------------------------------------------

export const selectVoiceState = (s: VoiceStore) => s.voiceState;
export const selectLanguage = (s: VoiceStore) => s.language;
export const selectMessages = (s: VoiceStore) => s.messages;
export const selectConversationId = (s: VoiceStore) => s.conversationId;

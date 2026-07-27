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

interface VoiceStore {
  /** UI state — drives recording / processing / speaking / error state rendering */
  voiceState: VoiceUIState;

  /** Currently selected language */
  language: VoiceLanguage;

  /** Conversation message history */
  messages: VoiceMessage[];

  /** Active conversation ID */
  conversationId: string | null;

  /** State of floating voice bar widget */
  isFloatingOpen: boolean;

  // Actions
  setVoiceState: (state: VoiceUIState) => void;
  setLanguage: (language: VoiceLanguage) => void;
  addMessage: (message: VoiceMessage) => void;
  setMessages: (messages: VoiceMessage[]) => void;
  setConversationId: (id: string | null) => void;
  setFloatingOpen: (open: boolean) => void;
  clearMessages: () => void;
  reset: () => void;
}

export const useVoiceStore = create<VoiceStore>((set) => ({
  voiceState: { status: "idle" },
  language: "hi-IN",
  messages: [],
  conversationId: null,
  isFloatingOpen: false,

  setVoiceState: (voiceState) => set({ voiceState }),
  setLanguage: (language) => set({ language }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setMessages: (messages) => set({ messages }),
  setConversationId: (conversationId) => set({ conversationId }),
  setFloatingOpen: (isFloatingOpen) => set({ isFloatingOpen }),
  clearMessages: () => set({ messages: [], conversationId: null }),
  reset: () =>
    set({
      voiceState: { status: "idle" },
      messages: [],
      conversationId: null,
      isFloatingOpen: false,
    }),
}));

// Selectors
export const selectVoiceState = (s: VoiceStore) => s.voiceState;
export const selectLanguage = (s: VoiceStore) => s.language;
export const selectMessages = (s: VoiceStore) => s.messages;
export const selectConversationId = (s: VoiceStore) => s.conversationId;
export const selectIsFloatingOpen = (s: VoiceStore) => s.isFloatingOpen;

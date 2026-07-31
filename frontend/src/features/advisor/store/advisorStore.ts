// ─────────────────────────────────────────────────────────────────────────────
// advisorStore.ts
// KisanGPT — AI Advisor Zustand store
// Manages chat UI state: messages, input, conversation, loading, errors, voice, image
// ─────────────────────────────────────────────────────────────────────────────

import { create } from "zustand";
import type {
  ChatMessage,
  AdvisorStatus,
  VoiceStatus,
  ImageUploadStatus,
  ConversationHistoryItem,
} from "../types/advisor.types";
import { MOCK_INITIAL_MESSAGES } from "../constants/advisor.constants";

interface AdvisorStore {
  messages: ChatMessage[];
  inputValue: string;
  status: AdvisorStatus;
  conversationId: string | null;
  conversationTitle: string;
  errorMessage: string | null;

  // Voice state
  voiceStatus: VoiceStatus;
  voiceVolume: number;
  voiceTranscript: string;
  voiceError: string | null;

  // Image upload state
  imageUploadStatus: ImageUploadStatus;
  imageFile: File | null;
  imagePreview: string | null;
  imageProgress: number;
  imageError: string | null;

  // UI state
  showRightPanel: boolean;
  conversations: ConversationHistoryItem[];

  // Actions
  setInput: (value: string) => void;
  addUserMessage: (message: ChatMessage) => void;
  addAssistantMessage: (message: ChatMessage) => void;
  updateAssistantMessage: (id: string, content: string) => void;
  setStatus: (status: AdvisorStatus) => void;
  setConversationId: (id: string) => void;
  setConversationTitle: (title: string) => void;
  setErrorMessage: (message: string | null) => void;
  clearMessages: () => void;
  reset: () => void;

  // Voice actions
  setVoiceStatus: (status: VoiceStatus) => void;
  setVoiceVolume: (volume: number) => void;
  setVoiceTranscript: (transcript: string) => void;
  setVoiceError: (error: string | null) => void;
  resetVoice: () => void;

  // Image actions
  setImageUploadStatus: (status: ImageUploadStatus) => void;
  setImageFile: (file: File | null) => void;
  setImagePreview: (preview: string | null) => void;
  setImageProgress: (progress: number) => void;
  setImageError: (error: string | null) => void;
  resetImageUpload: () => void;

  // UI actions
  toggleRightPanel: () => void;
  setShowRightPanel: (show: boolean) => void;
  setConversations: (conversations: ConversationHistoryItem[]) => void;
  startNewConversation: () => void;
}

export const useAdvisorStore = create<AdvisorStore>((set) => ({
  messages: MOCK_INITIAL_MESSAGES,
  inputValue: "",
  status: "idle",
  conversationId: null,
  conversationTitle: "New Conversation",
  errorMessage: null,

  voiceStatus: "idle",
  voiceVolume: 0,
  voiceTranscript: "",
  voiceError: null,

  imageUploadStatus: "idle",
  imageFile: null,
  imagePreview: null,
  imageProgress: 0,
  imageError: null,

  showRightPanel: true,
  conversations: [],

  setInput: (value) => set({ inputValue: value }),

  addUserMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
      inputValue: "",
      errorMessage: null,
      imageFile: null,
      imagePreview: null,
      imageUploadStatus: "idle",
    })),

  addAssistantMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
      status: "idle",
      errorMessage: null,
    })),

  updateAssistantMessage: (id, content) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, content } : msg,
      ),
    })),

  setStatus: (status) => set({ status }),

  setConversationId: (id) => set({ conversationId: id }),

  setConversationTitle: (title) => set({ conversationTitle: title }),

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
      conversationTitle: "New Conversation",
      errorMessage: null,
      voiceStatus: "idle",
      voiceVolume: 0,
      voiceTranscript: "",
      voiceError: null,
      imageUploadStatus: "idle",
      imageFile: null,
      imagePreview: null,
      imageProgress: 0,
      imageError: null,
    }),

  setVoiceStatus: (status) => set({ voiceStatus: status }),
  setVoiceVolume: (volume) => set({ voiceVolume: volume }),
  setVoiceTranscript: (transcript) => set({ voiceTranscript: transcript }),
  setVoiceError: (error) => set({ voiceError: error }),
  resetVoice: () =>
    set({
      voiceStatus: "idle",
      voiceVolume: 0,
      voiceTranscript: "",
      voiceError: null,
    }),

  setImageUploadStatus: (status) => set({ imageUploadStatus: status }),
  setImageFile: (file) => set({ imageFile: file }),
  setImagePreview: (preview) => set({ imagePreview: preview }),
  setImageProgress: (progress) => set({ imageProgress: progress }),
  setImageError: (error) => set({ imageError: error }),
  resetImageUpload: () =>
    set({
      imageUploadStatus: "idle",
      imageFile: null,
      imagePreview: null,
      imageProgress: 0,
      imageError: null,
    }),

  toggleRightPanel: () =>
    set((state) => ({ showRightPanel: !state.showRightPanel })),
  setShowRightPanel: (show) => set({ showRightPanel: show }),
  setConversations: (conversations) => set({ conversations }),
  startNewConversation: () =>
    set({
      messages: [],
      conversationId: null,
      conversationTitle: "New Conversation",
      status: "idle",
      errorMessage: null,
    }),
}));

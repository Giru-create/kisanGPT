// ─────────────────────────────────────────────────────────────────────────────
// voiceApi.ts
// KisanGPT — Voice Assistant API Client
// Maps frontend service calls to FastAPI /api/v1/voice REST endpoints
// ─────────────────────────────────────────────────────────────────────────────

import { apiClient } from "@/lib/apiClient";
import type {
  STTResult,
  TTSResult,
  VoiceChatResult,
  VoiceCommandResult,
} from "../types/voice.types";

export const voiceApi = {
  speechToText: async (
    audioBlob: Blob,
    language: string = "hi-IN",
  ): Promise<STTResult> => {
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.webm");
    formData.append("language", language);

    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api/v1";
    const response = await fetch(`${BASE_URL}/voice/stt`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Speech to text failed with status ${response.status}`);
    }

    return response.json();
  },

  textToSpeech: async (
    text: string,
    language: string = "hi-IN",
    voice?: string,
  ): Promise<TTSResult> => {
    return apiClient.post<TTSResult>("/voice/tts", {
      text,
      language,
      voice,
    });
  },

  voiceChat: async (
    text: string,
    language: string = "hi-IN",
    conversationId?: string | null,
  ): Promise<VoiceChatResult> => {
    return apiClient.post<VoiceChatResult>("/voice/chat", {
      text,
      language,
      conversation_id: conversationId,
    });
  },

  processCommand: async (
    text: string,
    language: string = "hi-IN",
  ): Promise<VoiceCommandResult> => {
    return apiClient.post<VoiceCommandResult>("/voice/command", {
      text,
      language,
    });
  },

  createSession: async (language: string = "hi-IN"): Promise<{ session_id: string }> => {
    return apiClient.post<{ session_id: string }>("/voice/session", null, {
      params: { language },
    });
  },

  endSession: async (sessionId: string): Promise<{ detail: string }> => {
    return apiClient.delete<{ detail: string }>(`/voice/session/${sessionId}`);
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// voiceService.ts
// KisanGPT — Voice Assistant Service Abstraction
// Decouples Voice UI/Hooks from backend REST vs mock fallback
// ─────────────────────────────────────────────────────────────────────────────

import { voiceApi } from "./voiceApi";
import { voiceMockService } from "./voiceMock";
import type {
  STTResult,
  TTSResult,
  VoiceChatResult,
  VoiceCommandResult,
} from "../types/voice.types";

export interface IVoiceService {
  speechToText: (audioBlob: Blob, language?: string) => Promise<STTResult>;
  textToSpeech: (
    text: string,
    language?: string,
    voice?: string,
  ) => Promise<TTSResult>;
  voiceChat: (
    text: string,
    language?: string,
    conversationId?: string | null,
  ) => Promise<VoiceChatResult>;
  processCommand: (
    text: string,
    language?: string,
  ) => Promise<VoiceCommandResult>;
  createSession: (language?: string) => Promise<{ session_id: string }>;
  endSession: (sessionId: string) => Promise<{ detail: string }>;
}

const isMockMode =
  process.env.NEXT_PUBLIC_USE_MOCK_API === undefined ||
  process.env.NEXT_PUBLIC_USE_MOCK_API === "true";

export const voiceService: IVoiceService = {
  speechToText: async (audioBlob, language = "hi-IN") => {
    if (isMockMode) return voiceMockService.speechToText(audioBlob, language);
    try {
      return await voiceApi.speechToText(audioBlob, language);
    } catch (err) {
      console.warn("Voice STT API error, falling back to mock:", err);
      return voiceMockService.speechToText(audioBlob, language);
    }
  },

  textToSpeech: async (text, language = "hi-IN", voice) => {
    if (isMockMode) return voiceMockService.textToSpeech(text, language);
    try {
      return await voiceApi.textToSpeech(text, language, voice);
    } catch (err) {
      console.warn("Voice TTS API error, falling back to mock:", err);
      return voiceMockService.textToSpeech(text, language);
    }
  },

  voiceChat: async (text, language = "hi-IN", conversationId) => {
    if (isMockMode)
      return voiceMockService.voiceChat(text, language, conversationId);
    try {
      return await voiceApi.voiceChat(text, language, conversationId);
    } catch (err) {
      console.warn("Voice Chat API error, falling back to mock:", err);
      return voiceMockService.voiceChat(text, language, conversationId);
    }
  },

  processCommand: async (text, language = "hi-IN") => {
    if (isMockMode) return voiceMockService.processCommand(text, language);
    try {
      return await voiceApi.processCommand(text, language);
    } catch (err) {
      console.warn("Voice Command API error, falling back to mock:", err);
      return voiceMockService.processCommand(text, language);
    }
  },

  createSession: async (language = "hi-IN") => {
    if (isMockMode) return voiceMockService.createSession(language);
    try {
      return await voiceApi.createSession(language);
    } catch (err) {
      console.warn("Voice Session API error, falling back to mock:", err);
      return voiceMockService.createSession(language);
    }
  },

  endSession: async (sessionId) => {
    if (isMockMode) return voiceMockService.endSession(sessionId);
    try {
      return await voiceApi.endSession(sessionId);
    } catch (err) {
      console.warn("Voice EndSession API error, falling back to mock:", err);
      return voiceMockService.endSession(sessionId);
    }
  },
};

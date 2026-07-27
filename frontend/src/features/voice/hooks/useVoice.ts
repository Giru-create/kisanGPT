// ─────────────────────────────────────────────────────────────────────────────
// useVoice.ts
// KisanGPT — Master Voice Assistant Hook
// Wires Zustand store, Web Audio recording, voiceService API, and a11y live regions
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useCallback } from "react";
import {
  useVoiceStore,
  selectVoiceState,
  selectLanguage,
  selectMessages,
  selectConversationId,
  selectIsFloatingOpen,
} from "../store/voiceStore";
import { useAudioRecorder } from "./useAudioRecorder";
import { useAudioPlayer } from "./useAudioPlayer";
import { voiceService } from "../services/voiceService";
import { STATUS_LABELS } from "../constants/voice.constants";
import type { VoiceLanguage, VoiceMessage } from "../types/voice.types";
import { announceToScreenReader } from "@/utils/a11y";

export function useVoice() {
  const voiceState = useVoiceStore(selectVoiceState);
  const language = useVoiceStore(selectLanguage);
  const messages = useVoiceStore(selectMessages);
  const conversationId = useVoiceStore(selectConversationId);
  const isFloatingOpen = useVoiceStore(selectIsFloatingOpen);

  const {
    setVoiceState,
    setLanguage: storeSetLanguage,
    addMessage,
    setConversationId,
    setFloatingOpen,
    clearMessages,
  } = useVoiceStore();

  const {
    isRecording,
    volumeLevel,
    permissionDenied,
    startRecording,
    stopRecording,
  } = useAudioRecorder();

  const { isPlaying, currentTime, duration, playbackRate, playAudio, togglePlayPause, changeSpeed } =
    useAudioPlayer();

  const setLanguage = useCallback(
    (lang: VoiceLanguage) => {
      storeSetLanguage(lang);
      const labels = STATUS_LABELS[lang] || STATUS_LABELS["hi-IN"];
      announceToScreenReader(`Language changed to ${lang === "hi-IN" ? "Hindi" : lang === "pa-IN" ? "Punjabi" : "English"}`);
    },
    [storeSetLanguage],
  );

  const handleStartListening = useCallback(async () => {
    const success = await startRecording();
    if (success) {
      setVoiceState({ status: "listening", volumeLevel: 0.5 });
      announceToScreenReader(STATUS_LABELS[language]?.listening || "Listening... Speak now");
    } else {
      setVoiceState({
        status: "error",
        code: "PERMISSION_DENIED",
        message: "Microphone access denied. Please grant permission in browser settings.",
      });
      announceToScreenReader("Microphone permission denied.");
    }
  }, [startRecording, setVoiceState, language]);

  const handleStopListening = useCallback(async () => {
    setVoiceState({ status: "processing" });
    announceToScreenReader(STATUS_LABELS[language]?.processing || "Analyzing query...");

    try {
      const blob = await stopRecording();

      if (!blob || blob.size === 0) {
        setVoiceState({
          status: "error",
          code: "NO_SPEECH",
          message: "No speech detected. Please try speaking again.",
        });
        announceToScreenReader("No speech detected.");
        return;
      }

      // Step 1: STT
      const stt = await voiceService.speechToText(blob, language);

      const userMsg: VoiceMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        text: stt.text,
        timestamp: new Date(),
      };
      addMessage(userMsg);

      // Step 2: Chat AI Query
      const chatResult = await voiceService.voiceChat(
        stt.text,
        language,
        conversationId,
      );

      if (chatResult.conversation_id) {
        setConversationId(chatResult.conversation_id);
      }

      const assistantMsg: VoiceMessage = {
        id: `asst-${Date.now()}`,
        role: "assistant",
        text: chatResult.response_text,
        timestamp: new Date(),
        audio_base64: chatResult.audio_base64 || undefined,
      };
      addMessage(assistantMsg);

      // Step 3: Speak Response if audio available
      if (chatResult.audio_base64) {
        setVoiceState({
          status: "speaking",
          audioBase64: chatResult.audio_base64,
          mimeType: chatResult.mime_type,
        });
        playAudio(chatResult.audio_base64, chatResult.mime_type);
        announceToScreenReader(STATUS_LABELS[language]?.speaking || "KisanGPT is responding.");
      } else {
        setVoiceState({ status: "idle" });
      }
    } catch (err) {
      console.error("Voice pipeline error:", err);
      setVoiceState({
        status: "error",
        code: "NETWORK_ERROR",
        message: "Unable to process voice request. Please try again.",
      });
      announceToScreenReader("Error processing voice request.");
    }
  }, [
    stopRecording,
    language,
    conversationId,
    setVoiceState,
    addMessage,
    setConversationId,
    playAudio,
  ]);

  const sendTextQuery = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      const userMsg: VoiceMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        text,
        timestamp: new Date(),
      };
      addMessage(userMsg);

      setVoiceState({ status: "processing" });
      announceToScreenReader("Processing question...");

      try {
        const chatResult = await voiceService.voiceChat(
          text,
          language,
          conversationId,
        );

        if (chatResult.conversation_id) {
          setConversationId(chatResult.conversation_id);
        }

        const assistantMsg: VoiceMessage = {
          id: `asst-${Date.now()}`,
          role: "assistant",
          text: chatResult.response_text,
          timestamp: new Date(),
          audio_base64: chatResult.audio_base64 || undefined,
        };
        addMessage(assistantMsg);

        setVoiceState({ status: "idle" });
      } catch (err) {
        setVoiceState({
          status: "error",
          code: "NETWORK_ERROR",
          message: "Failed to load response.",
        });
      }
    },
    [addMessage, setVoiceState, language, conversationId, setConversationId],
  );

  return {
    voiceState,
    language,
    messages,
    conversationId,
    isFloatingOpen,
    isRecording,
    volumeLevel,
    permissionDenied,
    isPlaying,
    currentTime,
    duration,
    playbackRate,
    setLanguage,
    setFloatingOpen,
    handleStartListening,
    handleStopListening,
    sendTextQuery,
    playAudio,
    togglePlayPause,
    changeSpeed,
    clearMessages,
  };
}

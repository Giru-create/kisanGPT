// ─────────────────────────────────────────────────────────────────────────────
// useVoice.ts
// KisanGPT — Voice Assistant hook
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useCallback, useRef } from "react";
import {
  useVoiceStore,
  selectVoiceState,
  selectLanguage,
  selectMessages,
  selectConversationId,
} from "../store/voiceStore";
import { MOCK_VOICE_MESSAGES } from "../constants/voice.constants";
import type { VoiceMessage } from "../types/voice.types";

// ---------------------------------------------------------------------------
// Simulated fetch — replace with real API calls in a later milestone
// ---------------------------------------------------------------------------

async function sendVoiceText(
  text: string,
  language: string,
): Promise<{ response_text: string; audio_base64: string | null }> {
  await new Promise((resolve) => setTimeout(resolve, 1200));

  // TODO: Use language parameter when implementing real API
  void language;

  const responses: Record<string, string> = {
    disease_detection:
      "Please take a photo of your crop leaf using the Disease Detection feature, and I will analyze it.",
    weather_query:
      "Let me check the weather for your area. Please share your location or district name.",
    market_price:
      "Which commodity would you like to check the price for? You can say Wheat, Mustard, Paddy, or others.",
    msp_query:
      "The current MSP for Wheat is ₹2,250 per quintal and for Mustard is ₹5,500 per quintal.",
    irrigation_advice:
      "For irrigation advice, I recommend checking the Weather Intelligence page for the best irrigation windows.",
    govt_scheme:
      "You can check available government schemes on the Dashboard. PM-KISAN offers ₹6,000 per year.",
    help: "I can help you with: crop diseases, weather, market prices, irrigation, and government schemes. What would you like to know?",
    general_query:
      "I am not sure I understand. You can ask about crop diseases, weather, market prices, irrigation, or government schemes.",
  };

  const text_lower = text.toLowerCase();
  let intent = "general_query";

  const intentKeywords: Record<string, string[]> = {
    disease_detection: ["disease", "bimari", "rog", "leaf", "yellow", "pest"],
    weather_query: ["weather", "mausam", "rain", "temperature", "cold", "heat"],
    market_price: ["price", "daam", "mandi", "market", "sell", "rate"],
    msp_query: ["msp", "samarthan", "minimum support"],
    irrigation_advice: ["irrigation", "sinchai", "water", "drip"],
    govt_scheme: ["scheme", "yojana", "government", "subsidy"],
    help: ["help", "madad", "what", "how"],
  };

  for (const [key, words] of Object.entries(intentKeywords)) {
    if (words.some((w) => text_lower.includes(w))) {
      intent = key;
      break;
    }
  }

  return {
    response_text: (responses[intent] ?? responses.general_query) as string,
    audio_base64: null,
  };
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useVoice() {
  const voiceState = useVoiceStore(selectVoiceState);
  const language = useVoiceStore(selectLanguage);
  const messages = useVoiceStore(selectMessages);
  const conversationId = useVoiceStore(selectConversationId);

  const { setVoiceState, setLanguage, addMessage, setConversationId } =
    useVoiceStore();

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startListening = useCallback(async () => {
    setVoiceState({ status: "listening" });

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
    } catch {
      setVoiceState({
        status: "error",
        message:
          "Microphone access denied. Please allow microphone access in your browser settings.",
      });
    }
  }, [setVoiceState]);

  const stopListening = useCallback(async () => {
    const mediaRecorder = mediaRecorderRef.current;
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
    }

    setVoiceState({ status: "processing" });

    const userMessage: VoiceMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      text: "Voice message",
      timestamp: new Date(),
    };
    addMessage(userMessage);

    try {
      const result = await sendVoiceText("voice message", language);

      const assistantMessage: VoiceMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        text: result.response_text,
        timestamp: new Date(),
        audio_base64: result.audio_base64 ?? undefined,
      };
      addMessage(assistantMessage);

      if (!conversationId) {
        setConversationId(`conv-${Date.now()}`);
      }

      setVoiceState({ status: "idle" });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to process voice. Please try again.";
      setVoiceState({ status: "error", message });
    }
  }, [language, conversationId, setVoiceState, addMessage, setConversationId]);

  const sendText = useCallback(
    async (text: string) => {
      const userMessage: VoiceMessage = {
        id: `msg-${Date.now()}`,
        role: "user",
        text,
        timestamp: new Date(),
      };
      addMessage(userMessage);

      setVoiceState({ status: "processing" });

      try {
        const result = await sendVoiceText(text, language);

        const assistantMessage: VoiceMessage = {
          id: `msg-${Date.now() + 1}`,
          role: "assistant",
          text: result.response_text,
          timestamp: new Date(),
          audio_base64: result.audio_base64 ?? undefined,
        };
        addMessage(assistantMessage);

        if (!conversationId) {
          setConversationId(`conv-${Date.now()}`);
        }

        setVoiceState({ status: "idle" });
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Unable to process message. Please try again.";
        setVoiceState({ status: "error", message });
      }
    },
    [language, conversationId, setVoiceState, addMessage, setConversationId],
  );

  const loadDemo = useCallback(() => {
    MOCK_VOICE_MESSAGES.forEach((msg) => addMessage(msg));
  }, [addMessage]);

  return {
    voiceState,
    language,
    messages,
    conversationId,
    setLanguage,
    startListening,
    stopListening,
    sendText,
    loadDemo,
  };
}

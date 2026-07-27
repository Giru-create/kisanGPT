// ─────────────────────────────────────────────────────────────────────────────
// voiceMock.ts
// KisanGPT — Voice Assistant Mock Service Fallback
// Provides offline demo responses in Hindi, Punjabi, and English
// ─────────────────────────────────────────────────────────────────────────────

import type {
  STTResult,
  TTSResult,
  VoiceChatResult,
  VoiceCommandResult,
  VoiceLanguage,
} from "../types/voice.types";

const mockDelay = (ms: number = 800) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const LOCALIZED_RESPONSES: Record<
  VoiceLanguage,
  { defaultResponse: string; intent: string; suggested: string[] }
> = {
  "hi-IN": {
    defaultResponse:
      "आज करनाल मंडी में गेहूं (PBW 550) का भाव ₹2,275 प्रति क्विंटल है, जो MSP (₹2,250) से अधिक है। आने वाले 2-3 दिनों में मांग अच्छी रहने की संभावना है।",
    intent: "market_price",
    suggested: ["भाव अलर्ट सेट करें", "मौसम का पूर्वानुमान देखें", "फसल डॉक्टर से बात करें"],
  },
  "pa-IN": {
    defaultResponse:
      "ਅੱਜ ਕਰਨਾਲ ਮੰਡੀ ਵਿੱਚ ਕਣਕ ਦਾ ਭਾਅ ₹2,275 ਪ੍ਰਤੀ ਕੁਇੰਟਲ ਹੈ। ਅਗਲੇ 3 ਦਿਨਾਂ ਵਿੱਚ ਮੌਸਮ ਸਾਫ਼ ਰਹਿਣ ਦੀ ਸੰਭਾਵਨਾ ਹੈ।",
    intent: "market_price",
    suggested: ["ਮੰਡੀ ਭਾਅ ਦੇਖੋ", "ਮੌਸਮ ਜਾਣਕਾਰੀ"],
  },
  "en-US": {
    defaultResponse:
      "Today's wheat price in Karnal Mandi is ₹2,275 per quintal, which is ₹25 above the MSP (₹2,250). Market demand is strong.",
    intent: "market_price",
    suggested: ["Set Price Alert", "View 30-Day Trend", "Check Weather Forecast"],
  },
};

export const voiceMockService = {
  speechToText: async (
    _audioBlob: Blob,
    language: string = "hi-IN",
  ): Promise<STTResult> => {
    await mockDelay(1200);
    const lang = (language as VoiceLanguage) || "hi-IN";
    const sampleText =
      lang === "hi-IN"
        ? "आज करनाल मंडी में गेहूं का क्या भाव है?"
        : lang === "pa-IN"
          ? "ਅੱਜ ਮੰਡੀ ਵਿੱਚ ਕਣਕ ਦਾ ਕੀ ਭਾਅ ਹੈ?"
          : "What is today's wheat price in Karnal Mandi?";

    return {
      text: sampleText,
      language: lang,
      confidence: 0.94,
      duration_seconds: 3.5,
    };
  },

  textToSpeech: async (
    text: string,
    language: string = "hi-IN",
  ): Promise<TTSResult> => {
    await mockDelay(600);
    return {
      audio_base64: "",
      mime_type: "audio/mp3",
      duration_seconds: 4.2,
      text,
    };
  },

  voiceChat: async (
    userText: string,
    language: string = "hi-IN",
    conversationId?: string | null,
  ): Promise<VoiceChatResult> => {
    await mockDelay(1500);
    const lang = (language as VoiceLanguage) || "hi-IN";
    const preset = LOCALIZED_RESPONSES[lang] || LOCALIZED_RESPONSES["hi-IN"];

    let responseText = preset.defaultResponse;
    if (userText.includes("मौसम") || userText.includes("rain") || userText.includes("ਮੌਸਮ")) {
      responseText =
        lang === "hi-IN"
          ? "अगले 24 घंटों में करनाल और आसपास के इलाकों में हल्की बारिश की 40% संभावना है। तापमान 28°C से 32°C के बीच रहेगा।"
          : lang === "pa-IN"
            ? "ਅਗਲੇ 24 ਘੰਟਿਆਂ ਵਿੱਚ ਹਲਕੀ ਬਾਰਿਸ਼ ਦੀ ਸੰਭਾਵਨਾ ਹੈ।"
            : "Light rainfall (40% probability) is expected in your region over the next 24 hours. Temperatures will range between 28°C and 32°C.";
    }

    return {
      response_text: responseText,
      audio_base64: null,
      mime_type: "audio/mp3",
      language: lang,
      conversation_id: conversationId || `conv-${Date.now()}`,
    };
  },

  processCommand: async (
    text: string,
    language: string = "hi-IN",
  ): Promise<VoiceCommandResult> => {
    await mockDelay(900);
    return {
      command: text,
      intent: "market_price",
      parameters: { commodity: "Wheat", location: "Karnal" },
      response_text: "Karnal mandi wheat price is ₹2,275/qtl.",
      language,
    };
  },

  createSession: async (language: string = "hi-IN"): Promise<{ session_id: string }> => {
    await mockDelay(200);
    return { session_id: `session-${Date.now()}` };
  },

  endSession: async (_sessionId: string): Promise<{ detail: string }> => {
    await mockDelay(200);
    return { detail: "Session ended" };
  },
};

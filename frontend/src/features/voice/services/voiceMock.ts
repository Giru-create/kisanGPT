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
    suggested: [
      "भाव अलर्ट सेट करें",
      "मौसम का पूर्वानुमान देखें",
      "फसल डॉक्टर से बात करें",
    ],
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
    suggested: [
      "Set Price Alert",
      "View 30-Day Trend",
      "Check Weather Forecast",
    ],
  },
  "gu-IN": {
    defaultResponse:
      "આજ કરનાલ મંડીમાં ઘઉં (PBW 550) ના ભાવ ₹2,275 પ્રતિ ક્વિન્ટલ છે, જે MSP (₹2,250) કરતાં વધુ છે.",
    intent: "market_price",
    suggested: ["ભાવ એલર્ટ સેટ કરો", "મૌસમ જાણકારી"],
  },
  "mr-IN": {
    defaultResponse:
      "आज करणाल मंडीत गहू (PBW 550) चा भाव ₹2,275 प्रति क्विंटल आहे, जो MSP (₹2,250) पेक्षा जास्त आहे.",
    intent: "market_price",
    suggested: ["भाव अलर्ट सेट करा", "हवामान माहिती"],
  },
  "ta-IN": {
    defaultResponse:
      "இன்று கர்நால் மண்டியில் கோதுமை (PBW 550) விலை ₹2,275 கிலோவுக்கு, இது MSP (₹2,250) விட அதிகம்.",
    intent: "market_price",
    suggested: ["விலை எச்சரிக்கை", "வானிலை தகவல்"],
  },
  "te-IN": {
    defaultResponse:
      "ఈ రోజు కర్నాల్ మండిలో గోధుమ (PBW 550) ధర ₹2,275 క్వింటాల్‌కు, ఇది MSP (₹2,250) కంటే ఎక్కువ.",
    intent: "market_price",
    suggested: ["ధర హెచ్చరిక", "వాతావరణ సమాచారం"],
  },
  "kn-IN": {
    defaultResponse:
      "ಇಂದು ಕರ್ನಾಲ್ ಮಂಡಿಯಲ್ಲಿ ಗೋಧಿ (PBW 550) ಬೆಲೆ ₹2,275 ಪ್ರತಿ ಕ್ವಿಂಟಲ್, ಇದು MSP (₹2,250) ಗಿಂತ ಹೆಚ್ಚು.",
    intent: "market_price",
    suggested: ["ಬೆಲೆ ಎಚ್ಚರಿಕೆ", "ಹವಾಮಾನ ಮಾಹಿತಿ"],
  },
  "bn-IN": {
    defaultResponse:
      "আজ করনাল মন্ডিতে গম (PBW 550) দাম ₹2,275 প্রতি কুইন্টাল, যা MSP (₹2,250) এর চেয়ে বেশি।",
    intent: "market_price",
    suggested: ["দাম সতর্কতা", "আবহাওয়ার তথ্য"],
  },
};

export const voiceMockService = {
  speechToText: async (
    audioBlob: Blob,
    language: string = "hi-IN",
  ): Promise<STTResult> => {
    void audioBlob;
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
    void language;
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
    if (
      userText.includes("मौसम") ||
      userText.includes("rain") ||
      userText.includes("ਮੌਸਮ")
    ) {
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

  createSession: async (
    language: string = "hi-IN",
  ): Promise<{ session_id: string }> => {
    void language;
    await mockDelay(200);
    return { session_id: `session-${Date.now()}` };
  },

  endSession: async (sessionId: string): Promise<{ detail: string }> => {
    void sessionId;
    await mockDelay(200);
    return { detail: "Session ended" };
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// voice.constants.ts
// KisanGPT — Voice Assistant feature constants
// ─────────────────────────────────────────────────────────────────────────────

import type { VoiceLanguage, VoiceMessage } from "../types/voice.types";

// ---------------------------------------------------------------------------
// Supported languages
// ---------------------------------------------------------------------------

export const VOICE_LANGUAGES: Array<{
  code: VoiceLanguage;
  label: string;
  nativeLabel: string;
  script: string;
}> = [
  {
    code: "hi-IN",
    label: "Hindi",
    nativeLabel: "हिन्दी",
    script: "Devanagari",
  },
  {
    code: "pa-IN",
    label: "Punjabi",
    nativeLabel: "ਪੰਜਾਬੀ",
    script: "Gurmukhi",
  },
  { code: "en-US", label: "English", nativeLabel: "English", script: "Latin" },
];

// ---------------------------------------------------------------------------
// Example onboarding voice prompts by language
// ---------------------------------------------------------------------------

export const EXAMPLE_PROMPTS: Record<
  VoiceLanguage,
  Array<{ title: string; prompt: string; intent: string }>
> = {
  "hi-IN": [
    {
      title: "मंडी भाव",
      prompt: "आज करनाल मंडी में गेहूं और सरसों का क्या भाव है?",
      intent: "market_price",
    },
    {
      title: "मौसम सलाह",
      prompt: "क्या कल मेरे क्षेत्र में बारिश होने की संभावना है?",
      intent: "weather_query",
    },
    {
      title: "फसल बीमारी",
      prompt: "धान की फसल में पत्तों पर पीले धब्बे आ रहे हैं, क्या उपाय करें?",
      intent: "disease_detection",
    },
    {
      title: "सरकारी योजनाएं",
      prompt: "पीएम किसान सम्मान निधि योजना की अगली किस्त कब आएगी?",
      intent: "govt_scheme",
    },
  ],
  "pa-IN": [
    {
      title: "ਮੰਡੀ ਭਾਅ",
      prompt: "ਅੱਜ ਅੰਮ੍ਰਿਤਸਰ ਮੰਡੀ ਵਿੱਚ ਝੋਨੇ ਦਾ ਕੀ ਭਾਅ ਹੈ?",
      intent: "market_price",
    },
    {
      title: "ਮੌਸਮ ਜਾਣਕਾਰੀ",
      prompt: "ਕੀ ਅਗਲੇ ਦੋ ਦਿਨਾਂ ਵਿੱਚ ਮੀਂਹ ਪਵੇਗਾ?",
      intent: "weather_query",
    },
    {
      title: "ਫ਼ਸਲ ਦੀ ਬੀਜਾਈ",
      prompt: "ਕਣਕ ਦੀ ਬੀਜਾਈ ਲਈ ਸਭ ਤੋਂ ਵਧੀਆ ਸਮਾਂ ਕਿਹੜਾ ਹੈ?",
      intent: "general_query",
    },
  ],
  "en-US": [
    {
      title: "Market Prices",
      prompt: "What is today's wheat price in Karnal Mandi?",
      intent: "market_price",
    },
    {
      title: "Weather Forecast",
      prompt: "Will it rain in Karnal tomorrow?",
      intent: "weather_query",
    },
    {
      title: "Crop Disease",
      prompt: "How to treat yellow rust in wheat crop?",
      intent: "disease_detection",
    },
    {
      title: "Government Schemes",
      prompt: "How to apply for PM-Kisan scheme?",
      intent: "govt_scheme",
    },
  ],
};

// ---------------------------------------------------------------------------
// Intent display labels & icons
// ---------------------------------------------------------------------------

export const INTENT_LABELS: Record<string, string> = {
  disease_detection: "Crop Disease",
  weather_query: "Weather Forecast",
  market_price: "Mandi Prices",
  msp_query: "MSP Info",
  irrigation_advice: "Irrigation Advice",
  govt_scheme: "Government Scheme",
  help: "Help & Support",
  general_query: "Farming Guidance",
};

// ---------------------------------------------------------------------------
// Localized status labels
// ---------------------------------------------------------------------------

export const STATUS_LABELS: Record<
  VoiceLanguage,
  {
    idle: string;
    listening: string;
    processing: string;
    speaking: string;
    tapToSpeak: string;
    stopListening: string;
  }
> = {
  "hi-IN": {
    idle: "बोलने के लिए माइक दबाएं",
    listening: "सुन रहे हैं... बोलिए",
    processing: "आपके सवाल का विश्लेषण हो रहा है...",
    speaking: "किसानजीपीटी जवाब दे रहा है...",
    tapToSpeak: "माइक दबाएं",
    stopListening: "रोकें",
  },
  "pa-IN": {
    idle: "ਬੋਲਣ ਲਈ ਮਾਈਕ ਦਬਾਓ",
    listening: "ਸੁਣ ਰਹੇ ਹਾਂ... ਬੋਲੋ",
    processing: "ਤੁਹਾਡੇ ਸਵਾਲ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...",
    speaking: "ਕਿਸਾਨਜੀਪੀਟੀ ਜਵਾਬ ਦੇ ਰਿਹਾ ਹੈ...",
    tapToSpeak: "ਮਾਈਕ ਦਬਾਓ",
    stopListening: "ਰੋਕੋ",
  },
  "en-US": {
    idle: "Tap microphone to speak",
    listening: "Listening... Speak now",
    processing: "Analyzing your query...",
    speaking: "KisanGPT is responding...",
    tapToSpeak: "Tap Mic",
    stopListening: "Stop",
  },
};

// ---------------------------------------------------------------------------
// Mock messages for initial demo
// ---------------------------------------------------------------------------

export const MOCK_VOICE_MESSAGES: VoiceMessage[] = [
  {
    id: "msg-1",
    role: "user",
    text: "आज करनाल मंडी में गेहूं का क्या भाव है?",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
  },
  {
    id: "msg-2",
    role: "assistant",
    text: "आज करनाल एपीएमसी मंडी में गेहूं (PBW 550) का भाव ₹2,275 प्रति क्विंटल है, जो कल से ₹45 अधिक है।",
    timestamp: new Date(Date.now() - 4 * 60 * 1000),
    intent: "market_price",
    suggested_actions: ["भाव अलर्ट सेट करें", "30-दिन का ट्रेंड देखें"],
  },
];

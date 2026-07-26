// ─────────────────────────────────────────────────────────────────────────────
// voice.constants.ts
// KisanGPT — Voice Assistant feature constants
// ─────────────────────────────────────────────────────────────────────────────

import type { VoiceLanguage } from "../types/voice.types";

// ---------------------------------------------------------------------------
// Supported languages
// ---------------------------------------------------------------------------

export const VOICE_LANGUAGES: Array<{
  code: VoiceLanguage;
  label: string;
  nativeLabel: string;
}> = [
  { code: "hi-IN", label: "Hindi", nativeLabel: "हिन्दी" },
  { code: "pa-IN", label: "Punjabi", nativeLabel: "ਪੰਜਾਬੀ" },
  { code: "en-US", label: "English", nativeLabel: "English" },
];

// ---------------------------------------------------------------------------
// Intent display labels
// ---------------------------------------------------------------------------

export const INTENT_LABELS: Record<string, string> = {
  disease_detection: "Crop Disease",
  weather_query: "Weather",
  market_price: "Market Price",
  msp_query: "MSP Info",
  irrigation_advice: "Irrigation",
  govt_scheme: "Govt Scheme",
  help: "Help",
  general_query: "General",
};

// ---------------------------------------------------------------------------
// Intent icons (Lucide icon names)
// ---------------------------------------------------------------------------

export const INTENT_ICONS: Record<string, string> = {
  disease_detection: "Bug",
  weather_query: "CloudSun",
  market_price: "TrendingUp",
  msp_query: "IndianRupee",
  irrigation_advice: "Droplets",
  govt_scheme: "Landmark",
  help: "HelpCircle",
  general_query: "MessageCircle",
};

// ---------------------------------------------------------------------------
// Mock messages for demo
// ---------------------------------------------------------------------------

import type { VoiceMessage } from "../types/voice.types";

export const MOCK_VOICE_MESSAGES: VoiceMessage[] = [
  {
    id: "msg-1",
    role: "user",
    text: "मेरी फसल में पीले पत्ते दिख रहे हैं",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
  },
  {
    id: "msg-2",
    role: "assistant",
    text: "Please take a photo of your crop leaf using the Disease Detection feature, and I will analyze it.",
    timestamp: new Date(Date.now() - 4 * 60 * 1000),
  },
];

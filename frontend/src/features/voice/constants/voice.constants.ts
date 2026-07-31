// ─────────────────────────────────────────────────────────────────────────────
// voice.constants.ts
// KisanGPT — Voice Assistant feature constants
// ─────────────────────────────────────────────────────────────────────────────

import type {
  VoiceLanguage,
  VoiceMessage,
  QuickVoiceAction,
  AIContextData,
  VoiceSettingsData,
  RecentConversation,
} from "../types/voice.types";

// ---------------------------------------------------------------------------
// Supported languages
// ---------------------------------------------------------------------------

export const VOICE_LANGUAGES: Array<{
  code: VoiceLanguage;
  label: string;
  nativeLabel: string;
  script: string;
  flag: string;
}> = [
  {
    code: "hi-IN",
    label: "Hindi",
    nativeLabel: "\u0939\u093F\u0928\u094D\u0926\u0940",
    script: "Devanagari",
    flag: "\uD83C\uDDEE\uD83C\uDDF3",
  },
  {
    code: "en-US",
    label: "English",
    nativeLabel: "English",
    script: "Latin",
    flag: "\uD83C\uDDEC\uD83C\uDDE7",
  },
  {
    code: "pa-IN",
    label: "Punjabi",
    nativeLabel: "\u0A2A\u0A70\u0A1C\u0A3E\u0A2C\u0A40",
    script: "Gurmukhi",
    flag: "\uD83C\uDDEE\uD83C\uDDF3",
  },
  {
    code: "gu-IN",
    label: "Gujarati",
    nativeLabel: "\u0A97\u0AC1\u0A9C\u0AB0\u0ABE\u0AA4\u0AC0",
    script: "Gujarati",
    flag: "\uD83C\uDDEE\uD83C\uDDF3",
  },
  {
    code: "mr-IN",
    label: "Marathi",
    nativeLabel: "\u092E\u0930\u093E\u0920\u0940",
    script: "Devanagari",
    flag: "\uD83C\uDDEE\uD83C\uDDF3",
  },
  {
    code: "ta-IN",
    label: "Tamil",
    nativeLabel: "\u0BA4\u0BAE\u0BBF\u0BB4\u0BCD",
    script: "Tamil",
    flag: "\uD83C\uDDEE\uD83C\uDDF3",
  },
  {
    code: "te-IN",
    label: "Telugu",
    nativeLabel: "\u0C24\u0C46\u0C32\u0C41\u0C17\u0C41",
    script: "Telugu",
    flag: "\uD83C\uDDEE\uD83C\uDDF3",
  },
  {
    code: "kn-IN",
    label: "Kannada",
    nativeLabel: "\u0C95\u0CA8\u0CCD\u0CA8\u0CA1",
    script: "Kannada",
    flag: "\uD83C\uDDEE\uD83C\uDDF3",
  },
  {
    code: "bn-IN",
    label: "Bengali",
    nativeLabel: "\u09AC\u09BE\u0982\u09B2\u09BE",
    script: "Bengali",
    flag: "\uD83C\uDDEE\uD83C\uDDF3",
  },
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
      title: "\u092E\u0902\u0921\u0940 \u092D\u093E\u0935",
      prompt:
        "\u0906\u091C \u0915\u0930\u0928\u093E\u0932 \u092E\u0902\u0921\u0940 \u092E\u0947\u0902 \u0917\u0947\u0939\u0942\u0902 \u0914\u0930 \u0938\u0930\u0938\u094B\u0902 \u0915\u093E \u0915\u094D\u092F\u093E \u092D\u093E\u0935 \u0939\u0948?",
      intent: "market_price",
    },
    {
      title: "\u092E\u094C\u0938\u092E \u0938\u0932\u093E\u0939",
      prompt:
        "\u0915\u094D\u092F\u093E \u0915\u0932 \u092E\u0947\u0930\u0947 \u0915\u094D\u0937\u0947\u0924\u094D\u0930 \u092E\u0947\u0902 \u092C\u093E\u0930\u093F\u0936 \u0939\u094B\u0928\u0947 \u0915\u0940 \u0938\u0902\u092D\u093E\u0935\u0928\u093E \u0939\u0948?",
      intent: "weather_query",
    },
    {
      title: "\u092B\u0938\u0932 \u092C\u0940\u092E\u093E\u0930\u0940",
      prompt:
        "\u0927\u093E\u0928 \u0915\u0940 \u092B\u0938\u0932 \u092E\u0947\u0902 \u092A\u0924\u094D\u0924\u094B\u0902 \u092A\u0930 \u092A\u0940\u0932\u0947 \u0927\u092C\u094D\u092C\u0947 \u0906 \u0930\u0939\u0947 \u0939\u0948\u0902, \u0915\u094D\u092F\u093E \u0909\u092A\u093E\u092F \u0915\u0930\u0947\u0902?",
      intent: "disease_detection",
    },
    {
      title:
        "\u0938\u0930\u0915\u093E\u0930\u0940 \u092F\u094B\u091C\u0928\u093E\u090F\u0902",
      prompt:
        "\u092A\u0940\u090F\u092E \u0915\u093F\u0938\u093E\u0928 \u0938\u092E\u094D\u092E\u093E\u0928 \u0928\u093F\u0927\u093F \u092F\u094B\u091C\u0928\u093E \u0915\u0940 \u0905\u0917\u0932\u0940 \u0915\u093F\u0938\u094D\u0924 \u0915\u092C \u0906\u090F\u0917\u0940?",
      intent: "govt_scheme",
    },
  ],
  "pa-IN": [
    {
      title: "\u0A2E\u0A70\u0A21\u0A40 \u0A2D\u0A3E\u0A05",
      prompt:
        "\u0A05\u0A71\u0A1C \u0A05\u0A70\u0A2E\u0A4D\u0A30\u0A3F\u0A24\u0A38\u0A30 \u0A2E\u0A70\u0A21\u0A40 \u0A35\u0A3F\u0A71\u0A1A \u0A1D\u0A4B\u0A28\u0A47 \u0A26\u0A3E \u0A15\u0A40 \u0A2D\u0A3E\u0A05 \u0A39\u0A48?",
      intent: "market_price",
    },
    {
      title:
        "\u0A2E\u0A4C\u0A38\u0A2E \u0A1C\u0A3E\u0A23\u0A15\u0A3E\u0A30\u0A40",
      prompt:
        "\u0A15\u0A40 \u0A05\u0A17\u0A32\u0A47 \u0A26\u0A4B \u0A26\u0A3F\u0A28\u0A3E\u0A02 \u0A35\u0A3F\u0A71\u0A1A \u0A2E\u0A40\u0A70\u0A39 \u0A2A\u0A75\u0A47\u0A17\u0A3E?",
      intent: "weather_query",
    },
    {
      title:
        "\u0A2B\u0A3C\u0A38\u0A32 \u0A26\u0A40 \u0A2C\u0A40\u0A1C\u0A3E\u0A08",
      prompt:
        "\u0A15\u0A23\u0A15 \u0A26\u0A40 \u0A2C\u0A40\u0A1C\u0A3E\u0A08 \u0A32\u0A3E\u0A38\u0A24\u0A47 \u0A38\u0A2D \u0A24\u0A4B\u0A78 \u0A35\u0A27\u0A40\u0A06 \u0A38\u0A2E\u0A3E \u0A39\u0A48?",
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
  "gu-IN": [
    {
      title: "\u0AB8\u0AC2\u0A9A \u0AAD\u0ABE\u0AAB",
      prompt:
        "\u0A86\u0A9C \u0A95\u0AB0\u0A23\u0ABE\u0AB2 \u0AAE\u0AB6\u0ABD\u0AB0\u0AC0 \u0A98\u0ACD\u0AB5\u0AC7\u0A82\u0AA8\u0ABF \u0A9A\u0ABD\u0AB0 \u0A9A\u0ABF\u0AB9\u0ABF \u0AAB\u0ABE\u0AB0 \u0A9B\u0AC7? ",
      intent: "market_price",
    },
  ],
  "mr-IN": [
    {
      title: "\u092C\u093E\u091C\u093E\u0930 \u092D\u093E\u0935",
      prompt:
        "\u0906\u091C \u0915\u0930\u0923\u093E\u0932 \u092E\u0927\u094D\u092F\u0947 \u0917\u0939\u0942 \u092F\u093E \u0938\u0930\u0938\u094B\u0902 \u0915\u094D\u092F\u093E \u092D\u093E\u0935 \u0906\u0939\u0947?",
      intent: "market_price",
    },
  ],
  "ta-IN": [
    {
      title: "\u0B9A\u0BA8\u0BCD\u0B9A\u0BB0 \u0BB5\u0BBF\u0BB2\u0BC8",
      prompt:
        "\u0B87\u0BA8\u0BCD\u0B9A\u0BC1 \u0B95\u0BC6\u0BA9\u0BCD\u0BB2 \u0B95\u0BCB\u0BA9\u0BCD\u0BB2\u0BBF \u0B95\u0BC6\u0BA4\u0BC1\u0BB5\u0BC8 \u0BB5\u0BBF\u0BB2\u0BC8?",
      intent: "market_price",
    },
  ],
  "te-IN": [
    {
      title:
        "\u0C2E\u0C3E\u0C30\u0C4D\u0C15\u0C46\u0C1F\u0C4D \u0C27\u0C30\u0C3E\u0C32\u0C41",
      prompt:
        "\u0C08\u0C28\u0C3F \u0C15\u0C30\u0C28\u0C42\u0C32 \u0C2E\u0C3E\u0C30\u0C4D\u0C15\u0C46\u0C1F\u0C4D \u0C32\u0C4B \u0C17\u0C4B\u0C27\u0C41\u0C2E \u0C27\u0C30\u0C3E\u0C32\u0C41 \u0C0E\u0C23\u0C4D\u0C1F\u0C3F?",
      intent: "market_price",
    },
  ],
  "kn-IN": [
    {
      title:
        "\u0C2E\u0C3E\u0C30\u0CCD\u0C15\u0CC6\u0C1F\u0CCD \u0C2C\u0CC6\u0C32\u0CC6",
      prompt:
        "\u0C07\u0C02\u0C24\u0C41 \u0C15\u0CB0\u0CA3\u0CBE\u0CB2 \u0C2E\u0C3E\u0C30\u0CCD\u0C15\u0CC6\u0C1F\u0CCD\u0CB2\u0CCD\u0CB2\u0CBF \u0C17\u0CCB\u0C21\u0CC1 \u0C27\u0C30\u0CC6 \u0C0E\u0C23\u0CCD\u0C1F\u0CBF?",
      intent: "market_price",
    },
  ],
  "bn-IN": [
    {
      title: "\u09B8\u09C7\u09A8\u09CD\u09A1 \u09A6\u09B0",
      prompt:
        "\u0986\u099C \u0995\u09B0\u09A3\u09BE\u09B2 \u09B8\u09C7\u09A8\u09CD\u09A1\u09C7 \u0997\u09B2\u09C7\u09B0 \u09A6\u09B0 \u0995\u09A4?",
      intent: "market_price",
    },
  ],
};

// ---------------------------------------------------------------------------
// Quick voice actions
// ---------------------------------------------------------------------------

export const QUICK_VOICE_ACTIONS: QuickVoiceAction[] = [
  {
    id: "weather",
    label: "Weather",
    description: "Check farm weather forecast",
    icon: "\uD83C\uDF26\uFE0F",
    prompt: "What is the weather forecast for my farm today?",
    color: "text-blue-600 bg-blue-50",
  },
  {
    id: "market",
    label: "Market Prices",
    description: "Get current mandi prices",
    icon: "\uD83D\uDCC8",
    prompt: "What are today's mandi prices for wheat and mustard?",
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    id: "disease",
    label: "Disease Help",
    description: "Diagnose crop diseases",
    icon: "\uD83C\uDF3F",
    prompt: "My crop leaves have yellow spots, what should I do?",
    color: "text-amber-600 bg-amber-50",
  },
  {
    id: "schemes",
    label: "Govt Schemes",
    description: "Find eligible schemes",
    icon: "\uD83C\uDFE6",
    prompt: "Which government schemes am I eligible for?",
    color: "text-violet-600 bg-violet-50",
  },
  {
    id: "advice",
    label: "Farm Advice",
    description: "Get expert farming tips",
    icon: "\uD83E\uDDD0",
    prompt: "Give me advice on managing my wheat crop this season.",
    color: "text-teal-600 bg-teal-50",
  },
  {
    id: "emergency",
    label: "Emergency",
    description: "Urgent crop assistance",
    icon: "\u26A0\uFE0F",
    prompt: "My crop is being destroyed by pests, I need urgent help!",
    color: "text-red-600 bg-red-50",
  },
];

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
    idle: "\u092C\u094B\u0932\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u092E\u093E\u0907\u0915 \u0926\u092C\u093E\u090F\u0902",
    listening:
      "\u0938\u0941\u0928 \u0930\u0939\u0947 \u0939\u0948\u0902... \u092C\u094B\u0932\u093F\u090F",
    processing:
      "\u0906\u092A\u0915\u0947 \u0938\u0935\u093E\u0932 \u0915\u093E \u0935\u093F\u0936\u094D\u0932\u0947\u0937\u0923 \u0939\u094B \u0930\u0939\u093E \u0939\u0948...",
    speaking:
      "\u0915\u093F\u0938\u093E\u0928\u091C\u0940\u092A\u0940\u091F\u0940 \u091C\u0935\u093E\u092C \u0926\u0947 \u0930\u0939\u093E \u0939\u0948...",
    tapToSpeak: "\u092E\u093E\u0907\u0915 \u0926\u092C\u093E\u090F\u0902",
    stopListening: "\u0930\u094B\u0915\u0947\u0902",
  },
  "pa-IN": {
    idle: "\u0A2C\u0A4B\u0A32\u0A23 \u0A32\u0A3E\u0A38\u0A24\u0A47 \u0A2E\u0A3E\u0A08\u0A15 \u0A26\u0A2C\u0A3E\u0A13",
    listening:
      "\u0B38\u0A41\u0A23 \u0B30\u0B39\u0A47 \u0B39\u0A3E\u0A02... \u0A2C\u0A4B\u0A32\u0A4B",
    processing:
      "\u0A24\u0A41\u0A39\u0A3E\u0A21\u0A47 \u0B38\u0A35\u0A3E\u0A32 \u0A26\u0A3E \u0A35\u0A3F\u0A36\u0A32\u0A47\u0A38\u0A3C\u0A23 \u0A15\u0A40\u0A24\u0A3E \u0A1C\u0A3E \u0B30\u0B39\u0A3E \u0B39\u0A48...",
    speaking:
      "\u0A15\u0A3F\u0A38\u0A3E\u0A28\u0A1C\u0A40\u0A2A\u0A40\u0A1F\u0A40 \u0A1C\u0A35\u0A3E\u0A2C \u0A26\u0A47 \u0B30\u0B39\u0A40 \u0B39\u0A48...",
    tapToSpeak: "\u0A2E\u0A3E\u0A08\u0A15 \u0A26\u0A2C\u0A3E\u0A13",
    stopListening: "\u0B30\u0B4B\u0A15\u0B4B",
  },
  "en-US": {
    idle: "Tap microphone to speak",
    listening: "Listening... Speak now",
    processing: "Analyzing your query...",
    speaking: "KisanGPT is responding...",
    tapToSpeak: "Tap Mic",
    stopListening: "Stop",
  },
  "gu-IN": {
    idle: "\u0AAC\u0ACB\u0AB2\u0AB5\u0ABE \u0A2E\u0A3E\u0A08\u0A15\u0AB0\u0A4B\u0AAE \u0AA0\u0ACB\u0AAF\u0ACB",
    listening:
      "\u0AB8\u0AC1\u0A23 \u0B30\u0B39\u0A4D\u0AA4\u0ABE \u0B59\u0AC7... \u0A2C\u0ACB\u0AB2\u0ACB",
    processing:
      "\u0A24\u0AC1\u0A2E\u0ABE\u0AB0\u0ABE \u0AB8\u0AB5\u0ABE\u0AB2 \u0A95\u0AC0 \u0A35\u0A3F\u0AB6\u0AB2\u0AC7\u0AB6\u0AB4 \u0A9A\u0ABE\u0AB2\u0AB8 \u0AB0\u0AB9\u0ABF \u0AB9\u0AB5\u0ABE \u0A9B\u0AC7...",
    speaking:
      "\u0A95\u0ABF\u0AB8\u0A3E\u0A28\u0A1C\u0A40\u0AAA\u0A40\u0A9F\u0A40 \u0A9C\u0AB5\u0ABE\u0AAC \u0A21\u0AC7 \u0B30\u0AB9\u0AC0 \u0AB9\u0AB5\u0ABE...",
    tapToSpeak:
      "\u0AAE\u0ABE\u0A08\u0A15\u0AB0\u0ABF \u0AA4\u0ABE\u0AB2\u0ABF\u0AB8\u0AB8\u0ACB",
    stopListening: "\u0AAB\u0AC7\u0AB0\u0ACB",
  },
  "mr-IN": {
    idle: "\u092C\u094B\u0932\u0923\u094D\u092F\u093E\u0938\u093E\u0930\u094D\u0925\u0940 \u092E\u093E\u0907\u0915 \u0926\u093E\u0935\u093E",
    listening:
      "\u0905\u0938\u0932\u092F\u093E \u0939\u094B\u0924\u094B... \u092C\u094B\u0932\u093E",
    processing:
      "\u0924\u0941\u092E\u0939\u093E\u091A\u0947 \u0938\u0935\u093E\u0932 \u0935\u093F\u0936\u094D\u0932\u0947\u0937\u0923 \u0939\u094B\u0924 \u0906\u0939\u0947...",
    speaking:
      "\u0915\u093F\u0938\u093E\u0928\u091C\u0940\u092A\u0940\u091F\u0940 \u0939\u0947 \u0938\u093E\u0901\u0940 \u0926\u0947 \u0939\u094B\u0924...",
    tapToSpeak: "\u092E\u093E\u0907\u0915 \u0926\u093E\u0935\u093E",
    stopListening: "\u0925\u093E\u092E\u092C\u093E",
  },
  "ta-IN": {
    idle: "\u0BAA\u0BC7\u0BB8\u0BCD \u0BAA\u0BC7\u0BB4\u0B9A\u0BBF \u0BA4\u0B9F\u0BCD\u0B9F\u0BC1\u0999\u0BCD\u0995\u0B95\u0BCD\u0B95\u0BC1\u0995 \u0B85\u0BB4\u0BCD\u0BB4\u0BC1\u0995",
    listening:
      "\u0B95\u0BC7\u0B9F\u0BCD\u0B95\u0BBF\u0BB1\u0B99\u0BCD\u0BB5\u0BBF\u0B95\u0BCD\u0B95\u0BBF\u0BB3\u0BCD\u0BB4\u0BC7\u0BA9\u0BCD\u0BAE\u0BCD... \u0BAA\u0BC7\u0BB2\u0BC1\u0999\u0BCD\u0995",
    processing:
      "\u0B94\u0BB2 \u0B95\u0BC7\u0B9F\u0BCD\u0B9F\u0BB2\u0BCD \u0BAA\u0BB0\u0BBF\u0BB8\u0BCD\u0B9A\u0BBE\u0BB0\u0BBF\u0B9A\u0BCD\u0B9A\u0BAE\u0BCD \u0BA8\u0B9F\u0BC1\u0BAA\u0BCD\u0BAA\u0B9F\u0BC1\u0995\u0BBF\u0BB1\u0BA4\u0BCD\u0B95\u0BBF\u0BB3\u0BCD\u0BB4\u0BC7\u0BA9\u0BCD\u0BAE\u0BCD...",
    speaking:
      "\u0B95\u0BBF\u0B9A\u0BA9\u0BCD\u0B9C\u0BBF\u0BAA\u0BBF\u0B9F\u0BC0 \u0BAA\u0BA4\u0BBF\u0BB2\u0BCD \u0B9F\u0BA4\u0BC1\u0995\u0BBF\u0BB1\u0BA4\u0BCD\u0B95\u0BBF\u0BB3\u0BCD\u0BB4\u0BC7\u0BA9\u0BCD\u0BAE\u0BCD...",
    tapToSpeak:
      "\u0BAA\u0BC7\u0BB8\u0BCD \u0BAA\u0BC7\u0BB4\u0B9A\u0BBF \u0BA4\u0B9F\u0BCD\u0B9F\u0BC1\u0999\u0BCD\u0995\u0B95\u0BCD\u0B95\u0BC1\u0995",
    stopListening: "\u0BA8\u0BBF\u0B1A\u0BCD\u0B9A\u0BBF",
  },
  "te-IN": {
    idle: "\u0C2E\u0C3E\u0C30\u0C4D\u0C2F\u0C41 \u0C2A\u0C3F\u0C32\u0C3F\u0C2A\u0C21\u0C3E\u0C32\u0C3F \u0C2E\u0C3E\u0C3F\u0C15\u0C4D \u0C28\u0C4A\u0C15\u0C4D\u0D2E\u0D02\u0D21\u0C3F",
    listening:
      "\u0C35\u0C3F\u0C28\u0C4D\u0D3F \u0C35\u0C3F\u0C28\u0D3F\u0D38\u0D4D\u0D24\u0C41\u0D28\u0D4D\u0D26\u0D3F... \u0C2E\u0C3E\u0C1F\u0D4D\u0D32\u0D3E\u0D21\u0D3F",
    processing:
      "\u0C2E\u0C40 \u0C2A\u0C4D\u0D30\u0C36\u0C4D\u0D28\u0C3E\u0C28\u0D3F\u0C15\u0C3F \u0C35\u0C3F\u0C36\u0C4D\u0D32\u0C47\u0C37\u0C23 \u0C1C\u0C30\u0C3F\u0C17\u0C4D\u0D3E\u0C24\u0D4D\u0D24\u0D4B\u0D2E\u0D26\u0D3F...",
    speaking:
      "\u0C15\u0C3F\u0C38\u0C3E\u0C28\u0C4D\u0D1C\u0C40\u0C2A\u0C40\u0D1F\u0C3F \u0D38\u0C2E\u0C3E\u0D27\u0C3E\u0C28\u0C02 \u0C07\u0D38\u0D4D\u0D24\u0D41\u0D28\u0D4D\u0D26\u0D3F...",
    tapToSpeak:
      "\u0C2E\u0C3E\u0C3F\u0C15\u0C4D \u0C28\u0C4A\u0C15\u0C4D\u0D2E\u0D02\u0D21\u0C3F",
    stopListening:
      "\u0C06\u0C2A\u0C48\u0D15\u0C47\u0D2F\u0D38\u0D38\u0D3E\u0D26\u0D3F",
  },
  "kn-IN": {
    idle: "\u0CAE\u0C88\u0CCD\u0C95\u0CCD \u0C28\u0C4A\u0C95\u0CCD\u0C95\u0CAF\u0CC0\u0CB0\u0CBF \u0C24\u0C1F\u0CCD\u0CAF\u0CBF\u0CB0\u0CBF",
    listening:
      "\u0C15\u0C47\u0CB3\u0CCD\u0C24\u0C3E \u0C07\u0CA6\u0CCD\u0CA6\u0CC7... \u0CAE\u0CBE\u0C24\u0CA3\u0CCD\u0C23\u0CBF\u0CB0\u0CBF",
    processing:
      "\u0CA8\u0CBF\u0CAE\u0CCD\u0CAE \u0C2A\u0CCD\u0C30\u0CB6\u0CCD\u0CA8\u0CC7 \u0CB5\u0CBF\u0CB6\u0CCD\u0CB2\u0CC7\u0CB7\u0CA3\u0CC7 \u0C1C\u0CB0\u0C97\u0CBF\u0CA4\u0CBE \u0C07\u0CA6\u0CC7... ",
    speaking:
      "\u0C15\u0CBF\u0CB8\u0CBE\u0CA8\u0C9C\u0CBE\u0CAA\u0CBF\u0C9F\u0CBF \u0C09\u0CA4\u0CCD\u0CA4\u0CB0 \u0C15\u0CCA\u0CD0\u0D24\u0CCD\u0D24\u0CBF\u0CA6\u0CC7...",
    tapToSpeak:
      "\u0CAE\u0C88\u0CCD\u0C95\u0CCD \u0C24\u0C1F\u0CCD\u0CAF\u0CBF\u0CB0\u0CBF",
    stopListening: "\u0CA8\u0CBF\u0CB2\u0CC1\u0D38\u0CBF",
  },
  "bn-IN": {
    idle: "\u0995\u09A5\u09BE \u0995\u09B2\u09B2\u09CD\u09A4\u09C7 \u09AE\u09BE\u0987\u0995\u09B0\u09CB\u09AB\u09CB\u09A8 \u099F\u09CD\u09AF\u09BE\u09AA \u0995\u09B0\u09C1\u09A8",
    listening:
      "\u09B6\u09C1\u09A3\u09B9\u09BF\u09A6\u09BF\u09B8\u09CD\u099B\u09A8... \u0995\u09B2\u09B2\u09CD\u09A4\u09C7",
    processing:
      "\u0986\u09AA\u09A8\u09BE\u09B0 \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8 \u09B6\u09A1\u09BC \u099A\u09B2\u09B9\u09B2\u09B8\u09BF\u09CD\u099F \u09B9\u099A\u09CD\u099B\u09C7...",
    speaking:
      "\u0995\u09BF\u09B8\u09BE\u09A8\u099C\u09BF\u09AA\u09BF\u099F\u09BF \u09A8\u09BE\u099F\u09BE \u09A6\u09BF\u09B8\u09CD\u099A\u09B9\u09CD\u099A\u09C7...",
    tapToSpeak:
      "\u09AE\u09BE\u0987\u0995\u09B0\u09CB\u09AB\u09CB\u09A8 \u099F\u09CD\u09AF\u09BE\u09AA \u0995\u09B0\u09C1\u09A8",
    stopListening: "\u09A5\u09BE\u09AE\u09A4\u09C7 \u09A6\u09BF\u09A8",
  },
};

// ---------------------------------------------------------------------------
// Mock messages for initial demo
// ---------------------------------------------------------------------------

export const MOCK_VOICE_MESSAGES: VoiceMessage[] = [
  {
    id: "msg-1",
    role: "user",
    text: "\u0906\u091C \u0915\u0930\u0928\u093E\u0932 \u092E\u0902\u0921\u0940 \u092E\u0947\u0902 \u0917\u0947\u0939\u0942\u0902 \u0915\u093E \u0915\u094D\u092F\u093E \u092D\u093E\u0935 \u0939\u0948?",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    confidence: 0.94,
  },
  {
    id: "msg-2",
    role: "assistant",
    text: "\u0906\u091C \u0915\u0930\u0928\u093E\u0932 \u090F\u092A\u0940\u090F\u092E\u0938\u0940 \u092E\u0902\u0921\u0940 \u092E\u0947\u0902 \u0917\u0947\u0939\u0942\u0902 (PBW 550) \u0915\u093E \u092D\u093E\u0935 \u20B92,275 \u092A\u094D\u0930\u0924\u093F \u0915\u094D\u0935\u093F\u0902\u091F\u0932 \u0939\u0948, \u091C\u094B \u0915\u0932 \u0938\u0947 \u20B945 \u0905\u0927\u093F\u0915 \u0939\u0948\u0964",
    timestamp: new Date(Date.now() - 4 * 60 * 1000),
    intent: "market_price",
    suggested_actions: [
      "\u092D\u093E\u0935 \u0905\u0932\u0930\u094D\u091F \u0938\u0947\u091F \u0915\u0930\u0947\u0902",
      "30-\u0926\u093F\u0928 \u0915\u093E \u091F\u094D\u0930\u0947\u0902\u0921 \u0926\u0947\u0916\u0947\u0902",
    ],
    confidence: 0.92,
  },
];

// ---------------------------------------------------------------------------
// AI context mock data
// ---------------------------------------------------------------------------

export const MOCK_AI_CONTEXT: AIContextData = {
  currentCrop: "Wheat (PBW 550)",
  location: "Karnal, Haryana",
  weatherSummary: "32\u00B0C, Partly cloudy, 40% rain chance tomorrow",
  recentRecommendation: "Apply urea top-dressing within 3 days",
  conversationSummary: "Discussed wheat prices and irrigation schedule",
};

// ---------------------------------------------------------------------------
// Voice settings defaults
// ---------------------------------------------------------------------------

export const DEFAULT_VOICE_SETTINGS: VoiceSettingsData = {
  voiceSpeed: 1.0,
  voiceGender: "female",
  autoSpeak: true,
  wakeWord: false,
  noiseReduction: true,
  offlineMode: false,
};

// ---------------------------------------------------------------------------
// Recent conversations mock data
// ---------------------------------------------------------------------------

export const MOCK_RECENT_CONVERSATIONS: RecentConversation[] = [
  {
    id: "conv-1",
    title: "Wheat Price Inquiry",
    lastMessage: "Wheat at \u20B92,275/qtl in Karnal",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    messageCount: 4,
    language: "hi-IN",
  },
  {
    id: "conv-2",
    title: "Weather Forecast",
    lastMessage: "Light rain expected tomorrow",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    messageCount: 6,
    language: "en-US",
  },
  {
    id: "conv-3",
    title: "Disease Diagnosis",
    lastMessage: "Yellow rust treatment recommended",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    messageCount: 8,
    language: "hi-IN",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// settings.constants.ts
// KisanGPT — Settings feature constants
// ─────────────────────────────────────────────────────────────────────────────

import type {
  SettingsCategory,
  SettingsData,
  IntegrationItem,
} from "../types/settings.types";

export const SETTINGS_CATEGORIES: Array<{
  id: SettingsCategory;
  label: string;
  icon: string;
  description: string;
}> = [
  {
    id: "ai",
    label: "AI",
    icon: "brain",
    description: "Personalize your AI assistant",
  },
  {
    id: "voice",
    label: "Voice",
    icon: "mic",
    description: "Configure voice interactions",
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: "bell",
    description: "Manage alerts and reminders",
  },
  {
    id: "appearance",
    label: "Appearance",
    icon: "palette",
    description: "Customize the look and feel",
  },
  {
    id: "farm",
    label: "Farm Settings",
    icon: "tractor",
    description: "Configure your farm details",
  },
  {
    id: "privacy",
    label: "Privacy",
    icon: "shield",
    description: "Control your data and privacy",
  },
  {
    id: "security",
    label: "Security",
    icon: "lock",
    description: "Protect your account",
  },
  {
    id: "integrations",
    label: "Integrations",
    icon: "puzzle",
    description: "Connect external services",
  },
  {
    id: "about",
    label: "About",
    icon: "info",
    description: "App info and legal",
  },
];

export const PERSONALITY_OPTIONS = [
  { id: "friendly", label: "Friendly", description: "Warm and conversational" },
  {
    id: "professional",
    label: "Professional",
    description: "Clear and direct",
  },
  { id: "expert", label: "Expert", description: "Detailed technical advice" },
  { id: "simple", label: "Simple", description: "Easy to understand" },
];

export const RESPONSE_LENGTH_OPTIONS = [
  {
    id: "concise" as const,
    label: "Concise",
    description: "Short, to-the-point answers",
  },
  {
    id: "balanced" as const,
    label: "Balanced",
    description: "Moderate detail level",
  },
  {
    id: "detailed" as const,
    label: "Detailed",
    description: "Comprehensive explanations",
  },
];

export const LANGUAGE_STYLE_OPTIONS = [
  { id: "formal" as const, label: "Formal", description: "Professional tone" },
  {
    id: "friendly" as const,
    label: "Friendly",
    description: "Casual and warm",
  },
  { id: "simple" as const, label: "Simple", description: "Easy to understand" },
];

export const CONFIDENCE_OPTIONS = [
  { id: "low" as const, label: "Low", description: "Show more options" },
  {
    id: "medium" as const,
    label: "Medium",
    description: "Balanced confidence",
  },
  {
    id: "high" as const,
    label: "High",
    description: "Only high-confidence results",
  },
];

export const VOICE_LANGUAGE_OPTIONS = [
  { id: "hi", label: "Hindi" },
  { id: "en", label: "English" },
  { id: "pa", label: "Punjabi" },
  { id: "gu", label: "Gujarati" },
  { id: "mr", label: "Marathi" },
  { id: "ta", label: "Tamil" },
  { id: "te", label: "Telugu" },
  { id: "kn", label: "Kannada" },
  { id: "bn", label: "Bengali" },
];

export const VOICE_OPTIONS = [
  {
    id: "kiran",
    label: "Kiran",
    gender: "Female",
    description: "Warm and friendly",
  },
  {
    id: "arjun",
    label: "Arjun",
    gender: "Male",
    description: "Clear and professional",
  },
  {
    id: "priya",
    label: "Priya",
    gender: "Female",
    description: "Expert and detailed",
  },
  { id: "ravi", label: "Ravi", gender: "Male", description: "Simple and easy" },
];

export const SPEECH_SPEED_OPTIONS = [
  { id: "slow" as const, label: "Slow", description: "0.75x speed" },
  { id: "normal" as const, label: "Normal", description: "1x speed" },
  { id: "fast" as const, label: "Fast", description: "1.25x speed" },
];

export const THEME_OPTIONS = [
  { id: "light" as const, label: "Light", icon: "sun" },
  { id: "dark" as const, label: "Dark", icon: "moon" },
  { id: "system" as const, label: "System", icon: "monitor" },
];

export const FONT_SIZE_OPTIONS = [
  { id: "small" as const, label: "Small", preview: "A" },
  { id: "medium" as const, label: "Medium", preview: "A" },
  { id: "large" as const, label: "Large", preview: "A" },
];

export const CONTRAST_OPTIONS = [
  { id: "normal" as const, label: "Normal" },
  { id: "high" as const, label: "High Contrast" },
];

export const SOIL_TYPE_OPTIONS = [
  { id: "alluvial", label: "Alluvial" },
  { id: "black", label: "Black (Regur)" },
  { id: "red", label: "Red" },
  { id: "laterite", label: "Laterite" },
  { id: "desert", label: "Desert" },
  { id: "mountain", label: "Mountain" },
];

export const IRRIGATION_OPTIONS = [
  { id: "drip", label: "Drip Irrigation" },
  { id: "sprinkler", label: "Sprinkler" },
  { id: "flood", label: "Flood/Furrow" },
  { id: "rainfed", label: "Rainfed" },
  { id: "center-pivot", label: "Center Pivot" },
];

export const UNIT_OPTIONS = [
  { id: "metric" as const, label: "Metric (kg, hectare, °C)" },
  { id: "imperial" as const, label: "Imperial (lb, acre, °F)" },
];

export const MOCK_INTEGRATIONS: IntegrationItem[] = [
  {
    id: "gdrive",
    name: "Google Drive",
    icon: "cloud",
    connected: true,
    description: "Backup and sync farm data",
    category: "cloud",
  },
  {
    id: "onedrive",
    name: "OneDrive",
    icon: "cloud",
    connected: false,
    description: "Microsoft cloud storage",
    category: "cloud",
  },
  {
    id: "imd",
    name: "IMD Weather",
    icon: "cloud-sun",
    connected: true,
    description: "India Meteorological Department",
    category: "weather",
  },
  {
    id: "openweather",
    name: "OpenWeather",
    icon: "cloud-sun",
    connected: false,
    description: "Global weather data",
    category: "weather",
  },
  {
    id: "pmkisan",
    name: "PM-KISAN",
    icon: "landmark",
    connected: false,
    description: "Government farmer scheme portal",
    category: "government",
  },
  {
    id: "agmarknet",
    name: "Agmarknet",
    icon: "trending-up",
    connected: true,
    description: "Agricultural market prices",
    category: "market",
  },
  {
    id: "ncdex",
    name: "NCDEX",
    icon: "trending-up",
    connected: false,
    description: "National Commodity Exchange",
    category: "market",
  },
];

export const MOCK_APP_INFO = {
  version: "2.1.0",
  buildNumber: "2026.08.001",
  releaseDate: "August 1, 2026",
  termsUrl: "https://kisangpt.in/terms",
  privacyUrl: "https://kisangpt.in/privacy",
  supportEmail: "support@kisangpt.in",
  feedbackUrl: "https://kisangpt.in/feedback",
  licensesUrl: "https://kisangpt.in/licenses",
};

export const DEFAULT_SETTINGS: SettingsData = {
  ai: {
    personality: "friendly",
    responseLength: "balanced",
    languageStyle: "friendly",
    autoRecommendations: true,
    confidenceThreshold: "medium",
    memoryEnabled: true,
    contextWindow: 10,
    followUpSuggestions: true,
  },
  voice: {
    preferredLanguage: "hi",
    voiceId: "kiran",
    speechSpeed: "normal",
    autoSpeak: true,
    wakeWord: "Hey Kisan",
    noiseReduction: true,
    microphoneEnabled: true,
    speakerEnabled: true,
  },
  notifications: {
    weatherAlerts: true,
    marketAlerts: true,
    diseaseAlerts: true,
    schemeAlerts: true,
    appReminders: true,
    pushEnabled: true,
    emailEnabled: false,
    smsEnabled: false,
    quietHoursStart: "22:00",
    quietHoursEnd: "06:00",
    quietHoursEnabled: false,
  },
  appearance: {
    theme: "system",
    fontSize: "medium",
    contrast: "normal",
    animations: true,
    reduceMotion: false,
    compactMode: false,
  },
  farm: {
    farmLocation: "Nashik, Maharashtra",
    fieldCount: 4,
    cropTypes: ["Grapes", "Pomegranate", "Onion", "Soybean"],
    soilType: "black",
    preferredMarkets: ["Nashik APMC", "Pune APMC"],
    irrigationType: "drip",
    weatherLocation: "Nashik, Maharashtra",
    units: "metric",
  },
  privacy: {
    aiMemory: true,
    conversationHistory: true,
    dataSharing: false,
    analytics: true,
    exportData: false,
    deleteData: false,
    connectedDevices: 2,
    permissions: ["camera", "microphone", "location", "notifications"],
  },
  security: {
    twoFactorEnabled: false,
    lastPasswordChange: "2026-06-15",
    activeSessions: 2,
    trustedDevices: 2,
    backupCodesGenerated: false,
  },
  integrations: MOCK_INTEGRATIONS,
  about: MOCK_APP_INFO,
};

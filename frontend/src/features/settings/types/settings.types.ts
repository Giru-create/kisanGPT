// ─────────────────────────────────────────────────────────────────────────────
// settings.types.ts
// KisanGPT — Settings feature types
// ─────────────────────────────────────────────────────────────────────────────

export type SettingsCategory =
  | "ai"
  | "voice"
  | "notifications"
  | "appearance"
  | "farm"
  | "privacy"
  | "security"
  | "integrations"
  | "about";

export type ThemeMode = "light" | "dark" | "system";
export type FontSize = "small" | "medium" | "large";
export type Contrast = "normal" | "high";
export type ResponseLength = "concise" | "balanced" | "detailed";
export type LanguageStyle = "formal" | "friendly" | "simple";
export type ConfidenceThreshold = "low" | "medium" | "high";
export type VoiceSpeed = "slow" | "normal" | "fast";
export type Units = "metric" | "imperial";

export interface AISettings {
  personality: string;
  responseLength: ResponseLength;
  languageStyle: LanguageStyle;
  autoRecommendations: boolean;
  confidenceThreshold: ConfidenceThreshold;
  memoryEnabled: boolean;
  contextWindow: number;
  followUpSuggestions: boolean;
}

export interface VoiceSettings {
  preferredLanguage: string;
  voiceId: string;
  speechSpeed: VoiceSpeed;
  autoSpeak: boolean;
  wakeWord: string;
  noiseReduction: boolean;
  microphoneEnabled: boolean;
  speakerEnabled: boolean;
}

export interface NotificationSettings {
  weatherAlerts: boolean;
  marketAlerts: boolean;
  diseaseAlerts: boolean;
  schemeAlerts: boolean;
  appReminders: boolean;
  pushEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  quietHoursEnabled: boolean;
}

export interface AppearanceSettings {
  theme: ThemeMode;
  fontSize: FontSize;
  contrast: Contrast;
  animations: boolean;
  reduceMotion: boolean;
  compactMode: boolean;
}

export interface FarmSettingsData {
  farmLocation: string;
  fieldCount: number;
  cropTypes: string[];
  soilType: string;
  preferredMarkets: string[];
  irrigationType: string;
  weatherLocation: string;
  units: Units;
}

export interface PrivacySettings {
  aiMemory: boolean;
  conversationHistory: boolean;
  dataSharing: boolean;
  analytics: boolean;
  exportData: boolean;
  deleteData: boolean;
  connectedDevices: number;
  permissions: string[];
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  lastPasswordChange: string;
  activeSessions: number;
  trustedDevices: number;
  backupCodesGenerated: boolean;
}

export interface IntegrationItem {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  description: string;
  category: "cloud" | "weather" | "government" | "market" | "future";
}

export interface AppInfo {
  version: string;
  buildNumber: string;
  releaseDate: string;
  termsUrl: string;
  privacyUrl: string;
  supportEmail: string;
  feedbackUrl: string;
  licensesUrl: string;
}

export interface SettingsData {
  ai: AISettings;
  voice: VoiceSettings;
  notifications: NotificationSettings;
  appearance: AppearanceSettings;
  farm: FarmSettingsData;
  privacy: PrivacySettings;
  security: SecuritySettings;
  integrations: IntegrationItem[];
  about: AppInfo;
}

export interface SettingsSearchResult {
  category: SettingsCategory;
  categoryLabel: string;
  settingKey: string;
  label: string;
  description: string;
}

export interface SettingsUIState {
  activeCategory: SettingsCategory;
  searchQuery: string;
  isMobileNavOpen: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// index.ts
// KisanGPT — Settings feature barrel export
// ─────────────────────────────────────────────────────────────────────────────

export { SettingsPage } from "./components/SettingsPage";
export { SettingsSkeleton } from "./components/SettingsSkeleton";
export { SettingsSearch } from "./components/SettingsSearch";
export { SettingsSidebar } from "./components/SettingsSidebar";
export { SettingsCard } from "./components/SettingsCard";
export { SettingsSection } from "./components/SettingsSection";
export { ToggleSwitch } from "./components/ToggleSwitch";
export { SelectDropdown } from "./components/SelectDropdown";
export { RadioGroup } from "./components/RadioGroup";
export { AISettingsSection } from "./components/AISettingsSection";
export { VoiceSettingsSection } from "./components/VoiceSettingsSection";
export { NotificationSettingsSection } from "./components/NotificationSettingsSection";
export { AppearanceSettingsSection } from "./components/AppearanceSettingsSection";
export { FarmSettingsSection } from "./components/FarmSettingsSection";
export { PrivacySettingsSection } from "./components/PrivacySettingsSection";
export { SecuritySettingsSection } from "./components/SecuritySettingsSection";
export { IntegrationsSettingsSection } from "./components/IntegrationsSettingsSection";
export { AboutSection } from "./components/AboutSection";

export { useSettings } from "./hooks/useSettings";
export {
  useSettingsQuery,
  useUpdateSettingsMutation,
} from "./hooks/useSettingsData";

export {
  useSettingsStore,
  selectActiveCategory,
  selectSearchQuery,
  selectIsMobileNavOpen,
} from "./store/settingsStore";

export { settingsService } from "./services/settingsService";
export { settingsApi } from "./services/settingsApi";
export { settingsMockService } from "./services/settingsMock";

export type {
  SettingsCategory,
  SettingsData,
  AISettings,
  VoiceSettings,
  NotificationSettings,
  AppearanceSettings,
  FarmSettingsData,
  PrivacySettings,
  SecuritySettings,
  IntegrationItem,
  AppInfo,
  SettingsSearchResult,
  SettingsUIState,
} from "./types/settings.types";

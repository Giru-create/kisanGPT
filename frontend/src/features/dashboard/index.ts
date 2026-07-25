// ─────────────────────────────────────────────────────────────────────────────
// index.ts
// KisanGPT — Farmer Dashboard feature barrel export
// ─────────────────────────────────────────────────────────────────────────────

export { FarmerDashboard } from "./components/FarmerDashboard";
export { GreetingHeader } from "./components/GreetingHeader";
export { WeatherSummaryWidget } from "./components/WeatherSummaryWidget";
export { VoiceAssistantBar } from "./components/VoiceAssistantBar";
export { AIChatShortcutWidget } from "./components/AIChatShortcutWidget";
export { QuickActionsGrid } from "./components/QuickActionsGrid";
export { CropHealthWidget } from "./components/CropHealthWidget";
export { MandiPricesWidget } from "./components/MandiPricesWidget";
export { GovtSchemesWidget } from "./components/GovtSchemesWidget";
export { RecentActivityWidget } from "./components/RecentActivityWidget";
export { NotificationsWidget } from "./components/NotificationsWidget";
export { EmergencyAlertBanner } from "./components/EmergencyAlertBanner";
export { DashboardSkeleton } from "./components/DashboardSkeleton";

export { useDashboard } from "./hooks/useDashboard";
export { useDashboardStore } from "./store/dashboardStore";

export type {
  FarmerProfile,
  EmergencyAlert,
  CropFieldStatus,
  MandiPriceItem,
  GovtSchemeItem,
  ActivityItem,
  DashboardNotification,
  DashboardData,
  DashboardUIState,
} from "./types/dashboard.types";

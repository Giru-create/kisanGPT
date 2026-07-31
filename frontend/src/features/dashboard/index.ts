// ─────────────────────────────────────────────────────────────────────────────
// index.ts
// KisanGPT — Farmer Dashboard feature barrel export
// ─────────────────────────────────────────────────────────────────────────────

export { FarmerDashboard } from "./components/FarmerDashboard";
export { DashboardTopBar } from "./components/DashboardTopBar";
export { WeatherSummaryWidget } from "./components/WeatherSummaryWidget";
export { AIStrategicAdvisoryCard } from "./components/AIStrategicAdvisoryCard";
export { CropHealthCard } from "./components/CropHealthCard";
export { MarketTrendsCard } from "./components/MarketTrendsCard";
export { RecentAIChatsCard } from "./components/RecentAIChatsCard";
export { PriorityAlertsCard } from "./components/PriorityAlertsCard";
export { QuickActionsGrid } from "./components/QuickActionsGrid";
export { EmergencyAlertBanner } from "./components/EmergencyAlertBanner";
export { DashboardSkeleton } from "./components/DashboardSkeleton";

export { useDashboard } from "./hooks/useDashboard";
export { useDashboardQuery } from "./hooks/useDashboardData";
export { useDashboardStore } from "./store/dashboardStore";
export {
  DEFAULT_DASHBOARD_DATA,
  QUICK_PROMPTS,
} from "./constants/dashboard.constants";

export type {
  FarmerProfile,
  EmergencyAlert,
  CropFieldStatus,
  CropHealthItem,
  MandiPriceItem,
  MarketTrendItem,
  GovtSchemeItem,
  AIAdvisorChat,
  PriorityAlert,
  ActivityItem,
  DashboardNotification,
  DashboardData,
  DashboardUIState,
} from "./types/dashboard.types";

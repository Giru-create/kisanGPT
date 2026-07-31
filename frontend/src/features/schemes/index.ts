// ─────────────────────────────────────────────────────────────────────────────
// index.ts
// KisanGPT — Government Schemes feature barrel export
// ─────────────────────────────────────────────────────────────────────────────

// Page
export { SchemesPage } from "./components/SchemesPage";

// Components
export { HeroSection } from "./components/HeroSection";
export { AIRecommendationCard } from "./components/AIRecommendationCard";
export { SchemeExplorer } from "./components/SchemeExplorer";
export { SchemeCard } from "./components/SchemeCard";
export { SchemeDetailView } from "./components/SchemeDetailView";
export { ApplicationTracker } from "./components/ApplicationTracker";
export { AIAssistant } from "./components/AIAssistant";
export { SchemeNotifications } from "./components/SchemeNotifications";
export { SchemesEmpty } from "./components/SchemesEmpty";
export { SchemesSkeleton } from "./components/SchemesSkeleton";
export { SchemeError } from "./components/SchemeError";

// Hooks
export { useSchemes } from "./hooks/useSchemes";
export {
  useSchemesListQuery,
  useSchemeDetailQuery,
} from "./hooks/useSchemesQuery";

// Store
export {
  useSchemesStore,
  selectSchemesFilters,
  selectSelectedScheme,
  selectIsDetailOpen,
} from "./store/schemesStore";

// Services
export { schemesService } from "./services/schemesService";
export { schemesApi } from "./services/schemesApi";
export { schemesMockService } from "./services/schemesMock";

// Types
export type {
  Scheme,
  SchemeStatusBadge,
  SchemeListResponse,
  SchemeDetailResponse,
  SchemeFilters,
  SchemesUIState,
  HeroSchemeBrief,
  AIRecommendation,
  ApplicationStatus,
  ApplicationTrackerItem,
  NotificationType,
  SchemeNotification,
  AIQuestion,
  SavedScheme,
} from "./types/schemes.types";

// ─────────────────────────────────────────────────────────────────────────────
// index.ts
// KisanGPT — Government Schemes feature barrel export
// ─────────────────────────────────────────────────────────────────────────────

// Page
export { SchemesPage } from "./components/SchemesPage";

// Components
export { SchemeListCard } from "./components/SchemeListCard";
export { SchemeFiltersBar } from "./components/SchemeFiltersBar";
export { SchemeDetailPanel } from "./components/SchemeDetailPanel";
export { SchemeSkeleton } from "./components/SchemeSkeleton";
export { SchemeEmpty } from "./components/SchemeEmpty";
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
} from "./types/schemes.types";

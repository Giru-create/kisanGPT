// ─────────────────────────────────────────────────────────────────────────────
// index.ts
// KisanGPT — Farm Memory feature entry point
// ─────────────────────────────────────────────────────────────────────────────

// Page
export { MemoryPage } from "./components/MemoryPage";

// Components
export { HeroSection } from "./components/HeroSection";
export { MemorySummaryCard } from "./components/MemorySummaryCard";
export { AIMemoryInsights } from "./components/AIMemoryInsights";
export { MemorySearchBar } from "./components/MemorySearchBar";
export { MemoryTimeline } from "./components/MemoryTimeline";
export { MemoryCard } from "./components/MemoryCard";
export { MemoryDetailModal } from "./components/MemoryDetailModal";
export { PersonalizedRecommendations } from "./components/PersonalizedRecommendations";
export { AddMemoryModal } from "./components/AddMemoryModal";
export { MemoryEmpty } from "./components/MemoryEmpty";
export { MemoryError } from "./components/MemoryError";
export { MemorySkeleton } from "./components/MemorySkeleton";
export { MemoryHeader } from "./components/MemoryHeader";

// Hooks
export { useMemory } from "./hooks/useMemory";
export {
  useMemoryListQuery,
  useMemorySearchQuery,
  useCreateMemoryMutation,
  useDeleteMemoryMutation,
  useRecommendationsQuery,
} from "./hooks/useMemoryQuery";

// Store
export {
  useMemoryStore,
  selectSelectedCategory,
  selectIsAddModalOpen,
  selectSearchQuery,
  selectFilterTab,
  selectSelectedMemory,
  selectIsDetailModalOpen,
} from "./store/memoryStore";

// Services
export { memoryService } from "./services/memoryService";
export { memoryApi } from "./services/memoryApi";
export { memoryMockService } from "./services/memoryMock";

// Types
export type {
  MemoryCategory,
  MemoryMetrics,
  FarmMemoryItem,
  PersonalizedRecommendation,
  AddMemoryInput,
  MemoryImportance,
  MemorySource,
  FilterTab,
  MemoryFilters,
  MemoryHeroStats,
  AIMemoryInsight,
  MemoryCategoryConfig,
  MemoryTimelineGroup,
} from "./types/memory.types";

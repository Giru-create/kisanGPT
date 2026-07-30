// ─────────────────────────────────────────────────────────────────────────────
// index.ts
// KisanGPT — Farm Memory feature entry point
// ─────────────────────────────────────────────────────────────────────────────

// Page
export { MemoryPage } from "./components/MemoryPage";

// Components
export { MemoryCard } from "./components/MemoryCard";
export { MemoryCategoryFilter } from "./components/MemoryCategoryFilter";
export { MemoryTimeline } from "./components/MemoryTimeline";
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
} from "./types/memory.types";

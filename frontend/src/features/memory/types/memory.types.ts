// ─────────────────────────────────────────────────────────────────────────────
// memory.types.ts
// KisanGPT — Farm Memory feature types
// ─────────────────────────────────────────────────────────────────────────────

export type MemoryCategory =
  | "all"
  | "soil"
  | "crop_yield"
  | "disease_history"
  | "irrigation"
  | "fertilizer"
  | "weather_decisions"
  | "market_decisions"
  | "govt_schemes"
  | "voice_conversations"
  | "saved_ai_advice"
  | "custom_note";

export type MemoryImportance = "high" | "medium" | "low";

export type MemorySource = "chat" | "voice" | "manual" | "auto" | "scan";

export type FilterTab = "all" | "pinned" | "saved" | "recent";

export interface MemoryMetrics {
  ph?: number;
  nitrogen?: number;
  phosphorus?: number;
  potassium?: number;
  yield_quintals?: number;
  water_liters?: number;
  area_acres?: number;
}

export interface FarmMemoryItem {
  id: string;
  category: Exclude<MemoryCategory, "all">;
  title: string;
  description: string;
  timestamp: string; // ISO date string
  location?: string;
  cropName?: string;
  season?: string;
  metrics?: MemoryMetrics;
  tags?: string[];
  isVerified?: boolean;
  isPinned?: boolean;
  isSaved?: boolean;
  importance?: MemoryImportance;
  source?: MemorySource;
  relatedConversationId?: string;
  updatedAt?: string;
  aiExplanation?: string;
}

export interface PersonalizedRecommendation {
  id: string;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  category: string;
  actionLabel: string;
  targetRoute?: string;
  dateGenerated: string;
  basedOnMemories: string[]; // Memory IDs used as RAG context
}

export interface AddMemoryInput {
  category: Exclude<MemoryCategory, "all">;
  title: string;
  description: string;
  location?: string;
  cropName?: string;
  season?: string;
  metrics?: MemoryMetrics;
  tags?: string[];
}

export interface MemoryFilters {
  search: string;
  category: MemoryCategory;
  importance: MemoryImportance | null;
  source: MemorySource | null;
  crop: string | null;
  dateRange: "all" | "week" | "month" | "quarter" | "year";
  filterTab: FilterTab;
}

export interface MemoryHeroStats {
  totalMemories: number;
  recentUpdates: number;
  pinnedCount: number;
  savedCount: number;
  verifiedCount: number;
  categoryBreakdown: Array<{ category: string; count: number; label: string }>;
}

export interface AIMemoryInsight {
  id: string;
  type:
    | "recurring_issue"
    | "frequent_question"
    | "decision_pattern"
    | "crop_performance"
    | "seasonal_trend"
    | "suggested_improvement";
  title: string;
  description: string;
  confidence: number;
  relatedMemories: string[];
  actionable: boolean;
  actionLabel?: string;
  targetRoute?: string;
  icon: string;
}

export interface MemoryCategoryConfig {
  id: Exclude<MemoryCategory, "all">;
  label: string;
  labelHi: string;
  icon: string;
  color: string;
  bg: string;
  description: string;
}

export interface MemoryTimelineGroup {
  month: string;
  year: number;
  label: string;
  items: FarmMemoryItem[];
}

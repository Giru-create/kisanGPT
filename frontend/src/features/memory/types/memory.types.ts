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
  | "custom_note";

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

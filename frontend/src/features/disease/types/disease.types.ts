// ─────────────────────────────────────────────────────────────────────────────
// disease.types.ts
// KisanGPT — Crop Disease Detection feature types
// ─────────────────────────────────────────────────────────────────────────────

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

export type DiseaseSeverity = "low" | "medium" | "high" | "critical";

export type TreatmentType =
  "chemical" | "cultural" | "biological" | "mechanical";

export type TreatmentUrgency = "immediate" | "within_days" | "preventive";

// ---------------------------------------------------------------------------
// Treatment
// ---------------------------------------------------------------------------

export interface TreatmentRecommendation {
  type: TreatmentType;
  name: string;
  description: string;
  urgency: TreatmentUrgency;
}

// ---------------------------------------------------------------------------
// Diagnosis result
// ---------------------------------------------------------------------------

export interface DiagnosisResult {
  disease_name: string;
  crop: string;
  confidence: number;
  severity: DiseaseSeverity;
  description: string;
  is_healthy: boolean;
  treatments: TreatmentRecommendation[];
  prevention: string[];
  similar_diseases: string[];
  image_hash: string;
}

// ---------------------------------------------------------------------------
// History item
// ---------------------------------------------------------------------------

export interface DiagnosisHistoryItem {
  id: string;
  disease_name: string;
  crop: string;
  confidence: number;
  created_at: string;
}

// ---------------------------------------------------------------------------
// UI state (discriminated union)
// ---------------------------------------------------------------------------

export type DiseaseUIState =
  | { status: "idle" }
  | { status: "uploading"; fileName: string }
  | { status: "analyzing"; previewUrl: string }
  | { status: "success"; data: DiagnosisResult; previewUrl: string }
  | { status: "error"; message: string; previewUrl: string | null };

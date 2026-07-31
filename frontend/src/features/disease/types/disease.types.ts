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

export type DiseaseCategory =
  | "fungal"
  | "bacterial"
  | "viral"
  | "pest"
  | "nutrient_deficiency"
  | "environmental"
  | "healthy";

export type PlantPart =
  "leaf" | "stem" | "root" | "fruit" | "flower" | "seed" | "multiple";

export type SpreadRisk = "low" | "moderate" | "high" | "very_high";

export type DiagnosisStatus =
  "completed" | "in_progress" | "needs_review" | "archived";

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
// Enhanced Treatment (with dosage and timing)
// ---------------------------------------------------------------------------

export interface EnhancedTreatment {
  id: string;
  type: TreatmentType;
  name: string;
  description: string;
  urgency: TreatmentUrgency;
  dosage?: string;
  applicationMethod?: string;
  frequency?: string;
  waitingPeriod?: string;
  cost?: string;
  availability?: string;
}

// ---------------------------------------------------------------------------
// AI Explanation
// ---------------------------------------------------------------------------

export interface AIExplanation {
  whyDiagnosis: string;
  visibleSymptoms: string[];
  keyEvidence: string[];
  alternativePossibilities: string[];
  whenToSeekExpert: string;
}

// ---------------------------------------------------------------------------
// Related Information
// ---------------------------------------------------------------------------

export interface RelatedInfo {
  weatherInfluence: string;
  nearbyOutbreakAlerts: string;
  seasonalRisk: string;
  cropStageImpact: string;
  similarDiseases: string[];
}

// ---------------------------------------------------------------------------
// Diagnosis result (enhanced)
// ---------------------------------------------------------------------------

export interface DiagnosisResult {
  disease_name: string;
  scientific_name?: string;
  crop: string;
  confidence: number;
  severity: DiseaseSeverity;
  description: string;
  is_healthy: boolean;
  treatments: TreatmentRecommendation[];
  prevention: string[];
  similar_diseases: string[];
  image_hash: string;
  affected_part?: PlantPart;
  disease_category?: DiseaseCategory;
  spread_risk?: SpreadRisk;
  ai_summary?: string;
  ai_explanation?: AIExplanation;
  related_info?: RelatedInfo;
}

// ---------------------------------------------------------------------------
// History item (enhanced)
// ---------------------------------------------------------------------------

export interface DiagnosisHistoryItem {
  id: string;
  disease_name: string;
  crop: string;
  confidence: number;
  severity: DiseaseSeverity;
  status: DiagnosisStatus;
  created_at: string;
  thumbnail_url?: string;
  improvement_trend?: "improving" | "stable" | "worsening";
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

// ---------------------------------------------------------------------------
// Scanning step (for AI Analysis animation)
// ---------------------------------------------------------------------------

export interface ScanningStep {
  id: string;
  label: string;
  icon: string;
  duration: number;
  completed: boolean;
  active: boolean;
}

// ---------------------------------------------------------------------------
// Supported crop
// ---------------------------------------------------------------------------

export interface SupportedCrop {
  name: string;
  emoji: string;
  commonDiseases: string[];
}

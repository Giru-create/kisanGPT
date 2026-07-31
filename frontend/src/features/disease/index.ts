// ─────────────────────────────────────────────────────────────────────────────
// index.ts
// KisanGPT — Crop Disease Detection feature barrel export
// ─────────────────────────────────────────────────────────────────────────────

// Page
export { DiseaseDetectionPage } from "./components/DiseaseDetectionPage";

// Components
export { HeroSection } from "./components/HeroSection";
export { ImageCapture } from "./components/ImageCapture";
export { AIAnalysis } from "./components/AIAnalysis";
export { DiagnosisResultCard } from "./components/DiagnosisResultCard";
export { TreatmentPlan } from "./components/TreatmentPlan";
export { AIExplanationCard } from "./components/AIExplanationCard";
export { RelatedInfoCard } from "./components/RelatedInfoCard";
export { FollowUpActions } from "./components/FollowUpActions";
export { DiagnosisHistory } from "./components/DiagnosisHistory";
export { DiseaseEmpty } from "./components/DiseaseEmpty";
export { DiseaseSkeleton } from "./components/DiseaseSkeleton";
export { TreatmentList } from "./components/TreatmentList";
export { DetectionError } from "./components/DetectionError";

// Hooks
export { useDiseaseDetection } from "./hooks/useDiseaseDetection";
export { useDiseaseDetectionMutation } from "./hooks/useDiseaseMutation";

// Store
export {
  useDiseaseStore,
  selectDiseaseState,
  selectPreviewUrl,
} from "./store/diseaseStore";

// Services
export { diseaseService, validateFile } from "./services/diseaseService";
export { diseaseApi } from "./services/diseaseApi";
export { diseaseMockService } from "./services/diseaseMock";

// Types
export type {
  DiagnosisResult,
  DiseaseSeverity,
  TreatmentRecommendation,
  TreatmentType,
  TreatmentUrgency,
  DiagnosisHistoryItem,
  DiseaseUIState,
  DiseaseCategory,
  PlantPart,
  SpreadRisk,
  DiagnosisStatus,
  EnhancedTreatment,
  AIExplanation,
  RelatedInfo,
  ScanningStep,
  SupportedCrop,
} from "./types/disease.types";

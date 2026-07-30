// ─────────────────────────────────────────────────────────────────────────────
// index.ts
// KisanGPT — Crop Disease Detection feature barrel export
// ─────────────────────────────────────────────────────────────────────────────

// Page
export { DiseaseDetectionPage } from "./components/DiseaseDetectionPage";

// Components
export { ImageUploader } from "./components/ImageUploader";
export { ImagePreview } from "./components/ImagePreview";
export { DetectionResultCard } from "./components/DetectionResultCard";
export { TreatmentList } from "./components/TreatmentList";
export { DetectionSkeleton } from "./components/DetectionSkeleton";
export { DetectionError } from "./components/DetectionError";
export { DetectionEmpty } from "./components/DetectionEmpty";

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
} from "./types/disease.types";

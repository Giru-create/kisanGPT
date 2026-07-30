// ─────────────────────────────────────────────────────────────────────────────
// diseaseService.ts
// KisanGPT — Crop Disease Detection Unified Service Abstraction
// Decouples UI/hooks from backend API vs mock data sources
// ─────────────────────────────────────────────────────────────────────────────

import { diseaseApi } from "./diseaseApi";
import { diseaseMockService } from "./diseaseMock";
import type { DiagnosisResult } from "../types/disease.types";

export interface IDiseaseService {
  detect: (file: File) => Promise<DiagnosisResult>;
}

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export function validateFile(file: File): string | null {
  if (!ALLOWED_TYPES.has(file.type)) {
    return `Unsupported file type: ${file.type || "unknown"}. Please use JPEG, PNG, or WebP.`;
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMB = (file.size / 1024 / 1024).toFixed(1);
    return `File too large (${sizeMB}MB). Maximum size is 10MB.`;
  }
  return null;
}

function isMockMode(): boolean {
  return (
    process.env.NEXT_PUBLIC_USE_MOCK_API === undefined ||
    process.env.NEXT_PUBLIC_USE_MOCK_API === "true"
  );
}

export const diseaseService: IDiseaseService = {
  detect: async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      throw new Error(validationError);
    }

    if (isMockMode()) return diseaseMockService.detect(file);
    try {
      return await diseaseApi.detect(file);
    } catch (err) {
      console.warn("Disease API error, falling back to mock:", err);
      return diseaseMockService.detect(file);
    }
  },
};

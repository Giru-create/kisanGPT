// ─────────────────────────────────────────────────────────────────────────────
// useDiseaseMutation.ts
// KisanGPT — React Query mutation for disease detection upload
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useMutation } from "@tanstack/react-query";
import { diseaseService } from "../services/diseaseService";
import type { DiagnosisResult } from "../types/disease.types";

export function useDiseaseDetectionMutation() {
  return useMutation<DiagnosisResult, Error, File>({
    mutationFn: (file: File) => diseaseService.detect(file),
    mutationKey: ["disease", "detect"],
  });
}

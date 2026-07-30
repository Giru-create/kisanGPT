// ─────────────────────────────────────────────────────────────────────────────
// diseaseApi.ts
// KisanGPT — Crop Disease Detection API Client
// Handles multipart file upload to FastAPI /api/v1/disease/detect
// ─────────────────────────────────────────────────────────────────────────────

import type { DiagnosisResult } from "../types/disease.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api/v1";

export interface DiseaseUploadError {
  message: string;
  status: number;
}

export const diseaseApi = {
  detect: async (file: File): Promise<DiagnosisResult> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${BASE_URL}/disease/detect`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      let errorDetail = `Detection failed (${response.status})`;
      try {
        const errorData = await response.json();
        if (
          errorData &&
          typeof errorData === "object" &&
          "detail" in errorData
        ) {
          errorDetail = String(errorData.detail);
        }
      } catch {
        // response wasn't JSON
      }
      const error: DiseaseUploadError = {
        message: errorDetail,
        status: response.status,
      };
      throw error;
    }

    return response.json() as Promise<DiagnosisResult>;
  },
};

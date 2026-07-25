// ─────────────────────────────────────────────────────────────────────────────
// useDiseaseDetection.ts
// KisanGPT — Crop Disease Detection hook
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useCallback } from "react";
import { useDiseaseStore } from "../store/diseaseStore";
import type { DiagnosisResult } from "../types/disease.types";

// ---------------------------------------------------------------------------
// API call
// ---------------------------------------------------------------------------

async function detectDisease(file: File): Promise<DiagnosisResult> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/v1/disease/detect", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${await getToken()}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(
      error?.detail ?? `Detection failed (${response.status})`,
    );
  }

  return response.json() as Promise<DiagnosisResult>;
}

async function getToken(): Promise<string> {
  // Placeholder — will integrate with Firebase Auth in a later milestone
  return "";
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useDiseaseDetection() {
  const { setUploading, setAnalyzing, setSuccess, setError, reset } =
    useDiseaseStore();

  const detect = useCallback(
    async (file: File) => {
      const previewUrl = URL.createObjectURL(file);

      setUploading(file.name);

      // Simulate brief upload phase
      await new Promise((r) => setTimeout(r, 300));

      setAnalyzing(previewUrl);

      try {
        const result = await detectDisease(file);
        setSuccess(result, previewUrl);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Disease detection failed. Please try again.";
        setError(message);
      }
    },
    [setUploading, setAnalyzing, setSuccess, setError],
  );

  return { detect, reset };
}

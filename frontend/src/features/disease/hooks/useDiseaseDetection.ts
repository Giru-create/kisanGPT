// ─────────────────────────────────────────────────────────────────────────────
// useDiseaseDetection.ts
// KisanGPT — Crop Disease Detection hook
// Orchestrates React Query mutation + Zustand store for image upload/analysis
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useCallback } from "react";
import { useDiseaseStore } from "../store/diseaseStore";
import { useDiseaseDetectionMutation } from "./useDiseaseMutation";

export function useDiseaseDetection() {
  const { setUploading, setAnalyzing, setSuccess, setError, reset } =
    useDiseaseStore();

  const mutation = useDiseaseDetectionMutation();

  const detect = useCallback(
    async (file: File) => {
      const previewUrl = URL.createObjectURL(file);

      setUploading(file.name);

      // Brief upload phase for UX feedback
      await new Promise((r) => setTimeout(r, 300));

      setAnalyzing(previewUrl);

      mutation.mutate(file, {
        onSuccess: (result) => {
          setSuccess(result, previewUrl);
        },
        onError: (err) => {
          const message =
            err instanceof Error
              ? err.message
              : "Disease detection failed. Please try again.";
          setError(message);
        },
      });
    },
    [setUploading, setAnalyzing, setSuccess, setError, mutation],
  );

  return {
    detect,
    reset,
    isPending: mutation.isPending,
  };
}

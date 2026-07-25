// ─────────────────────────────────────────────────────────────────────────────
// diseaseStore.ts
// KisanGPT — Crop Disease Detection Zustand slice
// ─────────────────────────────────────────────────────────────────────────────

import { create } from "zustand";
import type { DiseaseUIState, DiagnosisResult } from "../types/disease.types";

// ---------------------------------------------------------------------------
// Store shape
// ---------------------------------------------------------------------------

interface DiseaseStore {
  /** Discriminated-union UI state */
  uiState: DiseaseUIState;

  /** Selected file reference */
  file: File | null;

  /** Preview object URL */
  previewUrl: string | null;

  // Actions
  setIdle: () => void;
  setUploading: (fileName: string) => void;
  setAnalyzing: (previewUrl: string) => void;
  setSuccess: (data: DiagnosisResult, previewUrl: string) => void;
  setError: (message: string) => void;
  setFile: (file: File) => void;
  reset: () => void;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useDiseaseStore = create<DiseaseStore>((set) => ({
  uiState: { status: "idle" },
  file: null,
  previewUrl: null,

  setIdle: () => set({ uiState: { status: "idle" } }),

  setUploading: (fileName) =>
    set({ uiState: { status: "uploading", fileName } }),

  setAnalyzing: (previewUrl) =>
    set({
      uiState: { status: "analyzing", previewUrl },
      previewUrl,
    }),

  setSuccess: (data, previewUrl) =>
    set({
      uiState: { status: "success", data, previewUrl },
      previewUrl,
    }),

  setError: (message) =>
    set((state) => ({
      uiState: {
        status: "error",
        message,
        previewUrl: state.previewUrl,
      },
    })),

  setFile: (file) => set({ file }),

  reset: () =>
    set({
      uiState: { status: "idle" },
      file: null,
      previewUrl: null,
    }),
}));

// ---------------------------------------------------------------------------
// Selectors
// ---------------------------------------------------------------------------

export const selectDiseaseState = (s: DiseaseStore) => s.uiState;
export const selectPreviewUrl = (s: DiseaseStore) => s.previewUrl;

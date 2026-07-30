// ─────────────────────────────────────────────────────────────────────────────
// diseaseStore.test.ts
// Unit tests for disease Zustand store
// ─────────────────────────────────────────────────────────────────────────────

import { describe, it, expect, beforeEach } from "vitest";
import { useDiseaseStore } from "../store/diseaseStore";
import type { DiagnosisResult } from "../types/disease.types";

const mockResult: DiagnosisResult = {
  disease_name: "Late Blight",
  crop: "Tomato",
  confidence: 0.92,
  severity: "high",
  description: "Fungal disease",
  is_healthy: false,
  treatments: [],
  prevention: [],
  similar_diseases: [],
  image_hash: "abc123",
};

describe("diseaseStore", () => {
  beforeEach(() => {
    useDiseaseStore.setState({
      uiState: { status: "idle" },
      file: null,
      previewUrl: null,
    });
  });

  it("has correct initial state", () => {
    const state = useDiseaseStore.getState();
    expect(state.uiState).toEqual({ status: "idle" });
    expect(state.file).toBeNull();
    expect(state.previewUrl).toBeNull();
  });

  it("setIdle resets to idle", () => {
    useDiseaseStore.getState().setError("Some error");
    useDiseaseStore.getState().setIdle();
    expect(useDiseaseStore.getState().uiState).toEqual({ status: "idle" });
  });

  it("setUploading sets uploading state", () => {
    useDiseaseStore.getState().setUploading("plant.jpg");
    const state = useDiseaseStore.getState();
    expect(state.uiState).toEqual({
      status: "uploading",
      fileName: "plant.jpg",
    });
  });

  it("setAnalyzing sets analyzing state and previewUrl", () => {
    useDiseaseStore.getState().setAnalyzing("blob:preview-url");
    const state = useDiseaseStore.getState();
    expect(state.uiState).toEqual({
      status: "analyzing",
      previewUrl: "blob:preview-url",
    });
    expect(state.previewUrl).toBe("blob:preview-url");
  });

  it("setSuccess sets success state with data", () => {
    useDiseaseStore.getState().setSuccess(mockResult, "blob:preview");
    const state = useDiseaseStore.getState();
    expect(state.uiState.status).toBe("success");
    if (state.uiState.status === "success") {
      expect(state.uiState.data).toEqual(mockResult);
      expect(state.uiState.previewUrl).toBe("blob:preview");
    }
  });

  it("setError sets error state with message and preserves previewUrl", () => {
    useDiseaseStore.getState().setAnalyzing("blob:preview");
    useDiseaseStore.getState().setError("Upload failed");
    const state = useDiseaseStore.getState();
    expect(state.uiState.status).toBe("error");
    if (state.uiState.status === "error") {
      expect(state.uiState.message).toBe("Upload failed");
      expect(state.uiState.previewUrl).toBe("blob:preview");
    }
  });

  it("setFile updates file reference", () => {
    const mockFile = new File(["test"], "test.jpg", { type: "image/jpeg" });
    useDiseaseStore.getState().setFile(mockFile);
    expect(useDiseaseStore.getState().file).toBe(mockFile);
  });

  it("reset clears all state", () => {
    const mockFile = new File(["test"], "test.jpg", { type: "image/jpeg" });
    useDiseaseStore.getState().setFile(mockFile);
    useDiseaseStore.getState().setSuccess(mockResult, "blob:preview");
    useDiseaseStore.getState().reset();
    const state = useDiseaseStore.getState();
    expect(state.uiState).toEqual({ status: "idle" });
    expect(state.file).toBeNull();
    expect(state.previewUrl).toBeNull();
  });
});

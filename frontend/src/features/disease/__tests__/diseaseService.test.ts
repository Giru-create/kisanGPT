// ─────────────────────────────────────────────────────────────────────────────
// diseaseService.test.ts
// Unit tests for diseaseService, diseaseApi, and diseaseMock
// ─────────────────────────────────────────────────────────────────────────────

import { describe, it, expect, vi, beforeEach } from "vitest";
import { diseaseService, validateFile } from "../services/diseaseService";
import { diseaseMockService } from "../services/diseaseMock";

describe("validateFile", () => {
  it("returns null for valid JPEG", () => {
    const file = new File(["x"], "photo.jpg", { type: "image/jpeg" });
    expect(validateFile(file)).toBeNull();
  });

  it("returns null for valid PNG", () => {
    const file = new File(["x"], "photo.png", { type: "image/png" });
    expect(validateFile(file)).toBeNull();
  });

  it("returns null for valid WebP", () => {
    const file = new File(["x"], "photo.webp", { type: "image/webp" });
    expect(validateFile(file)).toBeNull();
  });

  it("returns error for unsupported type", () => {
    const file = new File(["x"], "doc.pdf", { type: "application/pdf" });
    expect(validateFile(file)).toContain("Unsupported file type");
  });

  it("returns error for empty type", () => {
    const file = new File(["x"], "unknown");
    expect(validateFile(file)).toContain("Unsupported file type");
  });

  it("returns error for oversized file", () => {
    const bigBlob = new Blob([new ArrayBuffer(11 * 1024 * 1024)]);
    const file = new File([bigBlob], "big.jpg", { type: "image/jpeg" });
    expect(validateFile(file)).toContain("File too large");
  });
});

describe("diseaseMockService", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns mock diagnosis result", async () => {
    vi.useFakeTimers();
    const file = new File(["test"], "plant.jpg", { type: "image/jpeg" });
    const promise = diseaseMockService.detect(file);
    vi.advanceTimersByTime(3000);
    const result = await promise;
    expect(result).toBeDefined();
    expect(result.disease_name).toBeTruthy();
    expect(result.crop).toBeTruthy();
    expect(typeof result.confidence).toBe("number");
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
    expect(result.treatments).toBeInstanceOf(Array);
    expect(result.prevention).toBeInstanceOf(Array);
    expect(result.similar_diseases).toBeInstanceOf(Array);
    vi.useRealTimers();
  });

  it("returns high confidence for mock", async () => {
    vi.useFakeTimers();
    const file = new File(["test"], "plant.jpg", { type: "image/jpeg" });
    const promise = diseaseMockService.detect(file);
    vi.advanceTimersByTime(3000);
    const result = await promise;
    expect(result.confidence).toBeGreaterThan(0.8);
    vi.useRealTimers();
  });

  it("includes treatments in response", async () => {
    vi.useFakeTimers();
    const file = new File(["test"], "plant.jpg", { type: "image/jpeg" });
    const promise = diseaseMockService.detect(file);
    vi.advanceTimersByTime(3000);
    const result = await promise;
    expect(result.treatments.length).toBeGreaterThan(0);
    const treatment = result.treatments[0];
    expect(treatment?.name).toBeTruthy();
    expect(treatment?.description).toBeTruthy();
    expect(treatment?.type).toBeTruthy();
    expect(treatment?.urgency).toBeTruthy();
    vi.useRealTimers();
  });
});

describe("diseaseService", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("returns mock data by default (mock mode)", async () => {
    const file = new File(["test"], "plant.jpg", { type: "image/jpeg" });
    const result = await diseaseService.detect(file);
    expect(result).toBeDefined();
    expect(result.disease_name).toBeTruthy();
    expect(result.treatments).toBeInstanceOf(Array);
  });

  it("rejects unsupported file type", async () => {
    const file = new File(["test"], "doc.pdf", { type: "application/pdf" });
    await expect(diseaseService.detect(file)).rejects.toThrow(
      "Unsupported file type",
    );
  });

  it("rejects oversized file", async () => {
    const bigBlob = new Blob([new ArrayBuffer(11 * 1024 * 1024)]);
    const file = new File([bigBlob], "big.jpg", { type: "image/jpeg" });
    await expect(diseaseService.detect(file)).rejects.toThrow("File too large");
  });

  it("falls back to mock on API error", async () => {
    vi.stubEnv("NEXT_PUBLIC_USE_MOCK_API", "false");
    // Mock fetch to return error
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ detail: "Server error" }),
      }),
    );

    const file = new File(["test"], "plant.jpg", { type: "image/jpeg" });
    const result = await diseaseService.detect(file);
    // Should fall back to mock
    expect(result).toBeDefined();
    expect(result.disease_name).toBeTruthy();
  });
});

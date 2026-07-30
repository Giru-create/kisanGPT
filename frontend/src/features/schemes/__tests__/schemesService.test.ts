// ─────────────────────────────────────────────────────────────────────────────
// schemesService.test.ts
// Unit tests for schemesService, schemesApi, and schemesMock
// ─────────────────────────────────────────────────────────────────────────────

import { describe, it, expect, vi, beforeEach } from "vitest";
import { schemesService } from "../services/schemesService";
import { schemesMockService } from "../services/schemesMock";

describe("schemesMockService", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns list of schemes via mock service", async () => {
    vi.useFakeTimers();
    const promise = schemesMockService.list();
    vi.advanceTimersByTime(1000);
    const result = await promise;
    expect(result).toBeDefined();
    expect(result.schemes).toBeInstanceOf(Array);
    expect(result.schemes.length).toBeGreaterThan(0);
    expect(result.totalCount).toBeGreaterThan(0);
    vi.useRealTimers();
  });

  it("filters schemes by search keyword", async () => {
    vi.useFakeTimers();
    const promise = schemesMockService.list({ search: "PM-KISAN" });
    vi.advanceTimersByTime(1000);
    const result = await promise;
    expect(result.schemes.length).toBeGreaterThanOrEqual(1);
    expect(
      result.schemes.some((s) => s.title.toLowerCase().includes("pm-kisan")),
    ).toBe(true);
    vi.useRealTimers();
  });

  it("filters schemes by scheme type", async () => {
    vi.useFakeTimers();
    const promise = schemesMockService.list({ schemeType: "insurance" });
    vi.advanceTimersByTime(1000);
    const result = await promise;
    expect(result.schemes.length).toBeGreaterThanOrEqual(1);
    for (const scheme of result.schemes) {
      expect(scheme.schemeType).toBe("insurance");
    }
    vi.useRealTimers();
  });

  it("returns single scheme by id", async () => {
    vi.useFakeTimers();
    const promise = schemesMockService.get("pm-kisan");
    vi.advanceTimersByTime(1000);
    const result = await promise;
    expect(result.scheme.id).toBe("pm-kisan");
    expect(result.scheme.title).toContain("PM-KISAN");
    vi.useRealTimers();
  });

  it("throws for nonexistent scheme", async () => {
    vi.useFakeTimers();
    const promise = schemesMockService.get("nonexistent");
    vi.advanceTimersByTime(1000);
    await expect(promise).rejects.toThrow("Scheme not found");
    vi.useRealTimers();
  });

  it("paginates results", async () => {
    vi.useFakeTimers();
    const promise = schemesMockService.list({ page: 1, pageSize: 2 });
    vi.advanceTimersByTime(1000);
    const result = await promise;
    expect(result.schemes.length).toBeLessThanOrEqual(2);
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(2);
    vi.useRealTimers();
  });
});

describe("schemesService", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("returns mock data by default (mock mode)", async () => {
    const result = await schemesService.list();
    expect(result).toBeDefined();
    expect(result.schemes).toBeInstanceOf(Array);
    expect(result.schemes.length).toBeGreaterThan(0);
  });

  it("returns mock detail by default (mock mode)", async () => {
    const result = await schemesService.get("pm-kisan");
    expect(result.scheme.id).toBe("pm-kisan");
  });

  it("falls back to mock on API error", async () => {
    vi.stubEnv("NEXT_PUBLIC_USE_MOCK_API", "false");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ detail: "Server error" }),
      }),
    );

    const result = await schemesService.list();
    expect(result).toBeDefined();
    expect(result.schemes).toBeInstanceOf(Array);
  });
});

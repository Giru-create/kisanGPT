// ─────────────────────────────────────────────────────────────────────────────
// memoryService.test.ts
// Unit tests for Farm Memory service, mock, and store
// ─────────────────────────────────────────────────────────────────────────────

import { describe, it, expect, vi, beforeEach } from "vitest";
import { memoryService } from "../services/memoryService";
import { memoryMockService } from "../services/memoryMock";
import { useMemoryStore } from "../store/memoryStore";

describe("memoryMockService", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    memoryMockService._reset();
  });

  it("fetches list of farm memories via mock service", async () => {
    const memories = await memoryMockService.getMemories();
    expect(memories).toBeDefined();
    expect(memories.length).toBeGreaterThan(0);
    expect(memories[0]?.title).toBeDefined();
  });

  it("filters farm memories by category 'soil'", async () => {
    const soilMemories = await memoryMockService.getMemories("soil");
    expect(soilMemories).toBeDefined();
    expect(soilMemories.every((m) => m.category === "soil")).toBe(true);
  });

  it("creates a new memory", async () => {
    const newMemory = await memoryMockService.createMemory({
      category: "custom_note",
      title: "Test Memory",
      description: "Test description",
    });
    expect(newMemory.title).toBe("Test Memory");
    expect(newMemory.category).toBe("custom_note");
    expect(newMemory.id).toBeTruthy();
  });

  it("deletes a memory", async () => {
    const result = await memoryMockService.deleteMemory("mem-1");
    expect(result.detail).toContain("deleted");
  });

  it("searches memories by keyword", async () => {
    const results = await memoryMockService.searchMemories("soil");
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(
      results.some(
        (m) =>
          m.title.toLowerCase().includes("soil") ||
          m.description.toLowerCase().includes("soil"),
      ),
    ).toBe(true);
  });

  it("searches memories with category filter", async () => {
    const results = await memoryMockService.searchMemories("wheat", "soil");
    expect(results.every((m) => m.category === "soil")).toBe(true);
  });

  it("fetches personalized recommendations", async () => {
    const recs = await memoryMockService.getRecommendations();
    expect(recs).toBeDefined();
    expect(recs.length).toBeGreaterThan(0);
    expect(recs[0]?.title).toBeDefined();
  });
});

describe("memoryService", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    memoryMockService._reset();
  });

  it("returns mock data by default (mock mode)", async () => {
    const memories = await memoryService.getMemories();
    expect(memories).toBeDefined();
    expect(memories.length).toBeGreaterThan(0);
  });

  it("creates memory via mock by default", async () => {
    const newMemory = await memoryService.createMemory({
      category: "custom_note",
      title: "Test",
      description: "Test desc",
    });
    expect(newMemory.title).toBe("Test");
  });

  it("deletes memory via mock by default", async () => {
    const result = await memoryService.deleteMemory("mem-1");
    expect(result.detail).toContain("deleted");
  });

  it("searches memories via mock by default", async () => {
    const results = await memoryService.searchMemories("soil");
    expect(results.length).toBeGreaterThanOrEqual(1);
  });

  it("fetches recommendations via mock by default", async () => {
    const recs = await memoryService.getRecommendations();
    expect(recs.length).toBeGreaterThan(0);
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

    const memories = await memoryService.getMemories();
    expect(memories).toBeDefined();
    expect(memories.length).toBeGreaterThan(0);
  });
});

describe("memoryStore", () => {
  beforeEach(() => {
    useMemoryStore.getState().reset();
  });

  it("has correct initial state", () => {
    const state = useMemoryStore.getState();
    expect(state.selectedCategory).toBe("all");
    expect(state.isAddModalOpen).toBe(false);
    expect(state.searchQuery).toBe("");
  });

  it("setSelectedCategory updates category", () => {
    useMemoryStore.getState().setSelectedCategory("crop_yield");
    expect(useMemoryStore.getState().selectedCategory).toBe("crop_yield");
  });

  it("setAddModalOpen toggles modal", () => {
    useMemoryStore.getState().setAddModalOpen(true);
    expect(useMemoryStore.getState().isAddModalOpen).toBe(true);
    useMemoryStore.getState().setAddModalOpen(false);
    expect(useMemoryStore.getState().isAddModalOpen).toBe(false);
  });

  it("setSearchQuery updates search", () => {
    useMemoryStore.getState().setSearchQuery("soil test");
    expect(useMemoryStore.getState().searchQuery).toBe("soil test");
  });

  it("reset clears all state", () => {
    useMemoryStore.getState().setSelectedCategory("fertilizer");
    useMemoryStore.getState().setAddModalOpen(true);
    useMemoryStore.getState().setSearchQuery("test");
    useMemoryStore.getState().reset();
    const state = useMemoryStore.getState();
    expect(state.selectedCategory).toBe("all");
    expect(state.isAddModalOpen).toBe(false);
    expect(state.searchQuery).toBe("");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// memoryService.test.ts
// Unit tests for Farm Memory service and store
// ─────────────────────────────────────────────────────────────────────────────

import { describe, it, expect, vi, beforeEach } from "vitest";
import { memoryService } from "../services/memoryService";
import { useMemoryStore } from "../store/memoryStore";

describe("memoryService", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    useMemoryStore.getState().reset();
  });

  it("fetches list of farm memories via mock service", async () => {
    const memories = await memoryService.getMemories();

    expect(memories).toBeDefined();
    expect(memories.length).toBeGreaterThan(0);
    expect(memories[0]?.title).toBeDefined();
  });

  it("filters farm memories by category 'soil'", async () => {
    const soilMemories = await memoryService.getMemories("soil");

    expect(soilMemories).toBeDefined();
    expect(soilMemories.every((m) => m.category === "soil")).toBe(true);
  });

  it("fetches personalized recommendations", async () => {
    const recs = await memoryService.getRecommendations();

    expect(recs).toBeDefined();
    expect(recs.length).toBeGreaterThan(0);
    expect(recs[0]?.title).toBeDefined();
  });

  it("adds a new custom memory item", async () => {
    const newMemory = await memoryService.createMemory({
      category: "custom_note",
      title: "Soil Moisture Test",
      description: "Tested soil moisture in Plot 3.",
    });

    expect(newMemory).toBeDefined();
    expect(newMemory.title).toBe("Soil Moisture Test");
    expect(newMemory.category).toBe("custom_note");
  });

  it("manages Zustand memoryStore state correctly", () => {
    const store = useMemoryStore.getState();
    expect(store.selectedCategory).toBe("all");

    store.setSelectedCategory("crop_yield");
    expect(useMemoryStore.getState().selectedCategory).toBe("crop_yield");

    store.setAddModalOpen(true);
    expect(useMemoryStore.getState().isAddModalOpen).toBe(true);
  });
});

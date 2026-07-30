// ─────────────────────────────────────────────────────────────────────────────
// advisorService.test.ts
// Unit tests for advisorService, advisorApi, and advisorMock
// ─────────────────────────────────────────────────────────────────────────────

import { describe, it, expect, vi, beforeEach } from "vitest";
import { advisorService } from "../services/advisorService";
import { advisorMockService } from "../services/advisorMock";
import { advisorApi } from "../services/advisorApi";

describe("advisorMockService", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns mock agent response", async () => {
    vi.useFakeTimers();
    const promise = advisorMockService.sendAgentMessage({
      message: "Test question",
    });
    vi.advanceTimersByTime(1500);
    const response = await promise;
    expect(response).toBeDefined();
    expect(response.message).toBeTruthy();
    expect(response.plannedTools).toBeInstanceOf(Array);
    expect(response.toolResults).toBeInstanceOf(Array);
    vi.useRealTimers();
  });

  it("includes planned tools in response", async () => {
    vi.useFakeTimers();
    const promise = advisorMockService.sendAgentMessage({
      message: "Weather query",
    });
    vi.advanceTimersByTime(1500);
    const response = await promise;
    expect(response.plannedTools.length).toBeGreaterThan(0);
    vi.useRealTimers();
  });
});

describe("advisorService", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("returns mock data by default (mock mode)", async () => {
    const response = await advisorService.sendMessage({
      message: "Test question",
    });
    expect(response).toBeDefined();
    expect(response.message).toBeTruthy();
  });

  it("calls api when NOT in mock mode", async () => {
    vi.stubEnv("NEXT_PUBLIC_USE_MOCK_API", "false");
    const mockResponse = {
      message: "API response",
      plannedTools: ["weather_check"],
      toolResults: [],
    };
    const spy = vi
      .spyOn(advisorApi, "sendAgentMessage")
      .mockResolvedValue(mockResponse);

    const response = await advisorService.sendMessage({
      message: "Test question",
    });
    expect(spy).toHaveBeenCalled();
    expect(response.message).toBe("API response");
  });

  it("falls back to mock on API error", async () => {
    vi.stubEnv("NEXT_PUBLIC_USE_MOCK_API", "false");
    vi.spyOn(advisorApi, "sendAgentMessage").mockRejectedValue(
      new Error("Network error"),
    );

    const response = await advisorService.sendMessage({
      message: "Test question",
    });
    expect(response).toBeDefined();
    expect(response.message).toBeTruthy();
  });

  it("passes conversation ID to API", async () => {
    vi.stubEnv("NEXT_PUBLIC_USE_MOCK_API", "false");
    const spy = vi.spyOn(advisorApi, "sendAgentMessage").mockResolvedValue({
      message: "Reply",
      plannedTools: [],
      toolResults: [],
    });

    await advisorService.sendMessage({
      message: "Follow up",
      conversationId: "conv-123",
    });
    expect(spy).toHaveBeenCalledWith({
      message: "Follow up",
      conversationId: "conv-123",
    });
  });

  it("passes location options to API", async () => {
    vi.stubEnv("NEXT_PUBLIC_USE_MOCK_API", "false");
    const spy = vi.spyOn(advisorApi, "sendAgentMessage").mockResolvedValue({
      message: "Reply",
      plannedTools: [],
      toolResults: [],
    });

    await advisorService.sendMessage({
      message: "Weather here",
      lat: 29.15,
      lon: 76.5,
      city: "Karnal",
    });
    expect(spy).toHaveBeenCalledWith({
      message: "Weather here",
      lat: 29.15,
      lon: 76.5,
      city: "Karnal",
    });
  });
});

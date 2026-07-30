// ─────────────────────────────────────────────────────────────────────────────
// useAdvisorChat.test.ts
// Unit tests for useAdvisorChatMutation React Query hook
// ─────────────────────────────────────────────────────────────────────────────

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { useAdvisorChatMutation } from "../hooks/useAdvisorChat";
import { advisorService } from "../services/advisorService";

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      children,
    );
  };
};

describe("useAdvisorChatMutation", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("sends message and returns response on success", async () => {
    const mockResponse = {
      message: "AI reply",
      plannedTools: ["weather_check"],
      toolResults: [],
    };
    vi.spyOn(advisorService, "sendMessage").mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useAdvisorChatMutation(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ message: "Test question" });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.message).toBe("AI reply");
    expect(result.current.data?.plannedTools).toContain("weather_check");
  });

  it("sets error state on failure", async () => {
    vi.spyOn(advisorService, "sendMessage").mockRejectedValue(
      new Error("Network error"),
    );

    const { result } = renderHook(() => useAdvisorChatMutation(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ message: "Test question" });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error?.message).toBe("Network error");
  });

  it("is pending while request is in flight", async () => {
    vi.spyOn(advisorService, "sendMessage").mockReturnValue(
      new Promise(() => {}),
    );

    const { result } = renderHook(() => useAdvisorChatMutation(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ message: "Test question" });

    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });
  });

  it("prevents duplicate requests via mutation key", async () => {
    const spy = vi.spyOn(advisorService, "sendMessage").mockResolvedValue({
      message: "Reply",
      plannedTools: [],
      toolResults: [],
    });

    const { result } = renderHook(() => useAdvisorChatMutation(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ message: "First" });
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    result.current.mutate({ message: "Second" });
    await waitFor(() => {
      expect(result.current.data?.message).toBe("Reply");
    });

    expect(spy).toHaveBeenCalledTimes(2);
  });
});

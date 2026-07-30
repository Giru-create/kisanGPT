// ─────────────────────────────────────────────────────────────────────────────
// advisorStore.test.ts
// Unit tests for advisor Zustand store
// ─────────────────────────────────────────────────────────────────────────────

import { describe, it, expect, beforeEach } from "vitest";
import { useAdvisorStore } from "../store/advisorStore";
import type { ChatMessage } from "../types/advisor.types";

const mockUserMessage: ChatMessage = {
  id: "msg-u1",
  role: "user",
  content: "Test question",
  timestamp: "10:00 AM",
};

const mockAssistantMessage: ChatMessage = {
  id: "msg-a1",
  role: "assistant",
  content: "Test answer",
  timestamp: "10:01 AM",
};

describe("advisorStore", () => {
  beforeEach(() => {
    useAdvisorStore.setState({
      messages: [],
      inputValue: "",
      status: "idle",
      conversationId: null,
      errorMessage: null,
    });
  });

  it("has correct initial state", () => {
    const state = useAdvisorStore.getState();
    expect(state.messages).toEqual([]);
    expect(state.inputValue).toBe("");
    expect(state.status).toBe("idle");
    expect(state.conversationId).toBeNull();
    expect(state.errorMessage).toBeNull();
  });

  it("setInput updates input value", () => {
    useAdvisorStore.getState().setInput("hello");
    expect(useAdvisorStore.getState().inputValue).toBe("hello");
  });

  it("addUserMessage appends message and clears input", () => {
    useAdvisorStore.getState().setInput("test");
    useAdvisorStore.getState().addUserMessage(mockUserMessage);
    const state = useAdvisorStore.getState();
    expect(state.messages).toHaveLength(1);
    expect(state.messages[0]?.role).toBe("user");
    expect(state.inputValue).toBe("");
  });

  it("addAssistantMessage appends message and sets status to idle", () => {
    useAdvisorStore.getState().addUserMessage(mockUserMessage);
    useAdvisorStore.getState().setStatus("loading");
    useAdvisorStore.getState().addAssistantMessage(mockAssistantMessage);
    const state = useAdvisorStore.getState();
    expect(state.messages).toHaveLength(2);
    expect(state.messages[1]?.role).toBe("assistant");
    expect(state.status).toBe("idle");
  });

  it("setStatus updates status", () => {
    useAdvisorStore.getState().setStatus("loading");
    expect(useAdvisorStore.getState().status).toBe("loading");
    useAdvisorStore.getState().setStatus("streaming");
    expect(useAdvisorStore.getState().status).toBe("streaming");
  });

  it("setConversationId updates conversation id", () => {
    useAdvisorStore.getState().setConversationId("conv-abc");
    expect(useAdvisorStore.getState().conversationId).toBe("conv-abc");
  });

  it("setErrorMessage sets error status and message", () => {
    useAdvisorStore.getState().setErrorMessage("Network error");
    const state = useAdvisorStore.getState();
    expect(state.status).toBe("error");
    expect(state.errorMessage).toBe("Network error");
  });

  it("clearMessages resets messages, conversation, and status", () => {
    useAdvisorStore.getState().addUserMessage(mockUserMessage);
    useAdvisorStore.getState().setConversationId("conv-1");
    useAdvisorStore.getState().clearMessages();
    const state = useAdvisorStore.getState();
    expect(state.messages).toEqual([]);
    expect(state.conversationId).toBeNull();
    expect(state.status).toBe("idle");
  });

  it("reset clears all state", () => {
    useAdvisorStore.getState().addUserMessage(mockUserMessage);
    useAdvisorStore.getState().setInput("typing");
    useAdvisorStore.getState().setConversationId("conv-1");
    useAdvisorStore.getState().setErrorMessage("Error");
    useAdvisorStore.getState().reset();
    const state = useAdvisorStore.getState();
    expect(state.messages).toEqual([]);
    expect(state.inputValue).toBe("");
    expect(state.status).toBe("idle");
    expect(state.conversationId).toBeNull();
    expect(state.errorMessage).toBeNull();
  });

  it("addUserMessage clears errorMessage", () => {
    useAdvisorStore.getState().setErrorMessage("Previous error");
    useAdvisorStore.getState().addUserMessage(mockUserMessage);
    expect(useAdvisorStore.getState().errorMessage).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// voiceService.test.ts
// Unit tests for Voice Assistant service and mock fallback
// ─────────────────────────────────────────────────────────────────────────────

import { describe, it, expect, vi, beforeEach } from "vitest";
import { voiceService } from "../services/voiceService";
import { useVoiceStore } from "../store/voiceStore";

describe("voiceService", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    useVoiceStore.getState().reset();
  });

  it("converts audio blob to text via mock service", async () => {
    const dummyBlob = new Blob(["audio data"], { type: "audio/webm" });
    const stt = await voiceService.speechToText(dummyBlob, "hi-IN");

    expect(stt).toBeDefined();
    expect(stt.text).toBe("आज करनाल मंडी में गेहूं का क्या भाव है?");
    expect(stt.language).toBe("hi-IN");
  });

  it("handles voice chat query in Hindi", async () => {
    const chatResult = await voiceService.voiceChat(
      "मौसम कैसा रहेगा?",
      "hi-IN",
    );

    expect(chatResult).toBeDefined();
    expect(chatResult.response_text).toContain("करनाल");
    expect(chatResult.language).toBe("hi-IN");
  });

  it("handles voice chat query in English", async () => {
    const chatResult = await voiceService.voiceChat(
      "Will it rain tomorrow?",
      "en-US",
    );

    expect(chatResult).toBeDefined();
    expect(chatResult.response_text).toContain("rainfall");
    expect(chatResult.language).toBe("en-US");
  });

  it("manages Zustand voiceStore state correctly", () => {
    const store = useVoiceStore.getState();
    expect(store.language).toBe("hi-IN");

    store.setLanguage("pa-IN");
    expect(useVoiceStore.getState().language).toBe("pa-IN");

    store.addMessage({
      id: "test-1",
      role: "user",
      text: "Sat Sri Akal",
      timestamp: new Date(),
    });

    expect(useVoiceStore.getState().messages.length).toBe(1);
  });
});

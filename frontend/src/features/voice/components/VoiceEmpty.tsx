// ─────────────────────────────────────────────────────────────────────────────
// VoiceEmpty.tsx
// KisanGPT — Voice Assistant empty state
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React from "react";
import { Mic, MessageCircle } from "lucide-react";

export const VoiceEmpty: React.FC = () => {
  return (
    <div
      role="status"
      className="rounded-2xl border border-border bg-card p-6 flex flex-col items-center gap-3 text-center"
    >
      <div className="flex items-center gap-2 text-muted-foreground">
        <Mic size={20} aria-hidden="true" />
        <MessageCircle size={20} aria-hidden="true" />
      </div>
      <p className="text-sm font-medium text-foreground">
        Start a conversation
      </p>
      <p className="text-xs text-muted-foreground max-w-xs">
        Tap the microphone to speak, or type your question below. Ask about crop
        diseases, weather, market prices, and more.
      </p>
    </div>
  );
};

VoiceEmpty.displayName = "VoiceEmpty";

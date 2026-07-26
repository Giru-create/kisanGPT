// ─────────────────────────────────────────────────────────────────────────────
// VoiceInputBar.tsx
// KisanGPT — Text input bar for voice feature (fallback for no mic)
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React, { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface VoiceInputBarProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export const VoiceInputBar: React.FC<VoiceInputBarProps> = ({
  onSend,
  disabled = false,
}) => {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (trimmed && !disabled) {
      onSend(trimmed);
      setText("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 p-3 border border-border rounded-2xl bg-card"
    >
      <label htmlFor="voice-text-input" className="sr-only">
        Type your question
      </label>
      <input
        id="voice-text-input"
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your question..."
        disabled={disabled}
        className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
      />
      <Button
        type="submit"
        variant="primary"
        size="sm"
        disabled={!text.trim() || disabled}
        aria-label="Send message"
      >
        <Send size={14} />
      </Button>
    </form>
  );
};

VoiceInputBar.displayName = "VoiceInputBar";

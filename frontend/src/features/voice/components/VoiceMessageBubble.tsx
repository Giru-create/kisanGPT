// ─────────────────────────────────────────────────────────────────────────────
// VoiceMessageBubble.tsx
// KisanGPT — Individual voice message bubble
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React from "react";
import { User, Bot } from "lucide-react";
import type { VoiceMessage } from "../types/voice.types";

interface VoiceMessageBubbleProps {
  message: VoiceMessage;
}

export const VoiceMessageBubble: React.FC<VoiceMessageBubbleProps> = ({
  message,
}) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div
          className="shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center"
          aria-hidden="true"
        >
          <Bot size={16} className="text-primary" />
        </div>
      )}

      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
          isUser
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-muted text-foreground rounded-bl-md"
        }`}
      >
        <p>{message.text}</p>
        <time
          className={`block text-[10px] mt-1 ${
            isUser ? "text-primary-foreground/70" : "text-muted-foreground"
          }`}
          dateTime={message.timestamp.toISOString()}
        >
          {message.timestamp.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </time>
      </div>

      {isUser && (
        <div
          className="shrink-0 h-8 w-8 rounded-full bg-muted flex items-center justify-center"
          aria-hidden="true"
        >
          <User size={16} className="text-muted-foreground" />
        </div>
      )}
    </div>
  );
};

VoiceMessageBubble.displayName = "VoiceMessageBubble";

// ─────────────────────────────────────────────────────────────────────────────
// VoiceMessageBubble.tsx
// KisanGPT — Conversation Message Bubble & AI Response Card
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React, { useState } from "react";
import { User, Sparkles, Tag } from "lucide-react";
import { INTENT_LABELS } from "../constants/voice.constants";
import { VoicePlaybackPlayer } from "./VoicePlaybackPlayer";
import type { VoiceMessage } from "../types/voice.types";

interface VoiceMessageBubbleProps {
  message: VoiceMessage;
  onSelectAction?: (actionText: string) => void;
}

export const VoiceMessageBubble: React.FC<VoiceMessageBubbleProps> = ({
  message,
  onSelectAction,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const isUser = message.role === "user";

  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${
        isUser ? "ml-auto flex-row-reverse" : "mr-auto"
      }`}
    >
      {/* Avatar */}
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-xs ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-emerald-600 text-white"
        }`}
        aria-hidden="true"
      >
        {isUser ? <User size={18} /> : <Sparkles size={18} />}
      </div>

      {/* Message Body */}
      <div className="space-y-2">
        <div
          className={`p-4 rounded-2xl shadow-xs border ${
            isUser
              ? "bg-primary text-primary-foreground border-primary/20 rounded-tr-none"
              : "bg-card text-card-foreground border-border/60 rounded-tl-none"
          }`}
        >
          {/* Assistant Intent Badge */}
          {!isUser && message.intent && (
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 mb-2">
              <Tag size={12} />
              <span>{INTENT_LABELS[message.intent] || message.intent}</span>
            </div>
          )}

          {/* Text Content */}
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.text}
          </p>

          {/* Assistant Voice Playback Widget */}
          {!isUser && (
            <VoicePlaybackPlayer
              isPlaying={isPlaying}
              onPlayToggle={() => setIsPlaying(!isPlaying)}
            />
          )}

          {/* Timestamp */}
          <div
            className={`text-[10px] mt-2 font-medium ${
              isUser ? "text-primary-foreground/75 text-right" : "text-muted-foreground"
            }`}
          >
            {formattedTime}
          </div>
        </div>

        {/* Suggested Action Chips */}
        {!isUser && message.suggested_actions && message.suggested_actions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {message.suggested_actions.map((action, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectAction?.(action)}
                className="px-3 py-1.5 text-xs font-medium bg-muted/60 hover:bg-muted text-foreground rounded-full border border-border/50 transition-colors min-h-[36px]"
              >
                {action}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

VoiceMessageBubble.displayName = "VoiceMessageBubble";

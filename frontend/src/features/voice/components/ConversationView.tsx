"use client";

import React from "react";
import { motion } from "framer-motion";
import { User, Sparkles, Tag, Copy, Share2, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { INTENT_LABELS } from "../constants/voice.constants";
import type { VoiceMessage } from "../types/voice.types";

interface ConversationViewProps {
  messages: VoiceMessage[];
  onSelectAction?: (action: string) => void;
  onCopy?: (text: string) => void;
  onReplay?: (message: VoiceMessage) => void;
}

export const ConversationView: React.FC<ConversationViewProps> = ({
  messages,
  onSelectAction,
  onCopy,
  onReplay,
}) => {
  if (messages.length === 0) return null;

  return (
    <motion.section
      role="log"
      aria-label="Conversation"
      aria-live="polite"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.15 }}
      className="rounded-2xl border border-border bg-card p-4 shadow-sm"
    >
      <div className="space-y-4">
        {messages.map((msg, idx) => {
          const isUser = msg.role === "user";

          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.04 }}
              className={cn(
                "flex gap-2.5",
                isUser ? "justify-end" : "justify-start",
              )}
            >
              {/* Avatar */}
              {!isUser && (
                <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                  <Sparkles size={12} className="text-primary" />
                </div>
              )}

              {/* Message bubble */}
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl p-3.5",
                  isUser
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-muted rounded-bl-md",
                )}
              >
                {!isUser && msg.intent && (
                  <div className="flex items-center gap-1 mb-2">
                    <Tag size={10} className="text-primary" />
                    <span className="text-[9px] font-semibold text-primary">
                      {INTENT_LABELS[msg.intent] ?? msg.intent}
                    </span>
                  </div>
                )}

                <p
                  className={cn(
                    "text-sm leading-relaxed",
                    isUser ? "text-primary-foreground" : "text-foreground",
                  )}
                >
                  {msg.text}
                </p>

                {/* Confidence */}
                {msg.confidence !== undefined && (
                  <p className="text-[9px] mt-1.5 opacity-60">
                    Confidence: {Math.round(msg.confidence * 100)}%
                  </p>
                )}

                {/* Suggested actions */}
                {msg.suggested_actions && msg.suggested_actions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {msg.suggested_actions.map((action) => (
                      <button
                        key={action}
                        onClick={() => onSelectAction?.(action)}
                        className="text-[10px] px-2.5 py-1 rounded-full bg-background/80 border border-border hover:border-primary/30 transition-colors font-medium text-foreground"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                )}

                {/* Meta row */}
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border/30">
                  <span className="text-[9px] opacity-50">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <div className="flex items-center gap-1 ml-auto">
                    {!isUser && (
                      <>
                        <button
                          onClick={() => onReplay?.(msg)}
                          className="p-1 rounded hover:bg-background/50 transition-colors"
                          aria-label="Replay audio"
                        >
                          <Volume2 size={10} className="opacity-50" />
                        </button>
                        <button
                          onClick={() => onCopy?.(msg.text)}
                          className="p-1 rounded hover:bg-background/50 transition-colors"
                          aria-label="Copy text"
                        >
                          <Copy size={10} className="opacity-50" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => onCopy?.(msg.text)}
                      className="p-1 rounded hover:bg-background/50 transition-colors"
                      aria-label="Share"
                    >
                      <Share2 size={10} className="opacity-50" />
                    </button>
                  </div>
                </div>
              </div>

              {/* User avatar */}
              {isUser && (
                <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center shrink-0 mt-1">
                  <User size={12} className="text-primary-foreground" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
};

ConversationView.displayName = "ConversationView";

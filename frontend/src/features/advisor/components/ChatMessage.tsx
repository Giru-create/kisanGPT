"use client";

// ─────────────────────────────────────────────────────────────────────────────
// ChatMessage.tsx
// KisanGPT — Chat message bubble component (user & assistant)
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import {
  Brain,
  ChevronDown,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Share2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage as ChatMessageType } from "../types/advisor.types";

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const [isThinkingOpen, setIsThinkingOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (message.role === "user") {
    return (
      <div className="flex flex-col items-end gap-1.5">
        <div className="bg-muted px-5 py-3 rounded-2xl rounded-tr-none max-w-[85%] shadow-sm">
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>
        <span className="text-xs text-muted-foreground px-2">
          {message.timestamp}
        </span>
      </div>
    );
  }

  return (
    <div className="flex gap-4 group">
      {/* AI Avatar */}
      <div
        className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 shadow-md"
        aria-hidden="true"
      >
        <Brain size={20} className="text-primary" />
      </div>

      <div className="flex-1 space-y-3">
        {/* Thinking Block */}
        {message.thinkingSteps && message.thinkingSteps.length > 0 && (
          <details
            className="border border-border rounded-xl overflow-hidden bg-muted/30"
            open={isThinkingOpen}
            onToggle={(e) =>
              setIsThinkingOpen((e.target as HTMLDetailsElement).open)
            }
          >
            <summary className="flex items-center justify-between px-4 py-2 cursor-pointer list-none hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-2">
                <Brain size={16} className="text-primary animate-pulse" />
                <span className="text-sm font-medium text-muted-foreground">
                  Reasoning with CropGPT-4o...
                </span>
              </div>
              <ChevronDown
                size={16}
                className={cn(
                  "text-muted-foreground transition-transform",
                  isThinkingOpen && "rotate-180",
                )}
              />
            </summary>
            <div className="px-4 py-3 text-xs text-muted-foreground border-t border-border space-y-1.5 bg-background">
              {message.thinkingSteps.map((step) => (
                <p key={step.id}>{step.text}</p>
              ))}
            </div>
          </details>
        )}

        {/* Main Content */}
        <div className="space-y-3 text-foreground leading-relaxed text-sm">
          {message.content.split("\n\n").map((paragraph, i) => (
            <p
              key={i}
              dangerouslySetInnerHTML={{ __html: formatContent(paragraph) }}
            />
          ))}
        </div>

        {/* Sources */}
        {message.sources && message.sources.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {message.sources.map((source) => (
              <div key={source.id} className="group/tip relative">
                <span className="bg-muted px-2.5 py-1 rounded text-xs font-bold text-primary cursor-help border border-border">
                  Source: {source.title}
                </span>
                <div className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-foreground text-background text-xs rounded shadow-xl opacity-0 group-hover/tip:opacity-100 transition-opacity pointer-events-none z-50">
                  {source.tooltip}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 text-muted-foreground hover:text-primary transition-colors rounded-md"
            aria-label={isCopied ? "Copied" : "Copy message"}
          >
            <Copy size={16} />
          </button>
          <button
            type="button"
            className="p-1.5 text-muted-foreground hover:text-primary transition-colors rounded-md"
            aria-label="Helpful"
          >
            <ThumbsUp size={16} />
          </button>
          <button
            type="button"
            className="p-1.5 text-muted-foreground hover:text-primary transition-colors rounded-md"
            aria-label="Not helpful"
          >
            <ThumbsDown size={16} />
          </button>
          <button
            type="button"
            className="p-1.5 text-muted-foreground hover:text-primary transition-colors rounded-md"
            aria-label="Share"
          >
            <Share2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

function formatContent(text: string): string {
  // Bold: **text**
  let formatted = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  // Handle line breaks within paragraphs
  formatted = formatted.replace(/\n/g, "<br/>");
  return formatted;
}

ChatMessage.displayName = "ChatMessage";

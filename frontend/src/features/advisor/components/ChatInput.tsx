"use client";

// ─────────────────────────────────────────────────────────────────────────────
// ChatInput.tsx
// KisanGPT — Chat input area with voice button and attachments
// ─────────────────────────────────────────────────────────────────────────────

import React, { useRef, useEffect } from "react";
import { Send, Mic, ImageIcon, Paperclip, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSend,
  disabled = false,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 192)}px`;
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="p-4 bg-background/80 backdrop-blur-md border-t border-border">
      <div className="max-w-3xl mx-auto relative">
        {/* Floating Voice Button */}
        <div className="absolute -top-7 right-0 translate-y-1/2">
          <button
            type="button"
            className="w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all hover:bg-primary/90"
            aria-label="Voice input"
          >
            <Mic size={28} />
          </button>
        </div>

        {/* Input Container */}
        <div
          className={cn(
            "bg-card border border-border rounded-2xl shadow-sm transition-all",
            "focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary",
          )}
        >
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask KisanGPT about your crops, soil, or markets..."
            rows={1}
            disabled={disabled}
            className="w-full bg-transparent border-none focus:ring-0 resize-none min-h-[44px] max-h-48 text-sm py-3 px-4 custom-scrollbar placeholder:text-muted-foreground"
            aria-label="Chat message input"
          />

          {/* Action Bar */}
          <div className="flex items-center justify-between px-4 pb-3">
            <div className="flex gap-1">
              <button
                type="button"
                className="p-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors"
                aria-label="Attach image"
              >
                <ImageIcon size={18} />
              </button>
              <button
                type="button"
                className="p-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors"
                aria-label="Attach file"
              >
                <Paperclip size={18} />
              </button>
              <button
                type="button"
                className="p-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors"
                aria-label="Take photo"
              >
                <Camera size={18} />
              </button>
            </div>

            <button
              type="button"
              onClick={onSend}
              disabled={!value.trim() || disabled}
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                value.trim() && !disabled
                  ? "bg-primary text-primary-foreground hover:shadow-lg active:scale-90"
                  : "bg-muted text-muted-foreground cursor-not-allowed",
              )}
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-[11px] text-muted-foreground text-center mt-2">
          AI-generated content can be incorrect. Please verify critical
          agricultural decisions with experts.
        </p>
      </div>
    </div>
  );
};

ChatInput.displayName = "ChatInput";

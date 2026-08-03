"use client";

// ─────────────────────────────────────────────────────────────────────────────
// ChatInput.tsx
// KisanGPT — Chat input area with voice, image, camera, document support
// Includes character counter, send animation, and suggested prompts
// ─────────────────────────────────────────────────────────────────────────────

import React, { useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Mic,
  ImageIcon,
  Paperclip,
  Camera,
  X,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdvisorStore } from "../store/advisorStore";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onImageSelect?: (file: File) => void;
  onVoiceToggle?: () => void;
  disabled?: boolean;
}

const MAX_CHARS = 2000;

export const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSend,
  onImageSelect,
  onVoiceToggle,
  disabled = false,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { voiceStatus, imageUploadStatus, imagePreview, resetImageUpload } =
    useAdvisorStore();

  const isListening = voiceStatus === "listening";
  const isSending = disabled;
  const charCount = value.length;
  const isOverLimit = charCount > MAX_CHARS;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 192)}px`;
    }
  }, [value]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (value.trim() && !isOverLimit && !isSending) {
          onSend();
        }
      }
    },
    [value, isOverLimit, isSending, onSend],
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && onImageSelect) {
        onImageSelect(file);
      }
      e.target.value = "";
    },
    [onImageSelect],
  );

  const handleVoiceClick = useCallback(() => {
    if (onVoiceToggle) {
      onVoiceToggle();
    }
  }, [onVoiceToggle]);

  return (
    <div className="p-3 md:p-4 bg-background/80 backdrop-blur-md border-t border-border">
      <div className="relative">
        {/* Image Preview */}
        <AnimatePresence>
          {imagePreview && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="mb-3 relative inline-block"
            >
              <div className="relative rounded-xl overflow-hidden border border-border">
                <Image
                  src={imagePreview}
                  alt="Upload preview"
                  width={96}
                  height={96}
                  className="w-24 h-24 object-cover"
                  unoptimized
                />
                <button
                  type="button"
                  onClick={resetImageUpload}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-foreground/80 text-background flex items-center justify-center hover:bg-foreground transition-colors"
                  aria-label="Remove image"
                >
                  <X size={12} />
                </button>
              </div>
              {imageUploadStatus === "uploading" && (
                <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                  <Loader2 size={20} className="text-primary animate-spin" />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Voice Button */}
        <div className="absolute -top-7 right-0 translate-y-1/2 z-10">
          <motion.button
            type="button"
            onClick={handleVoiceClick}
            whileTap={{ scale: 0.9 }}
            className={cn(
              "w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all",
              isListening
                ? "bg-emerald-500 text-white animate-pulse"
                : "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105",
            )}
            aria-label={isListening ? "Stop listening" : "Start voice input"}
          >
            <Mic size={28} />
          </motion.button>
        </div>

        {/* Input Container */}
        <div
          className={cn(
            "bg-card border rounded-2xl shadow-sm transition-all",
            isOverLimit
              ? "border-red-500 focus-within:ring-2 focus-within:ring-red-500/20"
              : "border-border focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary",
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
            className="w-full bg-transparent border-none resize-none min-h-[44px] max-h-48 text-sm py-3 px-4 custom-scrollbar placeholder:text-muted-foreground"
            aria-label="Chat message input"
            aria-describedby="char-count"
          />

          {/* Action Bar */}
          <div className="flex items-center justify-between px-4 pb-3">
            <div className="flex gap-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                aria-hidden="true"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Attach image"
              >
                <ImageIcon size={18} />
              </button>
              <button
                type="button"
                className="p-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Attach file"
                disabled
                title="File attachment coming soon"
              >
                <Paperclip size={18} />
              </button>
              <button
                type="button"
                className="p-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Take photo"
                disabled
                title="Camera coming soon"
              >
                <Camera size={18} />
              </button>
            </div>

            <div className="flex items-center gap-3">
              {/* Character Counter */}
              {charCount > 0 && (
                <span
                  id="char-count"
                  className={cn(
                    "text-[11px] font-medium tabular-nums",
                    isOverLimit ? "text-red-500" : "text-muted-foreground",
                  )}
                >
                  {charCount.toLocaleString()}/{MAX_CHARS.toLocaleString()}
                </span>
              )}

              {/* Send Button */}
              <motion.button
                type="button"
                onClick={onSend}
                disabled={!value.trim() || disabled || isOverLimit}
                whileTap={{ scale: 0.9 }}
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                  value.trim() && !disabled && !isOverLimit
                    ? "bg-primary text-primary-foreground hover:shadow-lg active:scale-90"
                    : "bg-muted text-muted-foreground cursor-not-allowed",
                )}
                aria-label="Send message"
              >
                {isSending ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </motion.button>
            </div>
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

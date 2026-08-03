"use client";

// ─────────────────────────────────────────────────────────────────────────────
// ChatWindow.tsx
// KisanGPT — Main chat window container with streaming, skeletons, and smooth scroll
// ─────────────────────────────────────────────────────────────────────────────

import React, { useRef, useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAdvisor } from "../hooks/useAdvisor";
import { useAdvisorStore } from "../store/advisorStore";
import { ChatMessage } from "./ChatMessage";
import { TypingIndicator } from "./TypingIndicator";
import { SuggestedQuestions } from "./SuggestedQuestions";
import { EmptyState } from "./EmptyState";
import { ChatInput } from "./ChatInput";
import { VoiceInput } from "./VoiceInput";
import { ImageUpload } from "./ImageUpload";

export const ChatWindow: React.FC = () => {
  const {
    status,
    messages,
    inputValue,
    errorMessage,
    setInput,
    sendMessage,
    handleSuggestionClick,
    retry,
  } = useAdvisor();

  const {
    imageUploadStatus,
    imagePreview,
    setImagePreview,
    setImageUploadStatus,
  } = useAdvisorStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isImageUploadOpen, setIsImageUploadOpen] = useState(false);
  const [isAutoScroll, setIsAutoScroll] = useState(true);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (isAutoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, status, isAutoScroll]);

  // Detect when user scrolls up
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const { scrollTop, scrollHeight, clientHeight } = container;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
    setIsAutoScroll(isAtBottom);
  }, []);

  const handleSend = useCallback(() => {
    if (inputValue.trim()) {
      sendMessage(inputValue);
    }
  }, [inputValue, sendMessage]);

  const handleImageSelect = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
        setImageUploadStatus("preview");
      };
      reader.readAsDataURL(file);
      setIsImageUploadOpen(false);
    },
    [setImagePreview, setImageUploadStatus],
  );

  const handleVoiceSend = useCallback(
    (text: string) => {
      setInput(text);
      sendMessage(text);
      setIsVoiceOpen(false);
    },
    [setInput, sendMessage],
  );

  const isBusy = status === "loading" || status === "streaming";

  return (
    <div className="flex flex-col h-full">
      {/* Chat Canvas */}
      <section
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-3 md:px-4 pt-6 pb-4 custom-scrollbar"
      >
        <AnimatePresence mode="wait">
          {messages.length === 0 && status !== "error" ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <EmptyState onQuestionSelect={handleSuggestionClick} />
            </motion.div>
          ) : (
            <motion.div
              key="messages"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}

              {isBusy && <TypingIndicator />}

              {/* Error State */}
              {status === "error" && errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-destructive/30 bg-destructive/10 p-6 text-center flex flex-col items-center gap-3"
                >
                  <div className="p-3 rounded-2xl bg-destructive/20 text-destructive">
                    <AlertTriangle size={24} aria-hidden="true" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {errorMessage}
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<RefreshCcw size={14} aria-hidden="true" />}
                    onClick={retry}
                  >
                    Retry
                  </Button>
                </motion.div>
              )}

              {!isBusy &&
                messages.length > 0 &&
                messages.length % 2 === 0 &&
                status !== "error" && (
                  <div className="pt-4">
                    <SuggestedQuestions onSelect={handleSuggestionClick} />
                  </div>
                )}

              <div ref={messagesEndRef} />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Input Area */}
      <ChatInput
        value={inputValue}
        onChange={setInput}
        onSend={handleSend}
        onImageSelect={handleImageSelect}
        onVoiceToggle={() => setIsVoiceOpen(true)}
        disabled={isBusy}
      />

      {/* Voice Input Overlay */}
      <VoiceInput
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        onSend={handleVoiceSend}
      />

      {/* Image Upload Overlay */}
      <ImageUpload
        isOpen={isImageUploadOpen}
        onClose={() => setIsImageUploadOpen(false)}
        onImageSelect={handleImageSelect}
        isUploading={imageUploadStatus === "uploading"}
        uploadProgress={imagePreview ? 0 : 0}
      />
    </div>
  );
};

ChatWindow.displayName = "ChatWindow";

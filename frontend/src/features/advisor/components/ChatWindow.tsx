"use client";

// ─────────────────────────────────────────────────────────────────────────────
// ChatWindow.tsx
// KisanGPT — Main chat window container
// ─────────────────────────────────────────────────────────────────────────────

import React, { useRef, useEffect } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAdvisor } from "../hooks/useAdvisor";
import { ChatMessage } from "./ChatMessage";
import { TypingIndicator } from "./TypingIndicator";
import { SuggestedQuestions } from "./SuggestedQuestions";
import { EmptyState } from "./EmptyState";
import { ChatInput } from "./ChatInput";

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

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  const handleSend = () => {
    if (inputValue.trim()) {
      sendMessage(inputValue);
    }
  };

  const isBusy = status === "loading" || status === "streaming";

  return (
    <div className="flex flex-col h-full">
      {/* Chat Canvas */}
      <section className="flex-1 overflow-y-auto px-4 pt-6 pb-4 custom-scrollbar">
        {messages.length === 0 && status !== "error" ? (
          <EmptyState onQuestionSelect={handleSuggestionClick} />
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {isBusy && <TypingIndicator />}

            {/* Error State */}
            {status === "error" && errorMessage && (
              <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-6 text-center flex flex-col items-center gap-3">
                <div className="p-3 rounded-2xl bg-destructive/20 text-destructive">
                  <AlertTriangle size={24} aria-hidden="true" />
                </div>
                <p className="text-sm text-muted-foreground">{errorMessage}</p>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<RefreshCcw size={14} aria-hidden="true" />}
                  onClick={retry}
                >
                  Retry
                </Button>
              </div>
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
          </div>
        )}
      </section>

      {/* Input Area */}
      <ChatInput
        value={inputValue}
        onChange={setInput}
        onSend={handleSend}
        disabled={isBusy}
      />
    </div>
  );
};

ChatWindow.displayName = "ChatWindow";

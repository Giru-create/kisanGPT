"use client";

// ─────────────────────────────────────────────────────────────────────────────
// ChatWindow.tsx
// KisanGPT — Main chat window container
// ─────────────────────────────────────────────────────────────────────────────

import React, { useRef, useEffect } from "react";
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
    setInput,
    sendMessage,
    handleSuggestionClick,
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

  return (
    <div className="flex flex-col h-full">
      {/* Chat Canvas */}
      <section className="flex-1 overflow-y-auto px-4 pt-6 pb-4 custom-scrollbar">
        {messages.length === 0 ? (
          <EmptyState onQuestionSelect={handleSuggestionClick} />
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {status === "loading" || status === "streaming" ? (
              <TypingIndicator />
            ) : null}

            {messages.length > 0 && messages.length % 2 === 0 && (
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
        disabled={status === "loading" || status === "streaming"}
      />
    </div>
  );
};

ChatWindow.displayName = "ChatWindow";

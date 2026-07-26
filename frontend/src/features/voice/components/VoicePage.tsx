// ─────────────────────────────────────────────────────────────────────────────
// VoicePage.tsx
// KisanGPT — Voice Assistant top-level page assembly
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React, { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useVoice } from "../hooks/useVoice";
import { VoiceLanguageSelector } from "./VoiceLanguageSelector";
import { VoiceMessageBubble } from "./VoiceMessageBubble";
import { VoiceInputBar } from "./VoiceInputBar";
import { VoiceRecordButton } from "./VoiceRecordButton";
import { VoiceError } from "./VoiceError";
import { VoiceEmpty } from "./VoiceEmpty";

export const VoicePage: React.FC = () => {
  const {
    voiceState,
    language,
    messages,
    setLanguage,
    startListening,
    stopListening,
    sendText,
  } = useVoice();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const statusText = () => {
    switch (voiceState.status) {
      case "listening":
        return "Listening... Speak your query clearly";
      case "processing":
        return "Processing your request...";
      case "speaking":
        return "Playing response...";
      default:
        return "Tap microphone to speak or type below";
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 pb-10 pt-6 flex flex-col gap-4">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <Sparkles
                size={16}
                className="text-amber-500"
                aria-hidden="true"
              />
              <h1 className="text-xl font-bold text-foreground">
                Voice Assistant
              </h1>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {statusText()}
            </p>
          </div>

          <VoiceLanguageSelector selected={language} onSelect={setLanguage} />
        </div>

        <AnimatePresence mode="wait">
          {/* Loading */}
          {voiceState.status === "idle" && messages.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <VoiceEmpty />
            </motion.div>
          )}

          {/* Error */}
          {voiceState.status === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <VoiceError
                message={voiceState.message}
                onRetry={() => setLanguage(language)}
              />
            </motion.div>
          )}

          {/* Messages */}
          {messages.length > 0 && (
            <motion.div
              key="messages"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-3"
              role="log"
              aria-label="Conversation messages"
            >
              {messages.map((msg) => (
                <VoiceMessageBubble key={msg.id} message={msg} />
              ))}
              <div ref={messagesEndRef} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input area */}
        <div className="flex flex-col items-center gap-4 mt-auto">
          <VoiceRecordButton
            status={voiceState.status}
            onStart={startListening}
            onStop={stopListening}
          />
          <VoiceInputBar
            onSend={sendText}
            disabled={
              voiceState.status === "listening" ||
              voiceState.status === "processing"
            }
          />
        </div>
      </div>
    </main>
  );
};

VoicePage.displayName = "VoicePage";

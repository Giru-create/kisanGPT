"use client";

import React, { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Trash2, Settings } from "lucide-react";
import { useVoice } from "../hooks/useVoice";
import { HeroSection } from "./HeroSection";
import { VoiceInterface } from "./VoiceInterface";
import { ConversationView } from "./ConversationView";
import { LanguageSelector } from "./LanguageSelector";
import { QuickVoiceActions } from "./QuickVoiceActions";
import { AIContextPanel } from "./AIContextPanel";
import { VoiceSettings } from "./VoiceSettings";
import { VoiceEmpty } from "./VoiceEmpty";
import { VoiceSkeleton } from "./VoiceSkeleton";
import { VoiceError } from "./VoiceError";
import { VoiceInputBar } from "./VoiceInputBar";
import { LiveRegion } from "@/components/accessibility/LiveRegion";

export const VoicePage: React.FC = () => {
  const {
    voiceState,
    language,
    messages,
    volumeLevel,
    setLanguage,
    handleStartListening,
    handleStopListening,
    sendTextQuery,
    clearMessages,
  } = useVoice();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showSettings, setShowSettings] = React.useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const liveAnnouncement =
    voiceState.status === "listening"
      ? "Listening... Speak now"
      : voiceState.status === "processing"
        ? "Analyzing query..."
        : voiceState.status === "speaking"
          ? "KisanGPT is responding"
          : "";

  return (
    <section className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 pb-10 pt-6">
        <LiveRegion>{liveAnnouncement}</LiveRegion>

        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="ds-page-title">Voice Assistant</h1>
            <p className="ds-page-subtitle">
              Speak naturally, get expert farming advice
            </p>
          </div>
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <button
                type="button"
                onClick={clearMessages}
                aria-label="Clear chat history"
                className="p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <Trash2 size={16} />
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowSettings(!showSettings)}
              aria-label="Voice settings"
              className="p-2 rounded-xl text-muted-foreground hover:bg-accent transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <Settings size={16} />
            </button>
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {/* Error */}
          {voiceState.status === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-5"
            >
              <VoiceError
                code={voiceState.code}
                message={voiceState.message}
                onRetry={handleStartListening}
              />
            </motion.div>
          )}

          {/* Main content */}
          {voiceState.status !== "error" && (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-5"
            >
              {/* Hero */}
              <HeroSection
                language={language}
                voiceStatus={voiceState.status}
                onStartConversation={handleStartListening}
              />

              {/* Voice Interface */}
              <VoiceInterface
                voiceState={voiceState}
                language={language}
                volumeLevel={volumeLevel}
                onStartListening={handleStartListening}
                onStopListening={handleStopListening}
              />

              {/* Conversation or Empty */}
              {messages.length === 0 ? (
                <VoiceEmpty
                  language={language}
                  onSelectPrompt={(prompt) => sendTextQuery(prompt)}
                />
              ) : (
                <ConversationView
                  messages={messages}
                  onSelectAction={(action) => sendTextQuery(action)}
                  onCopy={(text) => navigator.clipboard?.writeText(text)}
                />
              )}

              {/* Processing skeleton */}
              {voiceState.status === "processing" && <VoiceSkeleton />}

              <div ref={messagesEndRef} />

              {/* Language Selector */}
              <LanguageSelector selected={language} onSelect={setLanguage} />

              {/* Quick Actions */}
              <QuickVoiceActions
                onSelectAction={(prompt) => sendTextQuery(prompt)}
              />

              {/* AI Context */}
              <AIContextPanel />

              {/* Settings (toggle) */}
              {showSettings && <VoiceSettings />}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sticky Voice Input Bar */}
        <footer className="sticky bottom-0 z-30 mt-4">
          <VoiceInputBar
            voiceState={voiceState}
            language={language}
            onStartListening={handleStartListening}
            onStopListening={handleStopListening}
            onSendText={sendTextQuery}
          />
        </footer>
      </div>
    </section>
  );
};

VoicePage.displayName = "VoicePage";

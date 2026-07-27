// ─────────────────────────────────────────────────────────────────────────────
// VoicePage.tsx
// KisanGPT — Voice Assistant Main Page Component
// Multilingual mobile-first voice assistant page
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React, { useEffect } from "react";
import { Mic, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useVoice } from "../hooks/useVoice";
import { VoiceLanguageSelector } from "./VoiceLanguageSelector";
import { VoiceMessageBubble } from "./VoiceMessageBubble";
import { VoiceInputBar } from "./VoiceInputBar";
import { VoiceEmpty } from "./VoiceEmpty";
import { VoiceError } from "./VoiceError";
import { VoiceSkeleton } from "./VoiceSkeleton";
import { LiveRegion } from "@/components/accessibility/LiveRegion";

export const VoicePage: React.FC = () => {
  const {
    voiceState,
    language,
    messages,
    setLanguage,
    handleStartListening,
    handleStopListening,
    sendTextQuery,
    clearMessages,
  } = useVoice();

  // Scroll to bottom when messages update
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
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
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-background text-foreground">
      <LiveRegion>{liveAnnouncement}</LiveRegion>

      {/* Header Bar */}
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border/60 px-4 py-3 flex items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            aria-label="Back to Dashboard"
            className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Mic size={18} />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight leading-none">
                Voice Assistant
              </h1>
              <p className="text-[11px] font-medium text-muted-foreground mt-0.5">
                KisanGPT Multilingual AI
              </p>
            </div>
          </div>
        </div>

        {/* Right Controls: Language Selector & Clear Chat */}
        <div className="flex items-center gap-2">
          <VoiceLanguageSelector selected={language} onSelect={setLanguage} />
          {messages.length > 0 && (
            <button
              type="button"
              onClick={clearMessages}
              aria-label="Clear chat history"
              className="p-2 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </header>

      {/* Main Conversation Feed */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4 max-w-3xl mx-auto w-full">
        {voiceState.status === "error" && (
          <VoiceError
            code={voiceState.code}
            message={voiceState.message}
            onRetry={handleStartListening}
          />
        )}

        {messages.length === 0 ? (
          <VoiceEmpty
            language={language}
            onSelectPrompt={(promptText) => sendTextQuery(promptText)}
          />
        ) : (
          messages.map((msg) => (
            <VoiceMessageBubble
              key={msg.id}
              message={msg}
              onSelectAction={(action) => sendTextQuery(action)}
            />
          ))
        )}

        {voiceState.status === "processing" && <VoiceSkeleton />}

        <div ref={messagesEndRef} />
      </main>

      {/* Sticky Bottom Voice Input Bar */}
      <footer className="sticky bottom-0 z-30">
        <VoiceInputBar
          voiceState={voiceState}
          language={language}
          onStartListening={handleStartListening}
          onStopListening={handleStopListening}
          onSendText={sendTextQuery}
        />
      </footer>
    </div>
  );
};

VoicePage.displayName = "VoicePage";

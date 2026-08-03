"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Trash2, Settings, AlertCircle } from "lucide-react";
import { useVoice } from "../hooks/useVoice";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
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
import type { VoiceLanguage } from "../types/voice.types";

function speechLangCode(lang: VoiceLanguage): string {
  return lang;
}

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

  const speechRecognition = useSpeechRecognition();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [useBrowserSpeech, setUseBrowserSpeech] = useState(false);
  const transcriptSentRef = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (
      speechRecognition.isSupported &&
      speechRecognition.transcript.trim() &&
      !speechRecognition.isListening &&
      !transcriptSentRef.current
    ) {
      transcriptSentRef.current = true;
      sendTextQuery(speechRecognition.transcript.trim());
      speechRecognition.resetTranscript();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    speechRecognition.isSupported,
    speechRecognition.transcript,
    speechRecognition.isListening,
    sendTextQuery,
    speechRecognition.resetTranscript,
  ]);

  useEffect(() => {
    if (speechRecognition.isListening) {
      transcriptSentRef.current = false;
    }
  }, [speechRecognition.isListening]);

  const handleBrowserStartListening = useCallback(() => {
    if (speechRecognition.isListening) return;
    setUseBrowserSpeech(true);
    speechRecognition.startListening(speechLangCode(language));
  }, [speechRecognition, language]);

  const handleBrowserStopListening = useCallback(() => {
    speechRecognition.stopListening();
  }, [speechRecognition]);

  const liveAnnouncement =
    voiceState.status === "listening"
      ? "Listening... Speak now"
      : voiceState.status === "processing"
        ? "Analyzing query..."
        : voiceState.status === "speaking"
          ? "KisanGPT is responding"
          : "";

  const browserUnsupported =
    !speechRecognition.isSupported && typeof navigator !== "undefined";

  return (
    <section className="bg-background">
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
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

        {/* Browser unsupported notice */}
        {browserUnsupported && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm"
          >
            <AlertCircle
              size={18}
              className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <div>
              <p className="font-semibold text-foreground">
                Speech recognition not supported
              </p>
              <p className="text-muted-foreground mt-0.5 text-xs">
                Your browser doesn&apos;t support speech recognition. You can
                still type your questions below or try Chrome/Edge for voice
                input.
              </p>
            </div>
          </div>
        )}

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
                onRetry={
                  useBrowserSpeech
                    ? handleBrowserStartListening
                    : handleStartListening
                }
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
                voiceStatus={
                  speechRecognition.isListening
                    ? "listening"
                    : voiceState.status
                }
                onStartConversation={
                  speechRecognition.isSupported
                    ? handleBrowserStartListening
                    : handleStartListening
                }
              />

              {/* Voice Interface */}
              <VoiceInterface
                voiceState={
                  speechRecognition.isListening
                    ? { status: "listening", volumeLevel: 0.5 }
                    : voiceState
                }
                language={language}
                volumeLevel={speechRecognition.isListening ? 0.5 : volumeLevel}
                onStartListening={
                  speechRecognition.isSupported
                    ? handleBrowserStartListening
                    : handleStartListening
                }
                onStopListening={
                  speechRecognition.isSupported
                    ? handleBrowserStopListening
                    : handleStopListening
                }
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
            voiceState={
              speechRecognition.isListening
                ? { status: "listening", volumeLevel: 0.5 }
                : voiceState
            }
            language={language}
            onStartListening={
              speechRecognition.isSupported
                ? handleBrowserStartListening
                : handleStartListening
            }
            onStopListening={
              speechRecognition.isSupported
                ? handleBrowserStopListening
                : handleStopListening
            }
            onSendText={sendTextQuery}
          />
        </footer>
      </div>
    </section>
  );
};

VoicePage.displayName = "VoicePage";

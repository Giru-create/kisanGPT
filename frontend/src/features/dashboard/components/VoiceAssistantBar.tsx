"use client";

// ─────────────────────────────────────────────────────────────────────────────
// VoiceAssistantBar.tsx
// KisanGPT — Section 8: Multilingual Hands-Free Voice Assistant Floating Bar
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import Link from "next/link";
import { Mic, MicOff, Volume2, Sparkles, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useVoice } from "@/features/voice/hooks/useVoice";
import { VOICE_LANGUAGES } from "@/features/voice/constants/voice.constants";

export const VoiceAssistantBar: React.FC = () => {
  const {
    voiceState,
    language,
    setLanguage,
    handleStartListening,
    handleStopListening,
  } = useVoice();

  const isListening = voiceState.status === "listening";
  const isProcessing = voiceState.status === "processing";

  const toggleListening = () => {
    if (isListening) {
      handleStopListening();
    } else if (!isProcessing) {
      handleStartListening();
    }
  };

  const langLabel =
    VOICE_LANGUAGES.find((l) => l.code === language)?.label ?? "Hindi";

  return (
    <section
      role="region"
      aria-label="Hands-free Voice Assistant"
      className="relative overflow-hidden rounded-2xl border border-primary/30 bg-card p-4 sm:p-5 shadow-md"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left Info Column */}
        <div className="flex items-center gap-3.5 w-full sm:w-auto">
          <div className="relative shrink-0">
            <Button
              variant="primary"
              size="lg"
              onClick={toggleListening}
              disabled={isProcessing}
              aria-label={
                isListening
                  ? "Stop voice assistant listening"
                  : isProcessing
                    ? "Processing voice query..."
                    : "Start voice assistant listening in " + langLabel
              }
              aria-pressed={isListening}
              className={`h-14 w-14 min-h-[56px] min-w-[56px] rounded-full p-0 flex items-center justify-center transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                isListening
                  ? "bg-red-600 hover:bg-red-700 ring-4 ring-red-500/30 scale-105"
                  : isProcessing
                    ? "bg-amber-500 hover:bg-amber-600"
                    : "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
              }`}
            >
              {isListening ? (
                <MicOff
                  size={24}
                  className="text-white motion-safe:animate-pulse"
                  aria-hidden="true"
                />
              ) : (
                <Mic size={24} className="text-white" aria-hidden="true" />
              )}
            </Button>
            {isListening && (
              <span
                aria-hidden="true"
                className="absolute -top-1 -right-1 flex h-4 w-4 pointer-events-none"
              >
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500" />
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <Sparkles
                size={16}
                className="text-amber-500 shrink-0"
                aria-hidden="true"
              />
              <h2 className="font-extrabold text-base text-foreground leading-tight">
                KisanGPT Voice Assistant
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">
              {isListening
                ? "Listening... Speak your crop query clearly"
                : isProcessing
                  ? "Processing query..."
                  : "Tap microphone to speak in " + langLabel}
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-border/40">
          <div
            role="group"
            aria-label="Select voice language"
            className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl"
          >
            <Volume2
              size={16}
              className="text-muted-foreground ml-2 hidden sm:inline shrink-0"
              aria-hidden="true"
            />
            {VOICE_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => setLanguage(lang.code)}
                aria-label={`Select ${lang.label} language for voice interaction`}
                aria-pressed={language === lang.code}
                className={`px-3.5 py-2.5 text-xs font-bold rounded-lg transition-all min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  language === lang.code
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          <Link
            href="/voice"
            aria-label="Open full Voice Assistant screen"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl px-3 py-2.5 min-h-[48px] shrink-0"
          >
            Full View <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
};

VoiceAssistantBar.displayName = "VoiceAssistantBar";

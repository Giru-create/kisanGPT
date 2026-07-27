// ─────────────────────────────────────────────────────────────────────────────
// FloatingVoiceBar.tsx
// KisanGPT — Persistent Bottom Floating Voice Assistant Bar
// Mobile-first accessible bar docked at the bottom of core app pages
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React from "react";
import { Mic, X, MessageSquare, Globe } from "lucide-react";
import Link from "next/link";
import { useVoice } from "../hooks/useVoice";
import { VOICE_LANGUAGES, STATUS_LABELS } from "../constants/voice.constants";

export const FloatingVoiceBar: React.FC = () => {
  const {
    voiceState,
    language,
    isFloatingOpen,
    setFloatingOpen,
    handleStartListening,
    handleStopListening,
    setLanguage,
  } = useVoice();

  const isListening = voiceState.status === "listening";
  const isSpeaking = voiceState.status === "speaking";
  const labels = STATUS_LABELS[language] || STATUS_LABELS["hi-IN"];

  const currentLangObj =
    VOICE_LANGUAGES.find((l) => l.code === language) || VOICE_LANGUAGES[0];

  const toggleMic = () => {
    if (isListening) {
      handleStopListening();
    } else {
      handleStartListening();
    }
  };

  return (
    <div
      role="region"
      aria-label="Floating Voice Assistant"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:w-96 z-50 transition-all duration-300"
    >
      <div className="relative overflow-hidden rounded-3xl bg-background/90 backdrop-blur-md border border-border/80 shadow-xl p-3 flex items-center justify-between gap-3">
        {/* Left: Language & Status */}
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <button
            type="button"
            onClick={() => {
              const nextIndex =
                (VOICE_LANGUAGES.findIndex((l) => l.code === language) + 1) %
                VOICE_LANGUAGES.length;
              const nextLang = VOICE_LANGUAGES[nextIndex]?.code || "hi-IN";
              setLanguage(nextLang);
            }}
            aria-label={`Current language: ${currentLangObj?.label}. Click to switch.`}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-muted/60 text-[11px] font-bold text-foreground hover:bg-muted transition-colors min-h-[36px]"
          >
            <Globe size={13} className="text-muted-foreground" />
            <span>{currentLangObj?.nativeLabel}</span>
          </button>

          <div className="flex flex-col truncate">
            <span className="text-xs font-bold text-foreground truncate">
              KisanGPT Voice
            </span>
            <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 truncate">
              {isListening
                ? labels.listening
                : isSpeaking
                  ? labels.speaking
                  : labels.idle}
            </span>
          </div>
        </div>

        {/* Right Actions: Mic trigger & Link to Full /voice page */}
        <div className="flex items-center gap-2">
          <Link
            href="/voice"
            aria-label="Open Voice Assistant Page"
            className="p-2.5 rounded-full bg-muted/60 text-muted-foreground hover:text-foreground transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
          >
            <MessageSquare size={18} />
          </Link>

          <button
            type="button"
            onClick={toggleMic}
            aria-label={isListening ? "Stop microphone" : "Start microphone"}
            className={`flex items-center justify-center w-11 h-11 rounded-full text-white shadow-md transition-transform min-w-[44px] min-h-[44px] ${
              isListening
                ? "bg-emerald-600 animate-pulse scale-105"
                : "bg-primary hover:scale-105"
            }`}
          >
            <Mic size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

FloatingVoiceBar.displayName = "FloatingVoiceBar";

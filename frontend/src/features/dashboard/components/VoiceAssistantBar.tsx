"use client";

// ─────────────────────────────────────────────────────────────────────────────
// VoiceAssistantBar.tsx
// KisanGPT — Section 8: Multilingual Hands-Free Voice Assistant Floating Bar
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import { Mic, MicOff, Volume2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface VoiceAssistantBarProps {
  onVoiceTrigger?: () => void;
}

export const VoiceAssistantBar: React.FC<VoiceAssistantBarProps> = ({
  onVoiceTrigger,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<"Hindi" | "Punjabi" | "English">("Hindi");

  const toggleListening = () => {
    setIsListening((prev) => !prev);
    if (onVoiceTrigger) onVoiceTrigger();
  };

  return (
    <section
      role="region"
      aria-label="Hands-free Voice Assistant"
      className="relative overflow-hidden rounded-2xl border border-primary/30 bg-card p-4 shadow-md"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left Info Column */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative shrink-0">
            <Button
              variant="primary"
              size="lg"
              onClick={toggleListening}
              aria-label={
                isListening
                  ? "Stop voice assistant listening"
                  : "Start voice assistant listening in " + selectedLanguage
              }
              aria-pressed={isListening}
              className={`h-14 w-14 rounded-full p-0 flex items-center justify-center transition-all ${
                isListening
                  ? "bg-red-600 hover:bg-red-700 ring-4 ring-red-500/30 scale-105"
                  : "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
              }`}
            >
              {isListening ? (
                <MicOff size={24} className="text-white motion-safe:animate-pulse" />
              ) : (
                <Mic size={24} className="text-white" />
              )}
            </Button>
            {isListening && (
              <span
                aria-hidden="true"
                className="absolute -top-1 -right-1 flex h-4 w-4"
              >
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500" />
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-500" aria-hidden="true" />
              <h2 className="font-bold text-base text-foreground leading-tight">
                KisanGPT Voice Assistant
              </h2>
            </div>
            <p className="text-xs text-muted-foreground">
              {isListening
                ? "Listening... Speak your query clearly"
                : "Tap microphone to speak in " + selectedLanguage}
            </p>
          </div>
        </div>

        {/* Right Language Controls */}
        <div className="flex items-center gap-1.5 bg-muted/60 p-1 rounded-xl w-full sm:w-auto justify-center">
          <Volume2 size={14} className="text-muted-foreground ml-2 hidden sm:inline" />
          {(["Hindi", "Punjabi", "English"] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang)}
              aria-label={`Select ${lang} language for voice interaction`}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all min-h-[36px] ${
                selectedLanguage === lang
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

VoiceAssistantBar.displayName = "VoiceAssistantBar";

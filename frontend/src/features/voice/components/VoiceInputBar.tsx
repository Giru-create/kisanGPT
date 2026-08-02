// ─────────────────────────────────────────────────────────────────────────────
// VoiceInputBar.tsx
// KisanGPT — Voice Page Interactive Input & Mic Bar
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React, { useState } from "react";
import { Send } from "lucide-react";
import { VoiceRecordButton } from "./VoiceRecordButton";
import { VoiceWaveform } from "./VoiceWaveform";
import { STATUS_LABELS } from "../constants/voice.constants";
import type { VoiceUIState, VoiceLanguage } from "../types/voice.types";

interface VoiceInputBarProps {
  voiceState: VoiceUIState;
  language: VoiceLanguage;
  onStartListening: () => void;
  onStopListening: () => void;
  onSendText: (text: string) => void;
}

export const VoiceInputBar: React.FC<VoiceInputBarProps> = ({
  voiceState,
  language,
  onStartListening,
  onStopListening,
  onSendText,
}) => {
  const [text, setText] = useState("");
  const isListening = voiceState.status === "listening";
  const isSpeaking = voiceState.status === "speaking";

  const labels = STATUS_LABELS[language] || STATUS_LABELS["hi-IN"];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendText(text.trim());
    setText("");
  };

  return (
    <div className="w-full bg-background/95 border-t border-border/60 backdrop-blur-md p-4 space-y-4 shadow-lg">
      {/* Waveform / Status visualizer */}
      {(isListening || isSpeaking) && (
        <div className="flex flex-col items-center justify-center gap-2">
          <VoiceWaveform isListening={isListening} isSpeaking={isSpeaking} />
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 animate-pulse">
            {isListening ? labels.listening : labels.speaking}
          </span>
        </div>
      )}

      {/* Main hero mic button area */}
      <div className="flex flex-col items-center justify-center space-y-2">
        <VoiceRecordButton
          voiceState={voiceState}
          onStart={onStartListening}
          onStop={onStopListening}
        />
        <span className="text-xs font-medium text-muted-foreground">
          {isListening ? labels.stopListening : labels.idle}
        </span>
      </div>

      {/* Text fallback input */}
      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 max-w-lg mx-auto pt-1"
      >
        <input
          type="text"
          value={text}
          aria-label="Type your question"
          onChange={(e) => setText(e.target.value)}
          placeholder={
            language === "hi-IN"
              ? "या यहां टाइप करें..."
              : language === "pa-IN"
                ? "ਜਾਂ ਇੱਥੇ ਟਾਈਪ ਕਰੋ..."
                : "Or type your question here..."
          }
          className="flex-1 px-4 py-2.5 rounded-full bg-muted/50 border border-border/60 text-xs font-medium text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          aria-label="Send query"
          className="flex items-center justify-center w-11 h-11 rounded-full bg-primary text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs hover:scale-105 min-w-[44px] min-h-[44px]"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

VoiceInputBar.displayName = "VoiceInputBar";

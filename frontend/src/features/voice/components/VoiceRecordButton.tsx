// ─────────────────────────────────────────────────────────────────────────────
// VoiceRecordButton.tsx
// KisanGPT — Large Accessible Microphone Recording Button
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React from "react";
import { Mic, MicOff, Square, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import type { VoiceUIState } from "../types/voice.types";

interface VoiceRecordButtonProps {
  voiceState: VoiceUIState;
  onStart: () => void;
  onStop: () => void;
  disabled?: boolean;
}

export const VoiceRecordButton: React.FC<VoiceRecordButtonProps> = ({
  voiceState,
  onStart,
  onStop,
  disabled = false,
}) => {
  const isListening = voiceState.status === "listening";
  const isProcessing = voiceState.status === "processing";
  const isSpeaking = voiceState.status === "speaking";

  const getAriaLabel = () => {
    if (isListening) return "Stop recording audio";
    if (isProcessing) return "Processing voice query...";
    if (isSpeaking) return "Stop playback";
    return "Start voice recording";
  };

  const handleClick = () => {
    if (disabled || isProcessing) return;
    if (isListening) {
      onStop();
    } else {
      onStart();
    }
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer Pulse Ring 1 */}
      {isListening && (
        <motion.span
          className="absolute inset-0 rounded-full bg-emerald-500/20"
          animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Outer Pulse Ring 2 */}
      {isListening && (
        <motion.span
          className="absolute inset-0 rounded-full bg-emerald-500/30"
          animate={{ scale: [1, 1.25, 1], opacity: [0.8, 0.2, 0.8] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Hero 72px x 72px Button */}
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || isProcessing}
        aria-label={getAriaLabel()}
        aria-pressed={isListening}
        className={`relative z-10 flex items-center justify-center w-18 h-18 sm:w-20 sm:h-20 rounded-full shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary/40 focus:ring-offset-2 ${
          isListening
            ? "bg-emerald-600 text-white shadow-emerald-500/30 scale-105"
            : isProcessing
              ? "bg-amber-500 text-white cursor-wait"
              : isSpeaking
                ? "bg-primary text-primary-foreground animate-pulse"
                : "bg-primary text-primary-foreground hover:scale-105 active:scale-95 hover:shadow-primary/25"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {isListening ? (
          <Square size={28} className="fill-current" />
        ) : isProcessing ? (
          <Loader2 size={32} className="animate-spin" />
        ) : isSpeaking ? (
          <MicOff size={30} />
        ) : (
          <Mic size={32} />
        )}
      </button>
    </div>
  );
};

VoiceRecordButton.displayName = "VoiceRecordButton";

"use client";

// ─────────────────────────────────────────────────────────────────────────────
// VoiceInput.tsx
// KisanGPT — Voice input overlay with waveform visualization
// Beautiful recording, thinking, and speaking states
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, X, Loader2, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdvisorStore } from "../store/advisorStore";

interface VoiceInputProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (text: string) => void;
}

const WAVE_BARS = [16, 28, 42, 24, 38, 54, 30, 46, 20, 36, 48, 22];

export const VoiceInput: React.FC<VoiceInputProps> = ({
  isOpen,
  onClose,
  onSend,
}) => {
  const { voiceStatus, voiceVolume, voiceTranscript, resetVoice } =
    useAdvisorStore();

  const isListening = voiceStatus === "listening";
  const isThinking = voiceStatus === "thinking";
  const isSpeaking = voiceStatus === "speaking";

  const handleClose = () => {
    resetVoice();
    onClose();
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      if (voiceTranscript) {
        onSend(voiceTranscript);
      }
      resetVoice();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-6 right-6 p-3 rounded-full bg-muted hover:bg-muted/80 transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center"
            aria-label="Close voice input"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col items-center gap-8 max-w-sm w-full px-6">
            {/* Status Label */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h2 className="text-xl font-bold text-foreground mb-1">
                {isListening
                  ? "Listening..."
                  : isThinking
                    ? "Thinking..."
                    : isSpeaking
                      ? "Speaking..."
                      : "Tap to Start"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {isListening
                  ? "Speak now, I'm listening"
                  : isThinking
                    ? "Processing your request"
                    : isSpeaking
                      ? "Playing AI response"
                      : "Hold the button to talk"}
              </p>
            </motion.div>

            {/* Waveform Visualization */}
            <div
              role="img"
              aria-label={
                isListening
                  ? "Recording audio waveform"
                  : isSpeaking
                    ? "Playing audio waveform"
                    : "Waveform visualization"
              }
              className="flex items-center justify-center gap-1.5 h-16"
            >
              {WAVE_BARS.map((height, i) => {
                const activeMultiplier = isListening
                  ? Math.max(0.3, voiceVolume * 1.5)
                  : isSpeaking
                    ? 0.8
                    : 0.2;
                const barHeight = Math.max(
                  8,
                  Math.min(56, height * activeMultiplier),
                );

                return (
                  <motion.span
                    key={i}
                    className={cn(
                      "w-1.5 rounded-full transition-colors",
                      isListening
                        ? "bg-emerald-500"
                        : isSpeaking
                          ? "bg-primary"
                          : "bg-muted-foreground/30",
                    )}
                    animate={{
                      height: barHeight,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                      repeat: isListening || isSpeaking ? Infinity : 0,
                      repeatType: "reverse",
                      duration: 0.3 + (i % 4) * 0.1,
                    }}
                  />
                );
              })}
            </div>

            {/* Transcript Display */}
            {voiceTranscript && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full p-4 rounded-xl bg-muted/50 border border-border"
              >
                <p className="text-sm text-foreground leading-relaxed">
                  {voiceTranscript}
                </p>
              </motion.div>
            )}

            {/* Control Button */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={handleVoiceToggle}
              className={cn(
                "w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all",
                isListening
                  ? "bg-emerald-500 text-white animate-pulse"
                  : isThinking
                    ? "bg-amber-500 text-white"
                    : isSpeaking
                      ? "bg-primary text-primary-foreground"
                      : "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105",
              )}
              aria-label={isListening ? "Stop listening" : "Start listening"}
            >
              {isThinking ? (
                <Loader2 size={32} className="animate-spin" />
              ) : isSpeaking ? (
                <Volume2 size={32} />
              ) : (
                <Mic size={32} />
              )}
            </motion.button>

            {/* Hint */}
            <p className="text-xs text-muted-foreground text-center">
              {isListening
                ? "Tap anywhere or the button to stop"
                : "Press and hold or tap to start recording"}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

VoiceInput.displayName = "VoiceInput";

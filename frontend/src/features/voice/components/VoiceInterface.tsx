"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { STATUS_LABELS } from "../constants/voice.constants";
import type { VoiceUIState, VoiceLanguage } from "../types/voice.types";

interface VoiceInterfaceProps {
  voiceState: VoiceUIState;
  language: VoiceLanguage;
  volumeLevel: number;
  onStartListening: () => void;
  onStopListening: () => void;
}

export const VoiceInterface: React.FC<VoiceInterfaceProps> = ({
  voiceState,
  language,
  volumeLevel,
  onStartListening,
  onStopListening,
}) => {
  const isListening = voiceState.status === "listening";
  const isProcessing = voiceState.status === "processing";
  const isSpeaking = voiceState.status === "speaking";
  const isError = voiceState.status === "error";
  const labels = STATUS_LABELS[language] || STATUS_LABELS["hi-IN"];

  const statusLabel = isListening
    ? labels.listening
    : isProcessing
      ? labels.processing
      : isSpeaking
        ? labels.speaking
        : isError
          ? voiceState.message
          : labels.idle;

  return (
    <motion.section
      role="region"
      aria-label="Voice Interface"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
      className="rounded-2xl border border-border bg-card p-8 shadow-sm"
    >
      <div className="flex flex-col items-center gap-6">
        {/* Waveform visualization */}
        <div className="flex items-center justify-center gap-1 h-12">
          {Array.from({ length: 24 }).map((_, i) => {
            const height = isListening
              ? 12 + Math.sin(Date.now() / 200 + i * 0.5) * volumeLevel * 36
              : isSpeaking
                ? 12 + Math.sin(Date.now() / 300 + i * 0.3) * 24
                : 4;
            return (
              <motion.div
                key={i}
                className={cn(
                  "w-1 rounded-full transition-all",
                  isListening
                    ? "bg-primary"
                    : isSpeaking
                      ? "bg-emerald-500"
                      : isProcessing
                        ? "bg-amber-400"
                        : "bg-muted",
                )}
                animate={{
                  height: Math.max(4, height),
                  opacity:
                    isListening || isSpeaking ? 0.8 + volumeLevel * 0.2 : 0.3,
                }}
                transition={{ duration: 0.15, ease: "easeOut" }}
              />
            );
          })}
        </div>

        {/* Microphone button */}
        <div className="relative">
          {/* Pulse rings */}
          <AnimatePresence>
            {isListening && (
              <>
                <motion.div
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                  className="absolute inset-0 rounded-full bg-primary/20"
                />
                <motion.div
                  initial={{ scale: 1, opacity: 0.3 }}
                  animate={{ scale: 2, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeOut",
                    delay: 0.3,
                  }}
                  className="absolute inset-0 rounded-full bg-primary/15"
                />
              </>
            )}
          </AnimatePresence>

          {/* Main mic button */}
          <motion.button
            onClick={isListening ? onStopListening : onStartListening}
            disabled={isProcessing}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "relative z-10 h-24 w-24 rounded-full flex items-center justify-center transition-all shadow-lg",
              isListening
                ? "bg-primary text-primary-foreground shadow-primary/30"
                : isProcessing
                  ? "bg-amber-500 text-white shadow-amber-500/30"
                  : isSpeaking
                    ? "bg-emerald-500 text-white shadow-emerald-500/30"
                    : isError
                      ? "bg-red-500 text-white shadow-red-500/30"
                      : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20",
            )}
            aria-label={isListening ? labels.stopListening : labels.tapToSpeak}
          >
            {isProcessing ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles size={32} />
              </motion.div>
            ) : isListening ? (
              <MicOff size={32} />
            ) : (
              <Mic size={32} />
            )}
          </motion.button>
        </div>

        {/* Status text */}
        <motion.p
          key={statusLabel}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "text-sm font-semibold text-center",
            isListening
              ? "text-primary"
              : isSpeaking
                ? "text-emerald-600"
                : isProcessing
                  ? "text-amber-600"
                  : isError
                    ? "text-red-600"
                    : "text-muted-foreground",
          )}
        >
          {statusLabel}
        </motion.p>
      </div>
    </motion.section>
  );
};

VoiceInterface.displayName = "VoiceInterface";

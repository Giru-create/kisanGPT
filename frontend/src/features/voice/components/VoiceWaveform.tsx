// ─────────────────────────────────────────────────────────────────────────────
// VoiceWaveform.tsx
// KisanGPT — Animated Audio Waveform Visualizer
// Responsive waveform reacting to listening/speaking states with reduced motion fallback
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React from "react";
import { motion } from "framer-motion";

interface VoiceWaveformProps {
  isListening?: boolean;
  isSpeaking?: boolean;
  volumeLevel?: number;
}

export const VoiceWaveform: React.FC<VoiceWaveformProps> = ({
  isListening = false,
  isSpeaking = false,
  volumeLevel = 0.5,
}) => {
  const bars = [16, 28, 42, 24, 38, 54, 30, 46, 20, 36, 48, 22];

  return (
    <div
      aria-label={
        isListening
          ? "Recording audio..."
          : isSpeaking
            ? "Playing AI response..."
            : "Waveform indicator"
      }
      role="img"
      className="flex items-center justify-center gap-1.5 h-12 px-4 py-2 bg-muted/40 rounded-full border border-border/30 backdrop-blur-sm"
    >
      {bars.map((height, i) => {
        const activeMultiplier = isListening
          ? Math.max(0.3, volumeLevel * 1.5)
          : isSpeaking
            ? 0.8
            : 0.2;
        const barHeight = Math.max(6, Math.min(44, height * activeMultiplier));

        return (
          <motion.span
            key={i}
            className={`w-1.5 rounded-full transition-colors ${
              isListening
                ? "bg-emerald-500"
                : isSpeaking
                  ? "bg-primary"
                  : "bg-muted-foreground/30"
            }`}
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
  );
};

VoiceWaveform.displayName = "VoiceWaveform";

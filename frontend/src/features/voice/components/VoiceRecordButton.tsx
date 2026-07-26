// ─────────────────────────────────────────────────────────────────────────────
// VoiceRecordButton.tsx
// KisanGPT — Microphone record/stop toggle button
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React from "react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { VoiceStatus } from "../types/voice.types";

interface VoiceRecordButtonProps {
  status: VoiceStatus;
  onStart: () => void;
  onStop: () => void;
}

export const VoiceRecordButton: React.FC<VoiceRecordButtonProps> = ({
  status,
  onStart,
  onStop,
}) => {
  const isListening = status === "listening";
  const isProcessing = status === "processing";

  const handleClick = () => {
    if (isListening) {
      onStop();
    } else if (!isProcessing) {
      onStart();
    }
  };

  return (
    <div className="relative">
      <Button
        variant="primary"
        size="lg"
        onClick={handleClick}
        disabled={isProcessing}
        aria-label={
          isListening
            ? "Stop recording"
            : isProcessing
              ? "Processing voice..."
              : "Start recording"
        }
        aria-pressed={isListening}
        className={`h-16 w-16 rounded-full p-0 flex items-center justify-center transition-all ${
          isListening
            ? "bg-red-600 hover:bg-red-700 ring-4 ring-red-500/30 scale-105"
            : isProcessing
              ? "bg-amber-500 hover:bg-amber-600"
              : "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
        }`}
      >
        {isListening ? (
          <MicOff size={28} className="text-white motion-safe:animate-pulse" />
        ) : (
          <Mic size={28} className="text-white" />
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
  );
};

VoiceRecordButton.displayName = "VoiceRecordButton";

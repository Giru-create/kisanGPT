// ─────────────────────────────────────────────────────────────────────────────
// VoiceError.tsx
// KisanGPT — Voice Assistant Accessible Error State Component
// Displays alerts for Microphone Denied, Network Error, Speech Not Detected, Timeout
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React from "react";
import {
  AlertTriangle,
  MicOff,
  WifiOff,
  RefreshCw,
  VolumeX,
} from "lucide-react";
import type { VoiceErrorCode } from "../types/voice.types";

interface VoiceErrorProps {
  code?: VoiceErrorCode;
  message: string;
  onRetry?: () => void;
}

export const VoiceError: React.FC<VoiceErrorProps> = ({
  code = "UNKNOWN",
  message,
  onRetry,
}) => {
  const getIcon = () => {
    switch (code) {
      case "PERMISSION_DENIED":
        return <MicOff size={22} className="text-destructive" />;
      case "NETWORK_ERROR":
        return <WifiOff size={22} className="text-amber-500" />;
      case "NO_SPEECH":
        return <VolumeX size={22} className="text-amber-500" />;
      default:
        return <AlertTriangle size={22} className="text-destructive" />;
    }
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive-foreground flex items-start gap-3 my-4 max-w-lg mx-auto shadow-xs"
    >
      <div className="p-2 rounded-full bg-background/80 shrink-0 shadow-xs">
        {getIcon()}
      </div>

      <div className="flex-1 space-y-1">
        <h4 className="text-sm font-bold text-foreground">
          {code === "PERMISSION_DENIED"
            ? "Microphone Access Required"
            : code === "NETWORK_ERROR"
              ? "Network Disconnected"
              : code === "NO_SPEECH"
                ? "No Speech Heard"
                : "Voice Assistant Error"}
        </h4>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {message}
        </p>

        {onRetry && (
          <div className="pt-2">
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs min-h-[36px] focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <RefreshCw size={14} />
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

VoiceError.displayName = "VoiceError";

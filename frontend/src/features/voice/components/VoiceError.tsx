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
import { Button } from "@/components/ui/Button";
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
        return <MicOff size={40} className="text-destructive" />;
      case "NETWORK_ERROR":
        return <WifiOff size={40} className="text-amber-500" />;
      case "NO_SPEECH":
        return <VolumeX size={40} className="text-amber-500" />;
      default:
        return <AlertTriangle size={40} className="text-destructive" />;
    }
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-center flex flex-col items-center gap-4"
    >
      <div className="rounded-full bg-destructive/10 p-4">{getIcon()}</div>

      <div className="flex flex-col gap-1.5">
        <h2 className="ds-heading-md text-foreground">
          {code === "PERMISSION_DENIED"
            ? "Microphone Access Required"
            : code === "NETWORK_ERROR"
              ? "Network Disconnected"
              : code === "NO_SPEECH"
                ? "No Speech Heard"
                : "Voice Assistant Error"}
        </h2>
        <p className="ds-body-sm text-muted-foreground max-w-xs leading-relaxed">
          {message}
        </p>
      </div>

      {onRetry && (
        <Button
          variant="primary"
          size="md"
          leftIcon={<RefreshCw size={16} />}
          onClick={onRetry}
        >
          Try Again
        </Button>
      )}
    </div>
  );
};

VoiceError.displayName = "VoiceError";

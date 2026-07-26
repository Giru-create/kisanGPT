// ─────────────────────────────────────────────────────────────────────────────
// VoiceError.tsx
// KisanGPT — Voice Assistant error state
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface VoiceErrorProps {
  message: string;
  onRetry: () => void;
}

export const VoiceError: React.FC<VoiceErrorProps> = ({ message, onRetry }) => {
  return (
    <div
      role="alert"
      className="rounded-2xl border border-destructive/50 bg-destructive/5 p-6 flex flex-col items-center gap-3 text-center"
    >
      <AlertTriangle
        size={28}
        className="text-destructive"
        aria-hidden="true"
      />
      <p className="text-sm font-medium text-foreground">
        Something went wrong
      </p>
      <p className="text-xs text-muted-foreground max-w-xs">{message}</p>
      <Button variant="outline" size="sm" onClick={onRetry} className="mt-1">
        Try Again
      </Button>
    </div>
  );
};

VoiceError.displayName = "VoiceError";

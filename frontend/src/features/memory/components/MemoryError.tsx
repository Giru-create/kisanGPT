// ─────────────────────────────────────────────────────────────────────────────
// MemoryError.tsx
// KisanGPT — Accessible Error State Component for Farm Memory
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface MemoryErrorProps {
  message: string;
  onRetry?: () => void;
}

export const MemoryError: React.FC<MemoryErrorProps> = ({
  message,
  onRetry,
}) => {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-center flex flex-col items-center gap-4"
    >
      <div className="rounded-full bg-destructive/10 p-4">
        <AlertTriangle size={40} className="text-destructive" />
      </div>

      <div className="flex flex-col gap-1.5">
        <h2 className="text-lg font-semibold text-foreground">
          Farm Memory Load Failure
        </h2>
        <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
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
          Retry Loading
        </Button>
      )}
    </div>
  );
};

MemoryError.displayName = "MemoryError";

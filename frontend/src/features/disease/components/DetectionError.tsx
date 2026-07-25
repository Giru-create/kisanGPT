// ─────────────────────────────────────────────────────────────────────────────
// DetectionError.tsx
// KisanGPT — Error state for disease detection
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface DetectionErrorProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const DetectionError: React.FC<DetectionErrorProps> = ({
  message,
  onRetry,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-4 p-6 text-center",
        className,
      )}
      role="alert"
    >
      <AlertCircle size={48} className="text-destructive" aria-hidden="true" />

      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-foreground">
          Analysis Failed
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm">{message}</p>
      </div>

      {onRetry && (
        <Button
          variant="outline"
          onClick={onRetry}
          className="flex items-center gap-2"
          aria-label="Try again with a different image"
        >
          <RefreshCw size={16} aria-hidden="true" />
          Try Again
        </Button>
      )}
    </div>
  );
};

DetectionError.displayName = "DetectionError";

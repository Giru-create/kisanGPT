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
    <div className={cn("ds-error-state p-6 gap-4", className)} role="alert">
      <div className="rounded-full bg-destructive/10 p-4">
        <AlertCircle
          size={40}
          className="text-destructive"
          aria-hidden="true"
        />
      </div>

      <div className="space-y-1.5">
        <h2 className="ds-heading-md text-foreground">Analysis Failed</h2>
        <p className="text-sm text-muted-foreground max-w-xs">{message}</p>
      </div>

      {onRetry && (
        <Button
          variant="primary"
          size="md"
          leftIcon={<RefreshCw size={16} aria-hidden="true" />}
          onClick={onRetry}
          aria-label="Try again with a different image"
        >
          Try Again
        </Button>
      )}
    </div>
  );
};

DetectionError.displayName = "DetectionError";

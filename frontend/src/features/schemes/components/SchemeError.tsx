"use client";

// ─────────────────────────────────────────────────────────────────────────────
// SchemeError.tsx
// KisanGPT — Government Schemes error state component
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface SchemeErrorProps {
  message: string;
  onRetry: () => void;
}

export const SchemeError: React.FC<SchemeErrorProps> = ({
  message,
  onRetry,
}) => {
  return (
    <div
      role="alert"
      aria-label="Error loading schemes"
      className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-center flex flex-col items-center gap-4"
    >
      <div className="rounded-full bg-destructive/10 p-4">
        <AlertTriangle
          size={40}
          className="text-destructive"
          aria-hidden="true"
        />
      </div>
      <h2 className="ds-heading-md text-foreground">Failed to Load Schemes</h2>
      <p className="ds-body-sm text-muted-foreground max-w-xs">{message}</p>
      <Button
        variant="primary"
        size="md"
        leftIcon={<RefreshCw size={16} aria-hidden="true" />}
        onClick={onRetry}
      >
        Retry
      </Button>
    </div>
  );
};

SchemeError.displayName = "SchemeError";

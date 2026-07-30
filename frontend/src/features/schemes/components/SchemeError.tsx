"use client";

// ─────────────────────────────────────────────────────────────────────────────
// SchemeError.tsx
// KisanGPT — Government Schemes error state component
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface SchemeErrorProps {
  message: string;
  onRetry: () => void;
}

export const SchemeError: React.FC<SchemeErrorProps> = ({
  message,
  onRetry,
}) => {
  return (
    <section
      role="alert"
      aria-label="Error loading schemes"
      className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center flex flex-col items-center gap-3 shadow-sm"
    >
      <div className="rounded-2xl bg-destructive/10 p-3 text-destructive shrink-0">
        <AlertTriangle size={28} aria-hidden="true" />
      </div>
      <h2 className="text-base font-extrabold text-foreground">
        Failed to Load Schemes
      </h2>
      <p className="text-xs text-muted-foreground max-w-xs">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-primary hover:underline min-h-[44px]"
      >
        <RefreshCw size={14} aria-hidden="true" /> Retry
      </button>
    </section>
  );
};

SchemeError.displayName = "SchemeError";

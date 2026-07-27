// ─────────────────────────────────────────────────────────────────────────────
// MemoryError.tsx
// KisanGPT — Accessible Error State Component for Farm Memory
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

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
      className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive-foreground flex items-start gap-3 my-4 max-w-xl mx-auto shadow-xs"
    >
      <div className="p-2 rounded-full bg-background/80 shrink-0 shadow-xs text-destructive">
        <AlertTriangle size={20} />
      </div>

      <div className="flex-1 space-y-1">
        <h4 className="text-sm font-bold text-foreground">
          Farm Memory Load Failure
        </h4>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {message}
        </p>

        {onRetry && (
          <div className="pt-2">
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs min-h-[36px] focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <RefreshCw size={14} />
              Retry Loading
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

MemoryError.displayName = "MemoryError";

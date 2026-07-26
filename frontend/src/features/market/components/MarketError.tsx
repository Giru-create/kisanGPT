// ─────────────────────────────────────────────────────────────────────────────
// MarketError.tsx
// KisanGPT — Market Intelligence non-blocking inline error state
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React from "react";
import { AlertTriangle, RefreshCw, Wifi } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

interface MarketErrorProps {
  message: string;
  onRetry: () => void;
  isOffline?: boolean;
}

export const MarketError: React.FC<MarketErrorProps> = ({
  message,
  onRetry,
  isOffline = false,
}) => {
  return (
    <motion.div
      role="alert"
      aria-live="assertive"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`rounded-2xl border p-5 flex flex-col items-center gap-4 text-center ${
        isOffline
          ? "border-amber-300 dark:border-amber-700 bg-amber-50/60 dark:bg-amber-950/30"
          : "border-destructive/40 bg-destructive/5"
      }`}
    >
      <div
        className={`h-12 w-12 rounded-2xl flex items-center justify-center ${
          isOffline ? "bg-amber-100 dark:bg-amber-900/50" : "bg-destructive/10"
        }`}
      >
        {isOffline ? (
          <Wifi
            size={22}
            className="text-amber-600 dark:text-amber-400"
            aria-hidden="true"
          />
        ) : (
          <AlertTriangle
            size={22}
            className="text-destructive"
            aria-hidden="true"
          />
        )}
      </div>

      <div>
        <p className="text-sm font-semibold text-foreground">
          {isOffline ? "You are offline" : "Unable to load market data"}
        </p>
        <p className="text-xs text-muted-foreground mt-1 max-w-xs">
          {isOffline
            ? "Showing cached prices. Data will refresh automatically when back online."
            : message}
        </p>
      </div>

      {!isOffline && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          leftIcon={<RefreshCw size={14} aria-hidden="true" />}
        >
          Retry
        </Button>
      )}
    </motion.div>
  );
};

MarketError.displayName = "MarketError";

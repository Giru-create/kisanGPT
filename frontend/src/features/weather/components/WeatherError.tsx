"use client";

// ─────────────────────────────────────────────────────────────────────────────
// WeatherError.tsx
// KisanGPT — Error state for Weather Intelligence
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { CloudOff, RefreshCcw, History } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface WeatherErrorProps {
  message?: string;
  onRetry: () => void;
}

export const WeatherError: React.FC<WeatherErrorProps> = ({
  message,
  onRetry,
}) => {
  return (
    <div
      role="alert"
      className="flex flex-col items-center text-center gap-5 rounded-2xl border border-destructive/20 bg-destructive/5 px-6 py-10"
    >
      {/* Icon */}
      <div className="rounded-full bg-destructive/10 p-4">
        <CloudOff size={40} className="text-destructive" aria-hidden="true" />
      </div>

      {/* Heading */}
      <div className="flex flex-col gap-1.5">
        <h2 className="ds-heading-md text-foreground">
          Weather data unavailable
        </h2>
        <p className="ds-body-sm text-muted-foreground max-w-xs">
          {message ??
            "We couldn't load the weather for your location. Check your internet connection and try again."}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <Button
          variant="primary"
          size="md"
          leftIcon={<RefreshCcw size={16} />}
          onClick={onRetry}
          className="w-full sm:w-auto"
        >
          Try Again
        </Button>
        <Button
          variant="outline"
          size="md"
          leftIcon={<History size={16} />}
          className="w-full sm:w-auto"
          // TODO: wire to cached data in a later milestone
          disabled
        >
          Use Last Data
        </Button>
      </div>
    </div>
  );
};

WeatherError.displayName = "WeatherError";

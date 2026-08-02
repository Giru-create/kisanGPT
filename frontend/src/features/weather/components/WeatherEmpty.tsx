"use client";

// ─────────────────────────────────────────────────────────────────────────────
// WeatherEmpty.tsx
// KisanGPT — Empty/no-location state for Weather Intelligence
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface WeatherEmptyProps {
  onSetLocation?: () => void;
}

export const WeatherEmpty: React.FC<WeatherEmptyProps> = ({
  onSetLocation,
}) => {
  return (
    <div className="flex flex-col items-center text-center gap-6 rounded-2xl border border-border bg-card p-8">
      {/* Illustration */}
      <div className="rounded-full bg-primary/10 p-5">
        <MapPin size={44} className="text-primary" aria-hidden="true" />
      </div>

      {/* Copy */}
      <div className="flex flex-col gap-2">
        <h3 className="ds-heading-sm text-foreground mb-2">
          Tell us where your farm is
        </h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
          We&apos;ll show you accurate weather conditions and farming advice
          tailored to your exact location.
        </p>
      </div>

      {/* CTA */}
      <Button
        variant="primary"
        size="lg"
        leftIcon={<MapPin size={18} />}
        onClick={onSetLocation}
        className="w-full sm:w-auto"
        // TODO: open location picker modal in a later milestone
      >
        Set Farm Location
      </Button>
    </div>
  );
};

WeatherEmpty.displayName = "WeatherEmpty";

"use client";

// ─────────────────────────────────────────────────────────────────────────────
// GreetingHeader.tsx
// KisanGPT — Section 1: Greeting & Farm Context
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { MapPin, Sprout, Sun } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { FarmerProfile } from "../types/dashboard.types";

interface GreetingHeaderProps {
  profile: FarmerProfile;
  onSelectLocation?: () => void;
}

export const GreetingHeader: React.FC<GreetingHeaderProps> = ({
  profile,
  onSelectLocation,
}) => {
  return (
    <section
      role="region"
      aria-label="Farmer Profile & Greeting"
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-2"
    >
      {/* Greeting Title */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Sun
            size={22}
            className="text-amber-500 shrink-0"
            aria-hidden="true"
          />
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
            {profile.greetingPrefix}, {profile.name}!
          </h1>
        </div>
        <p className="text-xs sm:text-sm font-medium text-muted-foreground">
          {profile.activeCrop} · {profile.farmSizeAcres} Acres (
          {profile.cropSeason})
        </p>
      </div>

      {/* Farm Location Pill & Status */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onSelectLocation}
          aria-label={`Active farm location: ${profile.village}, ${profile.district}. Click to change location.`}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-foreground shadow-sm hover:bg-accent hover:border-primary/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[48px]"
        >
          <MapPin
            size={16}
            className="text-primary shrink-0"
            aria-hidden="true"
          />
          <span>
            {profile.village}, {profile.district}
          </span>
        </button>

        <Badge
          variant="success"
          className="text-xs py-2 px-3 min-h-[48px] inline-flex items-center"
        >
          <Sprout
            size={14}
            className="mr-1 inline shrink-0"
            aria-hidden="true"
          />
          Active
        </Badge>
      </div>
    </section>
  );
};

GreetingHeader.displayName = "GreetingHeader";

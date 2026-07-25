// ─────────────────────────────────────────────────────────────────────────────
// DetectionEmpty.tsx
// KisanGPT — Empty state before first scan
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React from "react";
import { Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface DetectionEmptyProps {
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const DetectionEmpty: React.FC<DetectionEmptyProps> = ({
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-4 p-8 text-center",
        className,
      )}
    >
      <div className="rounded-full bg-muted p-4">
        <Leaf size={32} className="text-muted-foreground" aria-hidden="true" />
      </div>

      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-foreground">
          Detect Crop Diseases
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Take a photo or upload an image of your crop to identify
          diseases and get treatment recommendations.
        </p>
      </div>
    </div>
  );
};

DetectionEmpty.displayName = "DetectionEmpty";

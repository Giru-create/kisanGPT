// ─────────────────────────────────────────────────────────────────────────────
// DetectionSkeleton.tsx
// KisanGPT — Loading skeleton for disease analysis
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/Skeleton";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface DetectionSkeletonProps {
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const DetectionSkeleton: React.FC<DetectionSkeletonProps> = ({
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-4 w-full max-w-md mx-auto",
        className,
      )}
      role="status"
      aria-label="Analyzing plant image"
    >
      <Skeleton className="h-48 w-48 sm:h-56 sm:w-56 rounded-xl" />

      <div className="w-full space-y-3">
        <Skeleton className="h-6 w-3/4 mx-auto" />
        <Skeleton className="h-4 w-1/2 mx-auto" />
        <Skeleton className="h-20 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-8 flex-1" />
          <Skeleton className="h-8 flex-1" />
          <Skeleton className="h-8 flex-1" />
        </div>
      </div>

      <p className="text-sm text-muted-foreground animate-pulse">
        Analyzing your plant image...
      </p>

      <span className="sr-only">Loading disease detection results</span>
    </div>
  );
};

DetectionSkeleton.displayName = "DetectionSkeleton";

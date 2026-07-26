// ─────────────────────────────────────────────────────────────────────────────
// MarketSkeleton.tsx
// KisanGPT — Market Intelligence loading skeleton
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export const MarketSkeleton: React.FC = () => {
  return (
    <div
      className="flex flex-col gap-4"
      role="status"
      aria-label="Loading market data"
    >
      <span className="sr-only">Loading...</span>

      {/* Overview cards skeleton */}
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm">
        <Skeleton className="h-5 w-36 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-border bg-muted/20 p-3">
            <Skeleton className="h-3 w-24 mb-2" />
            <Skeleton className="h-8 w-12" />
          </div>
          <div className="rounded-xl border border-border bg-muted/20 p-3">
            <Skeleton className="h-3 w-16 mb-2" />
            <Skeleton className="h-8 w-8" />
          </div>
          <div className="rounded-xl border border-border bg-muted/20 p-3">
            <Skeleton className="h-3 w-16 mb-2" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </div>

      {/* Price list skeleton */}
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm">
        <Skeleton className="h-5 w-48 mb-4" />
        <div className="flex flex-col gap-2.5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/20"
            >
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trend skeleton */}
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm">
        <Skeleton className="h-5 w-44 mb-4" />
        <Skeleton className="h-24 w-full mb-4" />
        <div className="grid grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-lg border border-border bg-muted/20 p-2 text-center"
            >
              <Skeleton className="h-3 w-8 mx-auto mb-1" />
              <Skeleton className="h-4 w-14 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

MarketSkeleton.displayName = "MarketSkeleton";

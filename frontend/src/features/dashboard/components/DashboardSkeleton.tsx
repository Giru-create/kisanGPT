"use client";

// ─────────────────────────────────────────────────────────────────────────────
// DashboardSkeleton.tsx
// KisanGPT — Loading Skeleton state for Farmer Dashboard
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export const DashboardSkeleton: React.FC = () => {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading farmer dashboard"
      className="flex flex-col gap-4 w-full"
    >
      {/* Greeting Skeleton */}
      <div className="flex justify-between items-center py-2">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-36" />
        </div>
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>

      {/* Weather Summary Skeleton */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm flex flex-col gap-4">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>

      {/* Voice Bar Skeleton */}
      <Skeleton className="h-20 w-full rounded-2xl" />

      {/* AI Chat Shortcut Skeleton */}
      <div className="rounded-2xl border border-border bg-card p-4 flex flex-col gap-3">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-12 w-full rounded-xl" />
        <div className="flex gap-2">
          <Skeleton className="h-7 w-28 rounded-full" />
          <Skeleton className="h-7 w-36 rounded-full" />
          <Skeleton className="h-7 w-32 rounded-full" />
        </div>
      </div>

      {/* Quick Actions Grid Skeleton */}
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-20 w-full rounded-2xl" />
      </div>

      {/* Crop Health Skeleton */}
      <div className="rounded-2xl border border-border bg-card p-4 flex flex-col gap-3">
        <Skeleton className="h-5 w-44" />
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
      </div>

      {/* Mandi Prices Skeleton */}
      <div className="rounded-2xl border border-border bg-card p-4 flex flex-col gap-3">
        <Skeleton className="h-5 w-44" />
        <Skeleton className="h-14 w-full rounded-xl" />
        <Skeleton className="h-14 w-full rounded-xl" />
      </div>
    </div>
  );
};

DashboardSkeleton.displayName = "DashboardSkeleton";

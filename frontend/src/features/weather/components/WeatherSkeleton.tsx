"use client";

// ─────────────────────────────────────────────────────────────────────────────
// WeatherSkeleton.tsx
// KisanGPT — Loading state for Weather Intelligence
//
// Mirrors the loaded layout 1:1 to eliminate layout shift.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export const WeatherSkeleton: React.FC = () => {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading weather data"
      className="flex flex-col gap-4 w-full"
    >
      {/* ── Current weather card skeleton ── */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        {/* Location row */}
        <div className="flex items-center justify-between mb-5">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>

        {/* Icon + temp */}
        <div className="flex items-center gap-4 mb-5">
          <Skeleton className="h-14 w-14 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>

        {/* Stat pills */}
        <div className="flex gap-3">
          <Skeleton className="h-16 w-[72px] rounded-xl" />
          <Skeleton className="h-16 w-[72px] rounded-xl" />
          <Skeleton className="h-16 w-[72px] rounded-xl" />
        </div>

        {/* Sunrise/sunset row */}
        <div className="flex items-center justify-between mt-4">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>

      {/* ── 7-day forecast skeleton ── */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <Skeleton className="h-4 w-28 mb-4" />
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-2 items-center min-w-[72px]"
            >
              <Skeleton className="h-3 w-8" />
              <Skeleton className="h-3 w-10" />
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-4 w-10 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* ── Recommendation card skeleton ── */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <Skeleton className="h-4 w-40 mb-1" />
        <Skeleton className="h-3 w-48 mb-4" />
        <Skeleton className="h-6 w-28 rounded-full mb-3" />
        <div className="flex flex-col gap-2 mb-4">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-4/6" />
        </div>
        <Skeleton className="h-3 w-36 mb-1" />
        <Skeleton className="h-3 w-28 mb-4" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </div>
  );
};

WeatherSkeleton.displayName = "WeatherSkeleton";

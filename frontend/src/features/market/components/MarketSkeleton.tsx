// ─────────────────────────────────────────────────────────────────────────────
// MarketSkeleton.tsx
// KisanGPT — Market Intelligence pixel-perfect layout-preserving loading skeleton
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

const CardShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm">
    {children}
  </div>
);

export const MarketSkeleton: React.FC = () => {
  return (
    <div
      className="flex flex-col gap-4"
      role="status"
      aria-busy="true"
      aria-label="Loading market prices, please wait"
    >
      <span className="sr-only">Loading market data…</span>

      {/* Market Overview Card skeleton */}
      <CardShell>
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-muted/20 p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-8 w-10" />
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-border">
          <Skeleton className="h-3 w-28 mb-2.5" />
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-6 w-24 rounded-full" />
            ))}
          </div>
        </div>
      </CardShell>

      {/* Commodity Selector skeleton */}
      <CardShell>
        <div className="flex items-center justify-between mb-3">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-28" />
        </div>
        <div className="flex gap-2 overflow-hidden">
          {[0, 1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-11 w-24 rounded-full shrink-0" />
          ))}
        </div>
      </CardShell>

      {/* Price list skeleton */}
      <CardShell>
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-16" />
        </div>
        <div className="flex flex-col gap-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-border overflow-hidden"
            >
              <div className="h-0.5 w-full bg-muted" />
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <Skeleton className="h-9 w-9 rounded-xl" />
                </div>
                <div className="flex items-end justify-between">
                  <div className="space-y-1.5">
                    <Skeleton className="h-7 w-28" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardShell>

      {/* Trend chart skeleton */}
      <CardShell>
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-16" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-9 rounded-xl" />
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-9 w-16 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
        <Skeleton className="h-24 w-full rounded-xl mb-2" />
        <div className="flex justify-between mb-4">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="grid grid-cols-4 gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-muted/20 p-3 text-center"
            >
              <Skeleton className="h-2.5 w-6 mx-auto mb-1.5" />
              <Skeleton className="h-4 w-14 mx-auto" />
            </div>
          ))}
        </div>
      </CardShell>

      {/* AI Recommendation skeleton */}
      <div className="rounded-2xl border-2 border-muted overflow-hidden">
        <div className="p-4 bg-muted/20">
          <div className="flex items-center gap-2 mb-2">
            <Skeleton className="h-3.5 w-3.5 rounded" />
            <Skeleton className="h-3 w-32" />
          </div>
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-5 w-48" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-1.5 w-32 rounded-full" />
                <Skeleton className="h-3 w-8" />
              </div>
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
        <div className="p-4 space-y-3">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-4/6" />
          <div className="flex gap-2 pt-1">
            <Skeleton className="h-8 w-28 rounded-full" />
          </div>
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
};

MarketSkeleton.displayName = "MarketSkeleton";

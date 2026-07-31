"use client";

import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export const SchemesSkeleton: React.FC = () => {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading schemes"
      className="flex flex-col gap-4"
    >
      {/* Hero skeleton */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 rounded w-40" />
            <Skeleton className="h-2.5 rounded w-28" />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3 mb-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-10 rounded-xl" />
      </div>

      {/* Recommendation skeleton */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <div className="space-y-1.5">
            <Skeleton className="h-2.5 rounded w-24" />
            <Skeleton className="h-3.5 rounded w-48" />
          </div>
        </div>
        <Skeleton className="h-3 rounded w-full mb-2" />
        <Skeleton className="h-3 rounded w-4/5 mb-4" />
        <Skeleton className="h-14 rounded-xl mb-4" />
        <Skeleton className="h-20 rounded-xl mb-4" />
        <div className="flex gap-2">
          <Skeleton className="h-10 flex-1 rounded-xl" />
          <Skeleton className="h-10 w-24 rounded-xl" />
        </div>
      </div>

      {/* Search skeleton */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <Skeleton className="h-11 rounded-xl" />
      </div>

      {/* Cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-3 p-4 rounded-xl border border-border bg-card"
          >
            <div className="flex items-start justify-between gap-2">
              <Skeleton className="h-3.5 rounded w-2/3" />
              <Skeleton className="h-5 rounded-full w-16" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-3 rounded w-full" />
              <Skeleton className="h-3 rounded w-4/5" />
            </div>
            <Skeleton className="h-10 rounded-lg" />
            <div className="flex items-center justify-between pt-2.5 border-t border-border/40">
              <Skeleton className="h-3 rounded w-1/3" />
              <Skeleton className="h-3 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

SchemesSkeleton.displayName = "SchemesSkeleton";

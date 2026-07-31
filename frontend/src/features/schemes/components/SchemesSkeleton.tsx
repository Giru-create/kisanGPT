"use client";

import React from "react";

export const SchemesSkeleton: React.FC = () => {
  return (
    <div
      role="status"
      aria-label="Loading schemes"
      className="flex flex-col gap-4"
    >
      {/* Hero skeleton */}
      <div className="rounded-2xl border border-border bg-card p-5 animate-pulse">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 w-8 rounded-lg bg-muted" />
          <div className="space-y-1.5">
            <div className="h-3.5 bg-muted rounded w-40" />
            <div className="h-2.5 bg-muted rounded w-28" />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3 mb-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-muted" />
          ))}
        </div>
        <div className="h-10 rounded-xl bg-muted" />
      </div>

      {/* Recommendation skeleton */}
      <div className="rounded-2xl border border-border bg-card p-5 animate-pulse">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 w-8 rounded-lg bg-muted" />
          <div className="space-y-1.5">
            <div className="h-2.5 bg-muted rounded w-24" />
            <div className="h-3.5 bg-muted rounded w-48" />
          </div>
        </div>
        <div className="h-3 bg-muted rounded w-full mb-2" />
        <div className="h-3 bg-muted rounded w-4/5 mb-4" />
        <div className="h-14 rounded-xl bg-muted mb-4" />
        <div className="h-20 rounded-xl bg-muted mb-4" />
        <div className="flex gap-2">
          <div className="h-10 flex-1 rounded-xl bg-muted" />
          <div className="h-10 w-24 rounded-xl bg-muted" />
        </div>
      </div>

      {/* Search skeleton */}
      <div className="rounded-2xl border border-border bg-card p-4 animate-pulse">
        <div className="h-11 rounded-xl bg-muted" />
      </div>

      {/* Cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-3 p-4 rounded-xl border border-border bg-card animate-pulse"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="h-3.5 bg-muted rounded w-2/3" />
              <div className="h-5 bg-muted rounded-full w-16" />
            </div>
            <div className="space-y-1.5">
              <div className="h-3 bg-muted rounded w-full" />
              <div className="h-3 bg-muted rounded w-4/5" />
            </div>
            <div className="h-10 rounded-lg bg-muted" />
            <div className="flex items-center justify-between pt-2.5 border-t border-border/40">
              <div className="h-3 bg-muted rounded w-1/3" />
              <div className="h-3 bg-muted rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

SchemesSkeleton.displayName = "SchemesSkeleton";

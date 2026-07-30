"use client";

// ─────────────────────────────────────────────────────────────────────────────
// SchemeSkeleton.tsx
// KisanGPT — Government Schemes loading skeleton
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";

export const SchemeSkeleton: React.FC = () => {
  return (
    <div
      role="status"
      aria-label="Loading schemes"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={`skeleton-${i}`}
          className="flex flex-col gap-3 p-4 rounded-xl border border-border bg-card animate-pulse"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="h-4 bg-muted rounded w-2/3" />
            <div className="h-5 bg-muted rounded-full w-16" />
          </div>
          <div className="space-y-1.5">
            <div className="h-3 bg-muted rounded w-full" />
            <div className="h-3 bg-muted rounded w-4/5" />
          </div>
          <div className="flex items-center justify-between pt-2.5 border-t border-border/40">
            <div className="h-3 bg-muted rounded w-1/3" />
            <div className="h-3 bg-muted rounded w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
};

SchemeSkeleton.displayName = "SchemeSkeleton";

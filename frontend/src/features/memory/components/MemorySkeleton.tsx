// ─────────────────────────────────────────────────────────────────────────────
// MemorySkeleton.tsx
// KisanGPT — Farm Memory Loading Skeleton Shimmer
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React from "react";

export const MemorySkeleton: React.FC = () => {
  return (
    <div
      aria-label="Loading farm memory records..."
      role="status"
      className="space-y-4 w-full"
    >
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="p-5 rounded-2xl bg-card border border-border/50 animate-pulse space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="h-4 bg-muted-foreground/20 rounded-md w-1/3" />
            <div className="h-5 bg-primary/10 rounded-full w-20" />
          </div>
          <div className="h-4 bg-muted-foreground/20 rounded-md w-3/4" />
          <div className="h-3 bg-muted-foreground/15 rounded-md w-full" />
          <div className="flex gap-2 pt-2">
            <div className="h-6 bg-muted/60 rounded-lg w-16" />
            <div className="h-6 bg-muted/60 rounded-lg w-20" />
          </div>
        </div>
      ))}
    </div>
  );
};

MemorySkeleton.displayName = "MemorySkeleton";

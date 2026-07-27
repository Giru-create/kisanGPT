// ─────────────────────────────────────────────────────────────────────────────
// VoiceSkeleton.tsx
// KisanGPT — Voice Assistant Loading Skeleton Shimmer
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React from "react";

export const VoiceSkeleton: React.FC = () => {
  return (
    <div
      aria-label="Loading voice conversation..."
      role="status"
      className="space-y-4 max-w-lg mx-auto w-full p-4"
    >
      {/* User message skeleton */}
      <div className="flex gap-3 max-w-[75%] ml-auto flex-row-reverse animate-pulse">
        <div className="w-9 h-9 rounded-full bg-muted shrink-0" />
        <div className="p-4 rounded-2xl bg-muted/80 rounded-tr-none w-full space-y-2">
          <div className="h-4 bg-muted-foreground/20 rounded-md w-3/4" />
        </div>
      </div>

      {/* Assistant message skeleton */}
      <div className="flex gap-3 max-w-[80%] mr-auto animate-pulse">
        <div className="w-9 h-9 rounded-full bg-muted shrink-0" />
        <div className="p-4 rounded-2xl bg-card border border-border/50 rounded-tl-none w-full space-y-3">
          <div className="h-3 bg-emerald-500/20 rounded-md w-1/3" />
          <div className="h-4 bg-muted-foreground/20 rounded-md w-full" />
          <div className="h-4 bg-muted-foreground/20 rounded-md w-5/6" />
          <div className="h-10 bg-muted/60 rounded-xl w-full" />
        </div>
      </div>
    </div>
  );
};

VoiceSkeleton.displayName = "VoiceSkeleton";

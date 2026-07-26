// ─────────────────────────────────────────────────────────────────────────────
// VoiceSkeleton.tsx
// KisanGPT — Voice Assistant loading skeleton
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export const VoiceSkeleton: React.FC = () => {
  return (
    <div
      className="flex flex-col gap-4"
      role="status"
      aria-label="Loading voice assistant"
    >
      <span className="sr-only">Loading...</span>

      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm">
        <Skeleton className="h-5 w-48 mb-4" />
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`rounded-2xl px-4 py-2.5 ${
                  i % 2 === 0 ? "w-48" : "w-56"
                }`}
              >
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <Skeleton className="h-16 w-16 rounded-full" />
      </div>
    </div>
  );
};

VoiceSkeleton.displayName = "VoiceSkeleton";

// ─────────────────────────────────────────────────────────────────────────────
// SettingsSkeleton.tsx
// KisanGPT — Settings loading skeleton
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export const SettingsSkeleton: React.FC = () => {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading settings"
      className="flex flex-col gap-4 w-full"
    >
      <div className="mb-2">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <Skeleton className="h-4 w-72 mt-2 rounded" />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-64 space-y-2">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="h-12 rounded-xl" />
          ))}
        </div>

        <div className="flex-1 space-y-4">
          <Skeleton className="h-12 rounded-xl" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
};

SettingsSkeleton.displayName = "SettingsSkeleton";

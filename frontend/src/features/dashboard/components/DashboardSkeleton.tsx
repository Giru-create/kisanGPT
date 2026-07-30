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
      className="w-full flex flex-col gap-6"
    >
      <span className="sr-only">Loading farmer dashboard data...</span>

      {/* Greeting Skeleton */}
      <div className="flex justify-between items-end py-2">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-9 w-72" />
          <Skeleton className="h-5 w-56" />
        </div>
        <Skeleton className="h-10 w-40 rounded-xl" />
      </div>

      {/* Hero Section: Weather + AI Advisory */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Skeleton className="h-56 rounded-xl" />
        <Skeleton className="h-56 rounded-xl" />
      </div>

      {/* Crop Health + Market Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 flex flex-col gap-4">
          <Skeleton className="h-5 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
          </div>
        </div>
        <div className="lg:col-span-5 flex flex-col gap-4">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>

      {/* Recent Chats + Priority Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Skeleton className="h-48 rounded-xl" />
        <div className="flex flex-col gap-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

DashboardSkeleton.displayName = "DashboardSkeleton";

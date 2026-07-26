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
      <span className="sr-only">Loading farmer dashboard data…</span>

      {/* Greeting Skeleton */}
      <div className="flex justify-between items-center py-2">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-60 sm:w-72" />
          <Skeleton className="h-4 w-44 sm:w-56" />
        </div>
        <Skeleton className="h-12 w-36 rounded-xl" />
      </div>

      {/* 12-Column Responsive Grid Skeleton */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Main Column Skeleton (8 cols) */}
        <div className="xl:col-span-8 flex flex-col gap-5">
          {/* Weather Summary Skeleton */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-10 w-28 rounded-xl" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
            <Skeleton className="h-14 w-full rounded-xl" />
          </div>

          {/* AI Chat Shortcut Skeleton */}
          <div className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-3">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <div className="flex gap-2">
              <Skeleton className="h-12 w-32 rounded-full" />
              <Skeleton className="h-12 w-40 rounded-full" />
              <Skeleton className="h-12 w-36 rounded-full" />
            </div>
          </div>

          {/* Crop Health Skeleton */}
          <div className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-4">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>

          {/* Mandi Prices Skeleton */}
          <div className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-4">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
          </div>

          {/* Schemes Skeleton */}
          <div className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-4">
            <Skeleton className="h-5 w-52" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Skeleton className="h-28 w-full rounded-xl" />
              <Skeleton className="h-28 w-full rounded-xl" />
            </div>
          </div>
        </div>

        {/* Sidebar Column Skeleton (4 cols) */}
        <div className="xl:col-span-4 flex flex-col gap-5">
          {/* Voice Assistant Bar Skeleton */}
          <Skeleton className="h-28 w-full rounded-2xl" />

          {/* Quick Actions Grid Skeleton */}
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
          </div>

          {/* Notifications Skeleton */}
          <div className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-3">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
          </div>

          {/* Recent Activity Skeleton */}
          <div className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-3">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-14 w-full rounded-xl" />
            <Skeleton className="h-14 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

DashboardSkeleton.displayName = "DashboardSkeleton";

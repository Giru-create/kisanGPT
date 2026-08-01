"use client";

import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export const ProfileSkeleton: React.FC = () => {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading farmer profile..."
      className="flex flex-col gap-4 w-full"
    >
      {/* Hero skeleton */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <Skeleton className="h-1.5 bg-muted rounded-full w-full mb-5" />
        <div className="flex items-start gap-4">
          <Skeleton className="h-20 w-20 rounded-full shrink-0" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-5 rounded-md w-40" />
            <Skeleton className="h-3 rounded-md w-56" />
            <div className="flex gap-2">
              <Skeleton className="h-5 rounded-full w-24" />
              <Skeleton className="h-5 rounded-full w-20" />
              <Skeleton className="h-5 rounded-full w-28" />
            </div>
            <Skeleton className="h-3 rounded-md w-48" />
          </div>
        </div>
      </div>

      {/* Tabs skeleton */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Skeleton key={i} className="h-9 rounded-xl w-20 shrink-0" />
        ))}
      </div>

      {/* Content skeleton */}
      <div className="flex flex-col gap-4">
        {/* Stats grid */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 rounded-md w-32" />
              <Skeleton className="h-3 rounded-md w-44" />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-xl bg-muted/50 p-3 text-center">
                <Skeleton className="h-6 rounded-md w-10 mx-auto mb-1.5" />
                <Skeleton className="h-3 rounded-md w-16 mx-auto" />
              </div>
            ))}
          </div>
        </div>

        {/* Cards */}
        {[1, 2].map((i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 rounded-md w-36" />
                <Skeleton className="h-3 rounded-md w-48" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {[1, 2, 3, 4, 5, 6].map((j) => (
                <div
                  key={j}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl bg-muted/50"
                >
                  <Skeleton className="h-7 w-7 rounded-lg" />
                  <div className="space-y-1">
                    <Skeleton className="h-2.5 rounded-md w-16" />
                    <Skeleton className="h-3 rounded-md w-24" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

ProfileSkeleton.displayName = "ProfileSkeleton";

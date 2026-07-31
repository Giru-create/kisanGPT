"use client";

import React from "react";

export const ProfileSkeleton: React.FC = () => {
  return (
    <div
      aria-label="Loading farmer profile..."
      role="status"
      className="space-y-5 w-full max-w-4xl mx-auto"
    >
      {/* Hero skeleton */}
      <div className="rounded-2xl border border-border bg-card p-5 animate-pulse">
        <div className="h-1.5 bg-muted rounded-full w-full mb-5" />
        <div className="flex items-start gap-4">
          <div className="h-20 w-20 rounded-full bg-muted shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-5 bg-muted rounded-md w-40" />
            <div className="h-3 bg-muted rounded-md w-56" />
            <div className="flex gap-2">
              <div className="h-5 bg-muted rounded-full w-24" />
              <div className="h-5 bg-muted rounded-full w-20" />
              <div className="h-5 bg-muted rounded-full w-28" />
            </div>
            <div className="h-3 bg-muted rounded-md w-48" />
          </div>
        </div>
      </div>

      {/* Tabs skeleton */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="h-9 bg-muted rounded-xl w-20 shrink-0" />
        ))}
      </div>

      {/* Content skeleton */}
      <div className="space-y-5">
        {/* Stats grid */}
        <div className="rounded-2xl border border-border bg-card p-5 animate-pulse">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-lg bg-muted" />
            <div className="space-y-1.5">
              <div className="h-4 bg-muted rounded-md w-32" />
              <div className="h-3 bg-muted rounded-md w-44" />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-xl bg-muted/50 p-3 text-center">
                <div className="h-6 bg-muted rounded-md w-10 mx-auto mb-1.5" />
                <div className="h-3 bg-muted rounded-md w-16 mx-auto" />
              </div>
            ))}
          </div>
        </div>

        {/* Cards */}
        {[1, 2].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-card p-5 animate-pulse"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-muted" />
              <div className="space-y-1.5">
                <div className="h-4 bg-muted rounded-md w-36" />
                <div className="h-3 bg-muted rounded-md w-48" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {[1, 2, 3, 4, 5, 6].map((j) => (
                <div
                  key={j}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl bg-muted/50"
                >
                  <div className="h-7 w-7 rounded-lg bg-muted" />
                  <div className="space-y-1">
                    <div className="h-2.5 bg-muted rounded-md w-16" />
                    <div className="h-3 bg-muted rounded-md w-24" />
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

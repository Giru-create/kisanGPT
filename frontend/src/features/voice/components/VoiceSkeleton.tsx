"use client";

import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export const VoiceSkeleton: React.FC = () => {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading voice response"
      className="flex flex-col gap-4"
    >
      {/* Hero skeleton */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 rounded w-32" />
            <Skeleton className="h-2.5 rounded w-24" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      </div>

      {/* Voice interface skeleton */}
      <div className="rounded-2xl border border-border bg-card p-8">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-1 h-12">
            {Array.from({ length: 24 }).map((_, i) => (
              <Skeleton key={i} className="w-1 h-4 rounded-full" />
            ))}
          </div>
          <Skeleton className="h-24 w-24 rounded-full" />
          <Skeleton className="h-3 rounded w-32" />
        </div>
      </div>

      {/* Conversation skeleton */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] space-y-2 ${i % 2 === 0 ? "items-end" : "items-start"}`}
              >
                {i % 2 !== 0 && (
                  <Skeleton className="h-7 w-7 rounded-full" />
                )}
                <div className="p-3 rounded-2xl bg-muted/50">
                  <Skeleton className="h-3 rounded w-48 mb-1" />
                  <Skeleton className="h-3 rounded w-32" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input bar skeleton */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-10 rounded w-48" />
          <Skeleton className="h-24 w-24 rounded-full" />
          <Skeleton className="h-11 rounded-full w-full" />
        </div>
      </div>
    </div>
  );
};

VoiceSkeleton.displayName = "VoiceSkeleton";

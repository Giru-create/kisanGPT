"use client";

import React from "react";

export const VoiceSkeleton: React.FC = () => {
  return (
    <div
      role="status"
      aria-label="Loading voice response"
      className="flex flex-col gap-4"
    >
      {/* Hero skeleton */}
      <div className="rounded-2xl border border-border bg-card p-5 animate-pulse">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 w-8 rounded-lg bg-muted" />
          <div className="space-y-1.5">
            <div className="h-3.5 bg-muted rounded w-32" />
            <div className="h-2.5 bg-muted rounded w-24" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-muted" />
          ))}
        </div>
      </div>

      {/* Voice interface skeleton */}
      <div className="rounded-2xl border border-border bg-card p-8 animate-pulse">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-1 h-12">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="w-1 h-4 rounded-full bg-muted" />
            ))}
          </div>
          <div className="h-24 w-24 rounded-full bg-muted" />
          <div className="h-3 bg-muted rounded w-32" />
        </div>
      </div>

      {/* Conversation skeleton */}
      <div className="rounded-2xl border border-border bg-card p-4 animate-pulse">
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
                  <div className="h-7 w-7 rounded-full bg-muted" />
                )}
                <div className="p-3 rounded-2xl bg-muted/50">
                  <div className="h-3 bg-muted rounded w-48 mb-1" />
                  <div className="h-3 bg-muted rounded w-32" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input bar skeleton */}
      <div className="rounded-2xl border border-border bg-card p-4 animate-pulse">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 bg-muted rounded w-48" />
          <div className="h-24 w-24 rounded-full bg-muted" />
          <div className="h-11 rounded-full bg-muted w-full" />
        </div>
      </div>
    </div>
  );
};

VoiceSkeleton.displayName = "VoiceSkeleton";

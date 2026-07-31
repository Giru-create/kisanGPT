// ─────────────────────────────────────────────────────────────────────────────
// SettingsSkeleton.tsx
// KisanGPT — Settings loading skeleton
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React from "react";

export const SettingsSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-background text-foreground">
      <main className="flex-1 p-4 max-w-5xl mx-auto w-full">
        <div className="mb-6">
          <div className="h-8 w-48 rounded-lg bg-muted animate-pulse" />
          <div className="h-4 w-72 mt-2 rounded bg-muted animate-pulse" />
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-64 space-y-2">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="h-12 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>

          <div className="flex-1 space-y-4">
            <div className="h-12 rounded-xl bg-muted animate-pulse" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-24 rounded-2xl bg-muted animate-pulse"
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

SettingsSkeleton.displayName = "SettingsSkeleton";

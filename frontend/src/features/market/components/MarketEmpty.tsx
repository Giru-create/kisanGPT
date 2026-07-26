// ─────────────────────────────────────────────────────────────────────────────
// MarketEmpty.tsx
// KisanGPT — Market Intelligence empty state
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React from "react";
import { BarChart3 } from "lucide-react";

export const MarketEmpty: React.FC = () => {
  return (
    <div
      role="status"
      className="rounded-2xl border border-border bg-card p-6 flex flex-col items-center gap-3 text-center"
    >
      <BarChart3
        size={28}
        className="text-muted-foreground"
        aria-hidden="true"
      />
      <p className="text-sm font-medium text-foreground">
        No market data available
      </p>
      <p className="text-xs text-muted-foreground max-w-xs">
        Select a commodity to view current mandi prices and trends.
      </p>
    </div>
  );
};

MarketEmpty.displayName = "MarketEmpty";

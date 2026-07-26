// ─────────────────────────────────────────────────────────────────────────────
// MarketOverviewCard.tsx
// KisanGPT — Market overview summary card
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { MarketOverview } from "../types/market.types";

interface MarketOverviewCardProps {
  data: MarketOverview;
}

export const MarketOverviewCard: React.FC<MarketOverviewCardProps> = ({
  data,
}) => {
  return (
    <section
      role="region"
      aria-label="Market Overview"
      className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm"
    >
      <h2 className="font-semibold text-sm sm:text-base text-foreground mb-4">
        Market Overview
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Top Commodities */}
        <div className="rounded-xl border border-border bg-muted/20 p-3">
          <p className="text-xs text-muted-foreground mb-1">Top Commodities</p>
          <p className="text-2xl font-bold text-foreground tabular-nums">
            {data.top_commodities.length}
          </p>
        </div>

        {/* Rising */}
        <div className="rounded-xl border border-border bg-muted/20 p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingUp
              size={14}
              className="text-emerald-600 dark:text-emerald-400"
              aria-hidden="true"
            />
            <p className="text-xs text-muted-foreground">Rising</p>
          </div>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
            {data.rising.length}
          </p>
        </div>

        {/* Falling */}
        <div className="rounded-xl border border-border bg-muted/20 p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingDown
              size={14}
              className="text-red-600 dark:text-red-400"
              aria-hidden="true"
            />
            <p className="text-xs text-muted-foreground">Falling</p>
          </div>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400 tabular-nums">
            {data.falling.length}
          </p>
        </div>
      </div>
    </section>
  );
};

MarketOverviewCard.displayName = "MarketOverviewCard";

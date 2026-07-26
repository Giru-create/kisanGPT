// ─────────────────────────────────────────────────────────────────────────────
// TrendChart.tsx
// KisanGPT — Price trend mini-chart (text-based sparkline)
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React from "react";
import { TrendingUp, TrendingDown, Minus, Activity } from "lucide-react";
import type { PriceTrend, TrendDirection } from "../types/market.types";

interface TrendChartProps {
  trend: PriceTrend;
}

const TREND_CONFIG: Record<
  TrendDirection,
  {
    icon: React.FC<{ size?: number; className?: string }>;
    label: string;
    color: string;
  }
> = {
  rising: {
    icon: TrendingUp,
    label: "Rising",
    color: "text-emerald-600 dark:text-emerald-400",
  },
  falling: {
    icon: TrendingDown,
    label: "Falling",
    color: "text-red-600 dark:text-red-400",
  },
  stable: {
    icon: Minus,
    label: "Stable",
    color: "text-muted-foreground",
  },
  volatile: {
    icon: Activity,
    label: "Volatile",
    color: "text-amber-600 dark:text-amber-400",
  },
};

export const TrendChart: React.FC<TrendChartProps> = ({ trend }) => {
  const config = TREND_CONFIG[trend.trend_direction];
  const Icon = config.icon;

  const max = Math.max(...trend.prices);
  const min = Math.min(...trend.prices);
  const range = max - min || 1;

  const sparklinePoints = trend.prices
    .map((p, i) => {
      const x = (i / (trend.prices.length - 1)) * 100;
      const y = 100 - ((p - min) / range) * 80 - 10;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <section
      role="region"
      aria-label={`${trend.commodity} price trend`}
      className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-sm sm:text-base text-foreground">
          {trend.commodity} — 30-Day Trend
        </h2>
        <div className={`flex items-center gap-1 ${config.color}`}>
          <Icon size={16} aria-hidden="true" />
          <span className="text-xs font-semibold">{config.label}</span>
        </div>
      </div>

      {/* Sparkline */}
      <div className="w-full h-24 mb-4">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="w-full h-full"
          aria-hidden="true"
        >
          <polyline
            points={sparklinePoints}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className={config.color}
          />
        </svg>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-lg border border-border bg-muted/20 p-2 text-center">
          <p className="text-[10px] text-muted-foreground">Avg</p>
          <p className="text-sm font-bold text-foreground tabular-nums">
            ₹{trend.avg_price.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-muted/20 p-2 text-center">
          <p className="text-[10px] text-muted-foreground">Min</p>
          <p className="text-sm font-bold text-foreground tabular-nums">
            ₹{trend.min_price.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-muted/20 p-2 text-center">
          <p className="text-[10px] text-muted-foreground">Max</p>
          <p className="text-sm font-bold text-foreground tabular-nums">
            ₹{trend.max_price.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-muted/20 p-2 text-center">
          <p className="text-[10px] text-muted-foreground">Range</p>
          <p className="text-sm font-bold text-foreground tabular-nums">
            ₹{trend.price_range.toLocaleString("en-IN")}
          </p>
        </div>
      </div>
    </section>
  );
};

TrendChart.displayName = "TrendChart";

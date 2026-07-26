// ─────────────────────────────────────────────────────────────────────────────
// TrendChart.tsx
// KisanGPT — Price trend chart: sparkline + stats + timeframe + accessible table
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  Table2,
  BarChart2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { PriceTrend, TrendDirection } from "../types/market.types";

type Timeframe = "7d" | "14d" | "30d";

const TIMEFRAME_LABELS: Record<Timeframe, string> = {
  "7d": "7 Days",
  "14d": "14 Days",
  "30d": "30 Days",
};

const TREND_CONFIG: Record<
  TrendDirection,
  {
    Icon: React.FC<{
      size?: number;
      className?: string;
      "aria-hidden"?: boolean;
    }>;
    label: string;
    textColor: string;
    strokeColor: string;
    fillColor: string;
  }
> = {
  rising: {
    Icon: TrendingUp,
    label: "Rising",
    textColor: "text-emerald-600 dark:text-emerald-400",
    strokeColor: "stroke-emerald-500",
    fillColor: "fill-emerald-500/10",
  },
  falling: {
    Icon: TrendingDown,
    label: "Falling",
    textColor: "text-red-600 dark:text-red-400",
    strokeColor: "stroke-red-500",
    fillColor: "fill-red-500/10",
  },
  stable: {
    Icon: Minus,
    label: "Stable",
    textColor: "text-muted-foreground",
    strokeColor: "stroke-muted-foreground",
    fillColor: "fill-muted/30",
  },
  volatile: {
    Icon: Activity,
    label: "Volatile",
    textColor: "text-amber-600 dark:text-amber-400",
    strokeColor: "stroke-amber-500",
    fillColor: "fill-amber-500/10",
  },
};

interface TrendChartProps {
  trend: PriceTrend;
}

export const TrendChart: React.FC<TrendChartProps> = ({ trend }) => {
  const [timeframe, setTimeframe] = useState<Timeframe>("30d");
  const [showTable, setShowTable] = useState(false);

  const config = TREND_CONFIG[trend.trend_direction];
  const { Icon } = config;

  // Slice data based on selected timeframe
  const sliceCount = timeframe === "7d" ? 7 : timeframe === "14d" ? 14 : 30;
  const slicedPrices = trend.prices.slice(-sliceCount);
  const slicedDates = trend.dates.slice(-sliceCount);

  const max = Math.max(...slicedPrices);
  const min = Math.min(...slicedPrices);
  const range = max - min || 1;

  // Build SVG polyline points — coordinates from 0–200 wide, 0–60 tall
  const W = 200;
  const H = 60;
  const points = slicedPrices
    .map((p, i) => {
      const x = (i / (slicedPrices.length - 1)) * W;
      const y = H - ((p - min) / range) * (H - 6) - 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  // Build a closed polygon path for the fill area
  const fillPoints = [
    `0,${H}`,
    ...slicedPrices.map((p, i) => {
      const x = (i / (slicedPrices.length - 1)) * W;
      const y = H - ((p - min) / range) * (H - 6) - 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }),
    `${W},${H}`,
  ].join(" ");

  const stats = [
    {
      label: "Avg",
      value: trend.avg_price,
      ariaLabel: `Average price ₹${trend.avg_price}`,
    },
    {
      label: "Min",
      value: trend.min_price,
      ariaLabel: `Minimum price ₹${trend.min_price}`,
    },
    {
      label: "Max",
      value: trend.max_price,
      ariaLabel: `Maximum price ₹${trend.max_price}`,
    },
    {
      label: "Range",
      value: trend.price_range,
      ariaLabel: `Price range ₹${trend.price_range}`,
    },
  ];

  return (
    <section
      role="region"
      aria-label={`${trend.commodity} price trend chart`}
      className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4 gap-2">
        <div>
          <h2 className="font-bold text-sm sm:text-base text-foreground">
            Price Trend
          </h2>
          <div className={`flex items-center gap-1 mt-0.5 ${config.textColor}`}>
            <Icon size={14} aria-hidden />
            <span className="text-xs font-semibold">{config.label}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Accessible data table toggle */}
          <button
            type="button"
            onClick={() => setShowTable((v) => !v)}
            aria-expanded={showTable}
            aria-controls="trend-data-table"
            aria-label={showTable ? "Show chart view" : "Show data table view"}
            title={showTable ? "Show chart" : "Show table"}
            className="flex items-center justify-center h-9 w-9 min-h-[44px] min-w-[44px] rounded-xl border border-border bg-muted/30 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {showTable ? <BarChart2 size={15} /> : <Table2 size={15} />}
          </button>

          {/* Timeframe switcher */}
          <div
            role="group"
            aria-label="Select time period"
            className="flex gap-1"
          >
            {(["7d", "14d", "30d"] as Timeframe[]).map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => setTimeframe(tf)}
                aria-pressed={timeframe === tf}
                className={`px-2.5 py-1.5 min-h-[36px] rounded-lg text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  timeframe === tf
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/40 text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {TIMEFRAME_LABELS[tf]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!showTable ? (
          <motion.div
            key="chart"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* SVG Sparkline */}
            <div className="w-full mb-4 rounded-xl overflow-hidden bg-muted/20 px-2 py-2">
              <svg
                viewBox={`0 0 ${W} ${H}`}
                preserveAspectRatio="none"
                className="w-full h-20"
                role="img"
                aria-label={`${trend.commodity} price sparkline over ${TIMEFRAME_LABELS[timeframe]}`}
              >
                {/* Area fill */}
                <polygon points={fillPoints} className={config.fillColor} />
                {/* Price line */}
                <polyline
                  points={points}
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={config.strokeColor}
                />
              </svg>
            </div>

            {/* Min / Max labels */}
            <div className="flex justify-between text-[10px] text-muted-foreground mb-4 px-1">
              <span>↓ ₹{min.toLocaleString("en-IN")} (low)</span>
              <span>↑ ₹{max.toLocaleString("en-IN")} (high)</span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="table"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Accessible data table */}
            <div
              id="trend-data-table"
              className="rounded-xl border border-border overflow-hidden mb-4"
            >
              <div className="overflow-x-auto max-h-48">
                <table className="w-full text-xs">
                  <caption className="sr-only">
                    {trend.commodity} daily price data for the last{" "}
                    {TIMEFRAME_LABELS[timeframe]}
                  </caption>
                  <thead className="bg-muted/40 sticky top-0">
                    <tr>
                      <th
                        scope="col"
                        className="px-3 py-2 text-left font-semibold text-muted-foreground"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-2 text-right font-semibold text-muted-foreground"
                      >
                        Price (₹/qtl)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {slicedDates.map((date, i) => (
                      <tr
                        key={date}
                        className="border-t border-border hover:bg-muted/20 transition-colors"
                      >
                        <td className="px-3 py-2 text-muted-foreground">
                          {date}
                        </td>
                        <td className="px-3 py-2 text-right font-semibold text-foreground tabular-nums">
                          ₹{(slicedPrices[i] ?? 0).toLocaleString("en-IN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats grid — always visible */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-muted/20 p-3 text-center"
            aria-label={stat.ariaLabel}
          >
            <p className="text-[10px] text-muted-foreground font-medium mb-0.5">
              {stat.label}
            </p>
            <p className="text-sm font-bold text-foreground tabular-nums">
              ₹{stat.value.toLocaleString("en-IN")}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

TrendChart.displayName = "TrendChart";

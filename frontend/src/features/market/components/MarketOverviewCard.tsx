// ─────────────────────────────────────────────────────────────────────────────
// MarketOverviewCard.tsx
// KisanGPT — Market overview hero summary card
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React from "react";
import { TrendingUp, TrendingDown, BarChart3, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import type { MarketOverview } from "../types/market.types";

interface MarketOverviewCardProps {
  data: MarketOverview;
  onRefresh?: () => void;
}

const StatBox: React.FC<{
  label: string;
  value: number;
  icon: React.ReactNode;
  colorClass: string;
  bgClass: string;
}> = ({ label, value, icon, colorClass, bgClass }) => (
  <div className={`rounded-2xl border border-border p-4 ${bgClass}`}>
    <div className="flex items-center gap-2 mb-2">
      <span className={colorClass} aria-hidden="true">
        {icon}
      </span>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
    </div>
    <motion.p
      className={`text-3xl font-extrabold tabular-nums ${colorClass}`}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      {value}
    </motion.p>
  </div>
);

export const MarketOverviewCard: React.FC<MarketOverviewCardProps> = ({
  data,
  onRefresh,
}) => {
  const updatedTime = new Date(data.generated_at).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <section
      role="region"
      aria-label="Market Overview"
      className="rounded-2xl border border-border bg-card p-5 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-bold text-base text-foreground">
            Today&apos;s Market Snapshot
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Updated at {updatedTime} · Agmarknet data
          </p>
        </div>
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            aria-label="Refresh market data"
            className="flex items-center justify-center h-9 w-9 rounded-full border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <RefreshCw size={15} />
          </button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <StatBox
          label="Tracked"
          value={data.top_commodities.length}
          icon={<BarChart3 size={16} />}
          colorClass="text-foreground"
          bgClass="bg-muted/30"
        />
        <StatBox
          label="Rising ↑"
          value={data.rising.length}
          icon={<TrendingUp size={16} />}
          colorClass="text-emerald-600 dark:text-emerald-400"
          bgClass="bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-800/40"
        />
        <StatBox
          label="Falling ↓"
          value={data.falling.length}
          icon={<TrendingDown size={16} />}
          colorClass="text-red-600 dark:text-red-400"
          bgClass="bg-red-50 dark:bg-red-950/40 border-red-200/60 dark:border-red-800/40"
        />
      </div>

      {/* Top movers strip */}
      {data.top_commodities.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">
            Top Commodities
          </p>
          <div className="flex flex-wrap gap-2">
            {data.top_commodities.map((c) => (
              <div
                key={c.commodity}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/30 px-3 py-1"
              >
                <span className="text-xs font-semibold text-foreground">
                  {c.commodity}
                </span>
                <span
                  className={`text-[11px] font-bold tabular-nums ${
                    c.is_rise
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                  aria-label={`${c.is_rise ? "Up" : "Down"} ₹${Math.abs(c.change_amount)}`}
                >
                  {c.is_rise ? "▲" : "▼"} ₹
                  {Math.abs(c.change_amount).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

MarketOverviewCard.displayName = "MarketOverviewCard";

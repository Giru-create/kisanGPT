"use client";

import React from "react";
import Link from "next/link";
import { TrendingUp, TrendingDown, ArrowUpRight } from "lucide-react";
import type { MarketTrendItem } from "../types/dashboard.types";

interface MarketTrendsCardProps {
  trends: MarketTrendItem[];
}

const MiniSparkline: React.FC<{ isRise: boolean }> = ({ isRise }) => {
  const points = "M0,20 L8,16 L16,18 L24,12 L32,14 L40,8 L48,4 L56,6 L64,2";
  return (
    <svg
      width="64"
      height="24"
      viewBox="0 0 64 24"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d={points}
        stroke={isRise ? "#10b981" : "#ef4444"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const MarketTrendsCard: React.FC<MarketTrendsCardProps> = ({
  trends,
}) => {
  const primary = trends[0];

  return (
    <section
      role="region"
      aria-label="Market Trends"
      className="rounded-2xl border border-border bg-card p-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Market Prices
        </h2>
        <span className="text-[11px] text-muted-foreground font-medium">
          Live MCX/NCDEX
        </span>
      </div>

      {primary && (
        <div className="flex items-center justify-between mb-5 p-4 rounded-xl bg-muted/30 border border-border/40">
          <div>
            <p className="text-xs text-muted-foreground font-medium mb-1">
              Featured Commodity
            </p>
            <h4 className="font-bold text-foreground text-lg">
              {primary.commodity}
            </h4>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-2xl font-bold text-foreground tabular-nums">
                {primary.price}
              </span>
              <span
                className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md ${
                  primary.isRise
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-red-500/10 text-red-600 dark:text-red-400"
                }`}
              >
                {primary.isRise ? (
                  <TrendingUp size={12} aria-hidden="true" />
                ) : (
                  <TrendingDown size={12} aria-hidden="true" />
                )}
                {primary.isRise ? "+" : ""}
                {primary.changePercent}%
              </span>
            </div>
          </div>
          <MiniSparkline isRise={primary.isRise} />
        </div>
      )}

      <div className="flex flex-col gap-1">
        {trends.slice(1).map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 hover:bg-muted/40 rounded-xl transition-colors"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-2 h-2 rounded-full ${
                  item.isRise ? "bg-emerald-500" : "bg-red-500"
                }`}
              />
              <span className="text-sm font-medium text-foreground">
                {item.commodity}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-foreground tabular-nums">
                {item.price}
              </span>
              <span
                className={`text-xs font-semibold tabular-nums ${
                  item.isRise
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {item.isRise ? "+" : ""}
                {item.changePercent}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border/60">
        <Link
          href="/market"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          View Full Market
          <ArrowUpRight size={13} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
};

MarketTrendsCard.displayName = "MarketTrendsCard";

"use client";

import React from "react";
import { Lightbulb } from "lucide-react";
import type { MarketTrendItem } from "../types/dashboard.types";

interface MarketTrendsCardProps {
  trends: MarketTrendItem[];
}

const MiniBarChart: React.FC = () => {
  const bars = [40, 55, 45, 60, 75, 85, 100];
  return (
    <div className="w-32 h-12 flex items-end gap-1" aria-hidden="true">
      {bars.map((height, i) => (
        <div
          key={i}
          className="w-2 rounded-t-sm bg-primary"
          style={{
            height: `${height}%`,
            opacity: 0.2 + (i / bars.length) * 0.8,
          }}
        />
      ))}
    </div>
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
      className="bg-card border border-border rounded-xl p-5 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-base text-foreground">
          Market Trends
        </h2>
        <span className="text-xs text-muted-foreground">
          Live from MCX/NCDEX
        </span>
      </div>

      {primary && (
        <div className="flex items-center justify-between mb-5">
          <div>
            <h4 className="font-bold text-foreground">{primary.commodity}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-bold text-primary">
                {primary.price}
              </span>
              <span
                className={`text-xs font-medium ${
                  primary.isRise
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {primary.isRise ? "+" : ""}
                {primary.changePercent}%
              </span>
            </div>
          </div>
          <MiniBarChart />
        </div>
      )}

      <div className="space-y-1">
        {trends.slice(1).map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-2.5 hover:bg-muted rounded-lg transition-colors cursor-pointer"
          >
            <span className="text-sm font-medium text-foreground">
              {item.commodity}
            </span>
            <span className="text-sm font-bold text-foreground">
              {item.price}{" "}
              <span
                className={`font-medium text-[10px] ml-1 ${
                  item.isRise
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {item.isRise ? "+" : ""}
                {item.changePercent}%
              </span>
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          <Lightbulb
            size={14}
            className="text-amber-500 shrink-0"
            aria-hidden="true"
          />
          AI Insight: Market liquidity suggests a peak in 10-14 days.
        </p>
      </div>
    </section>
  );
};

MarketTrendsCard.displayName = "MarketTrendsCard";

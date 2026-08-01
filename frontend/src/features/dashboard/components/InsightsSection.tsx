"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  TrendingUp,
  ArrowUpRight,
  Lightbulb,
  Sprout,
  CloudRain,
} from "lucide-react";
import type { MarketTrendItem, PriorityAlert } from "../types/dashboard.types";

interface InsightsSectionProps {
  marketTrends: MarketTrendItem[];
  priorityAlerts: PriorityAlert[];
}

const ALERT_STYLES: Record<
  PriorityAlert["type"],
  { icon: React.ElementType; color: string; bg: string; border: string }
> = {
  frost: {
    icon: CloudRain,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/8",
    border: "border-blue-500/20",
  },
  subsidy: {
    icon: Sprout,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/8",
    border: "border-emerald-500/20",
  },
  weather: {
    icon: CloudRain,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/8",
    border: "border-amber-500/20",
  },
  pest: {
    icon: Sprout,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-500/8",
    border: "border-red-500/20",
  },
};

export const InsightsSection: React.FC<InsightsSectionProps> = ({
  marketTrends,
  priorityAlerts,
}) => {
  return (
    <section role="region" aria-label="Farm Insights">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 rounded-full bg-primary" />
          <h2 className="text-lg font-semibold text-foreground">Farm Insights</h2>
        </div>
        <Link
          href="/market"
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          View All
          <ArrowUpRight size={13} aria-hidden="true" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Market insight */}
        {marketTrends[0] && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center">
                <Lightbulb size={18} className="text-violet-600 dark:text-violet-400" aria-hidden="true" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Market Intelligence
              </span>
            </div>
            <p className="text-sm font-semibold text-foreground leading-snug">
              {marketTrends[0].commodity} prices{" "}
              {marketTrends[0].isRise ? "surged" : "dropped"} by{" "}
              <span
                className={
                  marketTrends[0].isRise
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-600 dark:text-red-400"
                }
              >
                {marketTrends[0].isRise ? "+" : ""}
                {marketTrends[0].changePercent}%
              </span>{" "}
              today.
            </p>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              AI recommends {marketTrends[0].isRise ? "holding for 10-14 days for peak pricing" : "selling now before further decline"}.
            </p>
          </motion.div>
        )}

        {/* Priority alert insights */}
        {priorityAlerts.slice(0, 2).map((alert, index) => {
          const style = ALERT_STYLES[alert.type] ?? ALERT_STYLES.frost;
          const AlertIcon = style.icon;

          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + index * 0.05 }}
              className={`rounded-2xl border ${style.border} ${style.bg} p-5 shadow-sm hover:shadow-md transition-all`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-9 h-9 rounded-xl ${style.bg} flex items-center justify-center`}>
                  <AlertIcon size={18} className={style.color} aria-hidden="true" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Priority Alert
                </span>
              </div>
              <p className="text-sm font-semibold text-foreground leading-snug">
                {alert.title}
              </p>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                {alert.description}
              </p>
            </motion.div>
          );
        })}

        {/* Quick action card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl border border-dashed border-border bg-muted/20 p-5 flex flex-col items-center justify-center text-center hover:bg-muted/40 transition-all"
        >
          <Link href="/advisor" className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <TrendingUp size={22} className="text-primary" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Get AI Analysis
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Ask about any farming topic
              </p>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

InsightsSection.displayName = "InsightsSection";
